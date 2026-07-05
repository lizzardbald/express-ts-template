import { Server } from 'https';
import { Server as WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { AuthService } from '../Auth.service';
import { Logger } from '../logger/Logger.service';
import { WebSocketEvent } from '../../interfaces/WebSocketEvent.enum';

/**
 * Service for managing the WebSocket server, handling connections, and broadcasting messages.
 */
export class WebSocketService {
    public static instance: WebSocketServer;

    /**
     * Creates and initializes the WebSocket server instance.
     * It attaches to the provided HTTP server and sets up connection listeners.
     * @param {Server} app - The HTTP server instance.
     */
    public static createWebSockerInstance(app: Server) {
        if (WebSocketService.instance) {
            Logger.log('Web socket already inited!');

            return;
        }

        WebSocketService.instance = new WebSocketServer({ server: app });
        WebSocketService.instance.on(
            WebSocketEvent.Connection,
            this[WebSocketEvent.Connection],
        );
        WebSocketService.instance.on('error', (err) => {
            Logger.error(`ERROR(socket): ${err.message}`);
        });
    }

    /**
     * Handles new client connections.
     * It verifies the JWT from the connection URL and closes the connection if authentication fails.
     * @param {WebSocket} socket - The client WebSocket connection.
     * @param {IncomingMessage} request - The initial HTTP request.
     * @private
     */
    public static async [WebSocketEvent.Connection](
        socket: WebSocket,
        request: IncomingMessage,
    ) {
        const authService = new AuthService();
        const token = request.url?.replace('/?jwt=', '');

        try {
            authService.verifyToken(token as string);
        } catch (error) {
            Logger.error(
                'Unauthorized connection attempt from ' +
                    request.socket.remoteAddress,
            );
            socket.send(JSON.stringify({ Forbidden: 401 }));
            socket.close();
        }

        Logger.log('Connection! From ' + request.socket.remoteAddress);

        socket.on(WebSocketEvent.Close, () => {
            Logger.log('Closed socket.');
        });

        socket.on(WebSocketEvent.Error, (error) => {
            Logger.error(`ERROR(socket): ${error.message}`);
        });
    }

    /**
     * Broadcasts a message to all connected WebSocket clients.
     * @param {object} message - The message object to be sent (will be stringified).
     */
    public static sendMessage(message: object) {
        for (const client of WebSocketService.instance.clients) {
            client.send(JSON.stringify(message));
        }
    }
}
