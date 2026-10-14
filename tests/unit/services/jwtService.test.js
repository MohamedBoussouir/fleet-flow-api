const jwt = require('jsonwebtoken');
const JwtService = require('../../../src/services/jwtService');

describe("Unit Tests - JwtService", () => {
    const originalEnv = process.env.JWT_SECRET;

    beforeAll(() => {
        process.env.JWT_SECRET = 'secret_test_123';
    });

    afterAll(() => {
        process.env.JWT_SECRET = originalEnv;
    });

    it("Doit générer un access token valide", () => {
        const payload = { userId: '123', role: 'Admin' };
        const token = JwtService.generateAccessToken(payload);

        expect(token).toBeDefined();
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded.userId).toBe('123');
    });

    it("Doit vérifier et décoder un access token valide", () => {
        const payload = { userId: '456', role: 'Chauffeur' };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        const decoded = JwtService.verifyAccessToken(token);
        expect(decoded).toBeDefined();
        expect(decoded.userId).toBe('456');
    });
});