const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Camion = require('../../src/models/Camion');
const Pneu = require('../../src/models/Pneu');

let token, chauffeurToken, camionId, pneuId;

beforeEach(async () => {
    await Pneu.deleteMany({});
    await Camion.deleteMany({});
    await User.deleteMany({});

    // 1. إنشاء مستخدم Admin وتوليد التوكن
    const adminEmail = `admin_pneu_${Date.now()}@test.com`;
    const password = 'Password123!';
    await User.create({ nom: 'Admin Pneu', email: adminEmail, password, role: 'Admin', statut: 'actif' });
    const adminLogin = await request(app).post('/api/auth/login').send({ email: adminEmail, password });
    token = adminLogin.body.accessToken;

    // 2. إنشاء مستخدم Chauffeur لت اختبار الصلاحيات
    const driverEmail = `driver_pneu_${Date.now()}@test.com`;
    await User.create({ nom: 'Chauffeur Pneu', email: driverEmail, password, role: 'Chauffeur', statut: 'actif' });
    const driverLogin = await request(app).post('/api/auth/login').send({ email: driverEmail, password });
    chauffeurToken = driverLogin.body.accessToken;

    // 3. إنشاء شاحنة مرتبطة للاختبار
    const camion = await Camion.create({
        immatriculation: '12345-A-26',
        modele: 'Volvo FH16',
        kilometrageTotal: 120000,
        statut: 'disponible'
    });
    camionId = camion._id;
});

describe("Tests d'Intégration - Pneus API (Complet & Sécurité)", () => {

    it("1. Doit interdire l'accès à la création d'un pneu sans token (401)", async () => {
        const res = await request(app)
            .post('/api/pneus')
            .send({
                numeroSerie: 'MICHELIN-001',
                camionId,
                position: 'AV-G',
                kilometrageUsure: 5000,
                seuilUsureKm: 60000,
                etat: 'bon'
            });
        expect(res.statusCode).toBe(401);
    });

    it("2. Doit interdire à un Chauffeur de créer un pneu (403 Forbidden)", async () => {
        const res = await request(app)
            .post('/api/pneus')
            .set('Authorization', `Bearer ${chauffeurToken}`)
            .send({
                numeroSerie: 'MICHELIN-002',
                camionId,
                position: 'AV-D',
                kilometrageUsure: 5000,
                seuilUsureKm: 60000,
                etat: 'bon'
            });
        expect(res.statusCode).toBe(403);
    });

    it("3. Doit créer et assigner un pneu au camion avec succès par l'Admin (200 / 201)", async () => {
        const res = await request(app)
            .post('/api/pneus')
            .set('Authorization', `Bearer ${token}`)
            .send({
                numeroSerie: 'MICHELIN-XMULTI-001',
                camionId: camionId.toString(),
                position: 'AV-G',
                kilometrageUsure: 5000,
                seuilUsureKm: 60000,
                etat: 'bon'
            });
        expect([200, 201]).toContain(res.statusCode);
        
        // حفظ معرف الإطار للاختبارات التالية إن وجد في الرد
        if (res.body && (res.body._id || res.body.id || (res.body.pneu && res.body.pneu._id))) {
            pneuId = res.body._id || res.body.id || res.body.pneu._id;
        }
    });

    it("4. Doit rejeter la création d'un pneu avec des données incomplètes ou invalides (400)", async () => {
        const res = await request(app)
            .post('/api/pneus')
            .set('Authorization', `Bearer ${token}`)
            .send({
                numeroSerie: '', // بيانات ناقصة
                etat: 'inconnu'
            });
        expect(res.statusCode).toBe(400);
    });

    it("5. Doit permettre de lister tous les pneus (200)", async () => {
        const res = await request(app)
            .get('/api/pneus')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
    });

    it("6. Doit rejeter une requête avec un ObjectId de pneu invalide sans crasher (400)", async () => {
        const res = await request(app)
            .get('/api/pneus/faux-id-mongodb-12345')
            .set('Authorization', `Bearer ${token}`);
        
        // يجب ألا يحدث انهيار بـ 500، بل يجب أن يرجع 400 أو 404
        expect([400, 404]).toContain(res.statusCode);
    });

});