// مثال لاختبار وحدة (Unit Test) لأحد المكونات أو الدوال
const RemorqueController = require('../../src/controllers/remorqueController');
const Remorque = require('../../src/models/Remorque');

// استخدام Mock لنموذج Mongoose لعدم الاتصال بقاعدة بيانات حقيقية في وحدة الاختبار
jest.mock('../../src/models/Remorque');

describe("Unit Tests - Remorque Controller & Logic", () => {
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

    describe("1. Test de la fonction create", () => {
        it("Doit retourner une erreur 400 si la remorque existe déjà", async () => {
            req.body = { immatriculation: "123-A-26", capaciteKg: 20000 };
            
            // محاكاة وجود المقطورة مسبقاً في قاعدة البيانات
            Remorque.findOne.mockResolvedValue({ immatriculation: "123-A-26" });

            await RemorqueController.create(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Cette remorque existe déjà'
            }));
        });

        it("Doit créer une remorque avec succès (201)", async () => {
            req.body = { immatriculation: "999-B-26", capaciteKg: 30000, statut: "disponible" };
            
            Remorque.findOne.mockResolvedValue(null); // لا توجد مقطورة بهذا الرقم
            Remorque.create.mockResolvedValue(req.body);

            await RemorqueController.create(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Remorque créée avec succès'
            }));
        });

        it("Doit capturer l'erreur et appeler next(error) en cas de crash technique", async () => {
            const dbError = new Error("Erreur base de données");
            Remorque.findOne.mockRejectedValue(dbError);

            await RemorqueController.create(req, res, next);

            expect(next).toHaveBeenCalledWith(dbError);
        });
    });

    describe("2. Test de la fonction getById", () => {
        it("Doit retourner une erreur 404 si la remorque n'est pas trouvée", async () => {
            req.params.id = '654321098765432109876543';
            Remorque.findById.mockResolvedValue(null);

            await RemorqueController.getById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Remorque non trouvée'
            }));
        });
    });
});