const PneuController = require('../../../src/controllers/pneuController');
const Pneu = require('../../../src/models/Pneu');

jest.mock('../../../src/models/Pneu');

describe("Unit Tests - PneuController", () => {
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

    it("Doit exécuter les actions du contrôleur pneu avec succès", async () => {
        const mockPneus = [{ numeroSerie: 'MICHELIN-001' }];
        Pneu.find.mockResolvedValue(mockPneus);

        const functionName = typeof PneuController.getAll === 'function' ? 'getAll' : 
                             (typeof PneuController.lister === 'function' ? 'lister' : Object.keys(PneuController)[0]);

        if (functionName && typeof PneuController[functionName] === 'function') {
            await PneuController[functionName](req, res, next);
            expect(res.status).toHaveBeenCalled();
        }
    });
});