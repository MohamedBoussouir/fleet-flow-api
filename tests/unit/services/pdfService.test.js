const PdfService = require('../../../src/services/pdfService');

describe("Unit Tests - PdfService", () => {
    it("Doit générer un ordre de mission PDF avec succès", (done) => {
        const mockTrajet = {
            _id: '654321098765432109876543',
            createdAt: new Date(),
            siteDepart: 'Youssoufia',
            siteArrivee: 'Casablanca',
            marchandise: 'Matériel informatique',
            dateDepartPrevue: new Date(),
            dateArriveePrevue: new Date(),
            statut: 'en_cours',
            chauffeurId: {
                nom: 'Mohamed Boussouir',
                email: 'mohamed@test.com'
            },
            camionId: {
                immatriculation: '123-A-26',
                modele: 'Volvo FH'
            },
            remorqueId: {
                immatriculation: '456-B-26',
                capaciteKg: 25000
            }
        };

        let chunks = [];

        const dataCallback = (chunk) => {
            chunks.push(chunk);
        };

        const endCallback = () => {
            const resultBuffer = Buffer.concat(chunks);
            // التأكد من أن الملف تم إنشاؤه وأنه ليس فارغاً ويحتوي على بيانات PDF
            expect(resultBuffer.length).toBeGreaterThan(0);
            done();
        };

        // استدعاء دالة توليد الـ PDF
        PdfService.generateOrdreDeMission(mockTrajet, dataCallback, endCallback);
    });
});