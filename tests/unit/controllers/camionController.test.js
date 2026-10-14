const CamionController = require('../../../src/controllers/camionController');
const Camion = require('../../../src/models/Camion');

jest.mock('../../../src/models/Camion');

describe("Unit Tests - CamionController", () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();
        req = { body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    it("Doit récupérer tous les camions avec succès (200)", async () => {
        const mockCamions = [{ immatriculation: '123-A-26', modele: 'Volvo' }];
        Camion.find.mockResolvedValue(mockCamions);

        await CamionController.getAll(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockCamions);
    });
});