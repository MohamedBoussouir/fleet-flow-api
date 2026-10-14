const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Remorque = require('../../src/models/Remorque');

let adminToken, chauffeurToken, remorqueId;

beforeEach(async () => {
    await Remorque.deleteMany({});
    await User.deleteMany({});

    // 1. إنشاء مستخدم Admin وتوليد التوكن
    const adminEmail = `admin_remorque_${Date.now()}@test.com`;
    const password = 'Password123!';
    await User.create({
        nom: 'Admin Remorque',
        email: adminEmail,
        password,
        role: 'Admin',
        statut: 'actif'
    });
    const adminLogin = await request(app).post('/api/auth/login').send({ email: adminEmail, password });
    adminToken = adminLogin.body.accessToken;

    // 2. إنشاء مستخدم Chauffeur لفحص الصلاحيات الأمنية
    const driverEmail = `driver_remorque_${Date.now()}@test.com`;
    await User.create({
        nom: 'Chauffeur Remorque',
        email: driverEmail,
        password,
        role: 'Chauffeur',
        statut: 'actif'
    });
    const driverLogin = await request(app).post('/api/auth/login').send({ email: driverEmail, password });
    chauffeurToken = driverLogin.body.accessToken;
});

describe("Tests d'Intégration - Remorques API (Complet & Sécurité)", () => {

    it("1. Doit interdire l'accès à la création d'une remorque sans token (401)", async () => {
        const res = await request(app)
            .post('/api/remorques')
            .send({
                immatriculation: '99887-B-26',
                capaciteKg: 32000,
                statut: 'disponible'
            });
        expect(res.statusCode).toBe(401);
    });

    it("2. Doit interdire à un Chauffeur de créer une remorque (403 Forbidden)", async () => {
        const res = await request(app)
            .post('/api/remorques')
            .set('Authorization', `Bearer ${chauffeurToken}`)
            .send({
                immatriculation: '12345-B-26',
                capaciteKg: 25000,
                statut: 'disponible'
            });
        expect(res.statusCode).toBe(403);
    });

    it("3. Doit créer une remorque avec succès par l'Admin (201 / 200)", async () => {
        const res = await request(app)
            .post('/api/remorques')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                immatriculation: '99887-B-26',
                capaciteKg: 32000,
                statut: 'disponible'
            });
        expect([200, 201]).toContain(res.statusCode);

        // حفظ المعرف للاختبارات اللاحقة
        if (res.body && (res.body._id || res.body.id || (res.body.remorque && res.body.remorque._id))) {
            remorqueId = res.body._id || res.body.id || res.body.remorque._id;
        }
    });

    it("4. Doit rejeter la création d'une remorque avec des données incomplètes ou invalides (400)", async () => {
        const res = await request(app)
            .post('/api/remorques')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                immatriculation: '', // بيانات ناقصة
                capaciteKg: -1000 // قيمة غير منطقية
            });
        expect(res.statusCode).toBe(400);
    });

    it("5. Doit lister toutes les remorques pour les utilisateurs authentifiés (200)", async () => {
        await Remorque.create({ immatriculation: '111-B-26', capaciteKg: 20000, statut: 'disponible' });
        
        const res = await request(app)
            .get('/api/remorques')
            .set('Authorization', `Bearer ${chauffeurToken}`); // حتى السائق يمكنه القراءة إن مسموح
            
        expect(res.statusCode).toBe(200);
    });

    it("6. Doit rejeter une requête avec un ID de remorque invalide sans crasher le serveur (400)", async () => {
        const res = await request(app)
            .get('/api/remorques/id-invalide-mongodb-999')
            .set('Authorization', `Bearer ${adminToken}`);
            
        // يجب أن يرجع 400 أو 404 ولا يتسبب في انهيار السيرفر بـ 500
        expect([400, 404]).toContain(res.statusCode);
    });

});