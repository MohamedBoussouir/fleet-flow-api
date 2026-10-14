const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Camion = require('../../src/models/Camion');
const Remorque = require('../../src/models/Remorque');
const Trajet = require('../../src/models/Trajet');

let adminToken, chauffeurToken, camionId, remorqueId, chauffeurId, trajetId;

beforeEach(async () => {
    await Trajet.deleteMany({});
    await Camion.deleteMany({});
    await Remorque.deleteMany({});
    await User.deleteMany({});

    // 1. إنشاء مستخدم Admin
    const adminEmail = `admin_trajet_${Date.now()}@test.com`;
    await User.create({ nom: 'Admin Trajet', email: adminEmail, password: 'Password123!', role: 'Admin', statut: 'actif' });
    const adminLogin = await request(app).post('/api/auth/login').send({ email: adminEmail, password: 'Password123!' });
    adminToken = adminLogin.body.accessToken;

    // 2. إنشاء مستخدم Chauffeur
    const driverEmail = `driver_${Date.now()}@test.com`;
    const driverUser = await User.create({ nom: 'Karim Driver', email: driverEmail, password: 'Password123!', role: 'Chauffeur', statut: 'actif' });
    chauffeurId = driverUser._id;
    const driverLogin = await request(app).post('/api/auth/login').send({ email: driverEmail, password: 'Password123!' });
    chauffeurToken = driverLogin.body.accessToken;

    // 3. إنشاء شاحنة ومقطورة
    const camion = await Camion.create({ immatriculation: 'T-100', modele: 'Volvo', kilometrageTotal: 100000, statut: 'disponible' });
    camionId = camion._id;
    const remorque = await Remorque.create({ immatriculation: 'R-200', capaciteKg: 30000, statut: 'disponible' });
    remorqueId = remorque._id;
});

describe("Tests d'Intégration - Trajets & Règles Métier (Complet & Sécurité)", () => {

    it("1. Doit interdire la création d'un trajet sans token (401)", async () => {
        const res = await request(app)
            .post('/api/trajets')
            .send({
                siteDepart: "Youssoufia",
                siteArrivee: "Jorf Lasfar",
                marchandise: "Phosphate",
                camionId,
                remorqueId,
                chauffeurId
            });
        expect(res.statusCode).toBe(401);
    });

    it("2. Doit interdire à un Chauffeur de créer un trajet (403 Forbidden)", async () => {
        const res = await request(app)
            .post('/api/trajets')
            .set('Authorization', `Bearer ${chauffeurToken}`)
            .send({
                siteDepart: "Youssoufia",
                siteArrivee: "Safi",
                marchandise: "Phosphate",
                camionId,
                remorqueId,
                chauffeurId
            });
        expect(res.statusCode).toBe(403);
    });

    it("3. Doit créer et assigner un trajet avec succès par l'Admin (201 / 200)", async () => {
        const res = await request(app)
            .post('/api/trajets')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                siteDepart: "Youssoufia",
                siteArrivee: "Jorf Lasfar",
                marchandise: "Phosphate Brut",
                dateDepartPrevue: "2026-10-10T07:00:00.000Z",
                dateArriveePrevue: "2026-10-10T15:00:00.000Z",
                camionId,
                remorqueId,
                chauffeurId
            });
        expect([200, 201]).toContain(res.statusCode);
        
        if (res.body) {
            trajetId = res.body._id || res.body.id || (res.body.trajet && res.body.trajet._id);
        }
    });

    it("4. Doit rejeter la création d'un trajet avec des données incomplètes ou invalides (400)", async () => {
        const res = await request(app)
            .post('/api/trajets')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                siteDepart: "", // حقل فارغ خطأ
                marchandise: "Test"
            });
        expect(res.statusCode).toBe(400);
    });

    it("5. Doit permettre au chauffeur de consulter ses trajets attitrés (200)", async () => {
        const res = await request(app)
            .get('/api/trajets/mes-trajets')
            .set('Authorization', `Bearer ${chauffeurToken}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it("6. Doit rejeter une requête avec un ID de trajet invalide sans crasher le serveur (400)", async () => {
        const res = await request(app)
            .get('/api/trajets/id-invalide-mongodb-999')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect([400, 404]).toContain(res.statusCode);
    });

});