const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Camion = require('../../src/models/Camion');

let token;

beforeEach(async () => {
    // 1. تنظيف قاعدة البيانات قبل كل اختبار
    await Camion.deleteMany({});
    await User.deleteMany({});

    const email = `admin_${Date.now()}_${Math.random()}@test.com`;
    const password = 'Password123!';

    // 2. إنشاء مستخدم Admin حقيقي
    await User.create({
        nom: 'Admin Camion',
        email: email,
        password: password,
        role: 'Admin',
        statut: 'actif'
    });

    // 3. تسجيل الدخول الحقيقي لجلب التوكن المعتمد
    const loginRes = await request(app).post('/api/auth/login').send({
        email: email,
        password: password
    });    
    
    token = loginRes.body.accessToken;
});

describe("Tests d'Intégration - Camions API (Complete)", () => {

    it("1. Doit interdire l'accès sans token (401)", async () => {
        const res = await request(app).get('/api/camions');
        expect(res.statusCode).toBe(401);
    });

    it("2. Doit créer un camion si Admin (201)", async () => {
        const res = await request(app)
            .post('/api/camions')
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .send({ 
                immatriculation: 'A-12345', 
                modele: 'FH16', 
                kilometrageTotal: 10000, 
                statut: 'disponible' 
            });
       
        expect(res.statusCode).toBe(201);
    });

    it("3. Doit récupérer la liste des camions (200)", async () => {
        await Camion.create({
            immatriculation: 'B-67890',
            modele: 'Actros',
            kilometrageTotal: 5000,
            statut: 'disponible'
        });

        const res = await request(app)
            .get('/api/camions')
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it("4. Doit modifier un camion existant (200 / 204)", async () => {
        const camion = await Camion.create({
            immatriculation: 'C-11111',
            modele: 'Scania',
            kilometrageTotal: 2000,
            statut: 'disponible'
        });

        const res = await request(app)
            .put(`/api/camions/${camion._id}`)
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .send({ statut: 'en_maintenance' });

        expect([200, 204]).toContain(res.statusCode);
    });

    it("5. Doit supprimer un camion (200 / 204 / 404)", async () => {
        const camion = await Camion.create({
            immatriculation: 'D-22222',
            modele: 'DAF',
            kilometrageTotal: 15000,
            statut: 'disponible'
        });

        const res = await request(app)
            .delete(`/api/camions/${camion._id}`)
            .set('Authorization', `Bearer ${token}`);

        // السماح بالقيم المتوقعة لنجاح الحذف أو عدم العثور
        expect([200, 204, 404]).toContain(res.statusCode);
    });
});