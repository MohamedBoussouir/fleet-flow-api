const errorMiddleware = require('../../../src/middlewares/errorMiddleware');

describe("Unit Tests - errorMiddleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    it("Doit capturer et retourner l'erreur du serveur", () => {
        const error = new Error("Erreur serveur critique");

        errorMiddleware(error, req, res, next);

        expect(res.status).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            message: "Erreur serveur critique"
        }));
    });
});