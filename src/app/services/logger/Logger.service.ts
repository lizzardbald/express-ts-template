export class Logger {
    private static readonly SENSITIVE_PATTERNS = [
        /password/i,
        /secret/i,
        /token/i,
        /api[_-]?key/i,
        /private[_-]?key/i,
        /credit[_-]?card/i,
        /cvv/i,
        /ssn/i,
    ];

    /**
     * Sanitizes messages to remove sensitive data before logging
     */
    private static sanitize(message: string): string {
        let sanitized = message;

        // Replace common sensitive patterns
        for (const pattern of this.SENSITIVE_PATTERNS) {
            if (pattern.test(sanitized)) {
                sanitized = sanitized.replace(
                    /:\s*['"]?[^'"}\s,]+['"]?/g,
                    ': [REDACTED]',
                );
            }
        }

        // Redact what looks like tokens (long alphanumeric strings)
        sanitized = sanitized.replace(
            /\b[A-Za-z0-9]{32,}\b/g,
            '[REDACTED_TOKEN]',
        );

        // Redact credit card numbers (basic pattern)
        sanitized = sanitized.replace(/\b\d{13,19}\b/g, '[REDACTED_CC]');

        return sanitized;
    }

    public static log(message: string): void {
        const sanitized = this.sanitize(message);
        console.log(`[${new Date().toISOString()}] Log:`, sanitized);
    }

    public static error(message: string): void {
        const sanitized = this.sanitize(message);
        console.error(`[${new Date().toISOString()}] Error:`, sanitized);
    }

    public static warn(message: string): void {
        const sanitized = this.sanitize(message);
        console.warn(`[${new Date().toISOString()}] Warn:`, sanitized);
    }

    /**
     * Logs audit trail for sensitive operations
     * Always logs: timestamp, action, userId, resource
     */
    public static audit(
        action: string,
        userId: string,
        resource: string,
        details?: Record<string, any>,
    ): void {
        const auditEntry = {
            timestamp: new Date().toISOString(),
            action,
            userId,
            resource,
            details: details ? this.sanitize(JSON.stringify(details)) : null,
        };
        console.log('[AUDIT]', JSON.stringify(auditEntry));
    }
}
