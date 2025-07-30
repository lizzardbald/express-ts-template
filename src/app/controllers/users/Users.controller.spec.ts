import { expect } from 'chai';
import Sinon from 'sinon';
import { Method } from '../../interfaces/Method.enum';
import { Controller } from '../Controller';
import { UsersController } from './Users.controller';

describe('UsersController', () => {
    let controller: UsersController;
    const sequelize = Sinon.stub();

    beforeEach(() => {
        controller = new UsersController();
    });

    afterEach(() => {
        Sinon.restore();
    });

    it('Should be able to instance the controller', () => {
        expect(controller).to.exist;
    });

    it('Should be an instance of Controller', () => {
        expect(controller).to.be.instanceOf(Controller);
    });

    it('Should be able to get users ', async () => {
        // Arrange
        Sinon.stub(controller, Method.GET).resolves([]);
        const request = {};
        const response = {
            status: Sinon.stub().returnsThis(),
            send: Sinon.stub(),
        };

        // Act
        await controller[Method.GET](request as any, response as any);

        // Assert
        expect(response.status.calledOnceWith(200));
        expect(response.send.calledOnceWith([]));
    });

    it('Should be able to create user', async () => {
        // Arrange
        Sinon.stub(controller, Method.POST).resolves();
        const request = {};
        const response = {
            status: Sinon.stub().returnsThis(),
            send: Sinon.stub(),
        };

        // Act
        await controller[Method.POST](request as any, response as any);

        // Assert
        expect(response.status.calledOnceWith(200));
        expect(response.send.calledOnceWith());
    });
});
