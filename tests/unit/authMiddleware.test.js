const authMiddleware = require('../../src/middlewares/authMiddleware');
const JwtService = require('../../src/services/jwtService');

// عمل Mock لخدمة JwtService
jest.mock('../../src/services/jwtService');

describe("Unit Tests - authMiddleware", () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    it("Doit rejeter la requête avec un code 401 si aucun token n'est fourni", () => {
        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            message: expect.any(String)
        }));
        expect(next).not.toHaveBeenCalled();
    });

    it("Doit rejeter la requête avec un code 401 si le format du token est incorrect (pas de Bearer)", () => {
        req.headers.authorization = 'Token12345';

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false
        }));
        expect(next).not.toHaveBeenCalled();
    });

    it("Doit attacher l'utilisateur à req.user et appeler next() si le token est valide", () => {
        req.headers.authorization = 'Bearer valid_token_123';
        const mockPayload = { userId: '123', role: 'Admin' };
        
        JwtService.verifyAccessToken.mockReturnValue(mockPayload);

        authMiddleware(req, res, next);

        expect(req.user).toEqual(mockPayload);
        expect(next).toHaveBeenCalled();
    });

    it("Doit rejeter la requête avec 401 si le token est invalide ou expiré", () => {
        req.headers.authorization = 'Bearer invalid_token';
        
        const jwtError = new Error('Invalid token');
        jwtError.name = 'JsonWebTokenError';
        JwtService.verifyAccessToken.mockImplementation(() => {
            throw jwtError;
        });

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            message: 'Token malformé ou falsifié'
        }));
        expect(next).not.toHaveBeenCalled();
    });
});