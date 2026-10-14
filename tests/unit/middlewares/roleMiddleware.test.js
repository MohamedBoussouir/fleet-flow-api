const roleMiddleware = require('../../../src/middlewares/roleMiddleware');

describe("Unit Tests - roleMiddleware", () => {
    let req, res, next;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    it("Doit autoriser l'accès si le rôle de l'utilisateur correspond", () => {
        req = { user: { role: 'Admin' } };
        const middleware = roleMiddleware('Admin');

        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it("Doit rejeter l'accès avec un code 403 si le rôle ne correspond pas", () => {
        req = { user: { role: 'Chauffeur' } };
        const middleware = roleMiddleware('Admin');

        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Accès interdit: Permissions insuffisantes'
        }));
        expect(next).not.toHaveBeenCalled();
    });
});