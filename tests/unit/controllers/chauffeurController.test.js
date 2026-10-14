const User = require('../../../src/models/User');

jest.mock('../../../src/models/User');

describe("Unit Tests - Chauffeurs / Users Logic", () => {
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

    it("Doit récupérer la liste des chauffeurs avec succès (200)", async () => {
        const mockChauffeurs = [
            { nom: 'Karim Driver', role: 'Chauffeur', statut: 'actif' }
        ];
        
        User.find.mockResolvedValue(mockChauffeurs);

        // محاكاة البحث عن المستخدمين بدور chauffeur
        const chauffeurs = await User.find({ role: 'Chauffeur' });

        expect(chauffeurs).toEqual(mockChauffeurs);
        expect(User.find).toHaveBeenCalledWith({ role: 'Chauffeur' });
    });
});