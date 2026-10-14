const validateDto = require('../../../src/middlewares/validateDto');

describe("Unit Tests - validateDto Middleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    it("Doit appeler next() si les données respectent le schéma Joi/Zod", () => {
        const mockSchema = {
            validate: () => ({ error: null, value: { name: 'Test' } })
        };
        req.body = { name: 'Test' };

        const middleware = validateDto(mockSchema);
        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it("Doit retourner une erreur 400 si les données sont invalides", () => {
        const mockSchema = {
            validate: () => ({ error: { details: [{ message: 'Erreur de validation' }] } })
        };
        req.body = { name: '' };

        const middleware = validateDto(mockSchema);
        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false
        }));
        expect(next).not.toHaveBeenCalled();
    });
});