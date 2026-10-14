const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Camion = require('../../src/models/Camion');

let adminToken, chauffeurToken, camionId;

beforeEach(async () => {
    // 1. تنظيف قواعد البيانات قبل كل اختبار
    await User.deleteMany({});
    await Camion.deleteMany({});

    // 2. إنشاء شاحنة وهمية للحصول على camionId صالح للاستخدام في القواعد
    const camion = await Camion.create({
        immatriculation: "12345-A-67",
        modele: "Volvo FH",
        kilometrageTotal: 50000,
        statut: "disponible"
    });
    camionId = camion._id;

    // 3. إنشاء مستخدم Admin
    const adminEmail = `admin_maint_${Date.now()}@test.com`;
    await User.create({
        nom: 'Admin Maintenance',
        email: adminEmail,
        password: 'Password123!',
        role: 'Admin',
        statut: 'actif'
    });
    const adminLogin = await request(app).post('/api/auth/login').send({
        email: adminEmail,
        password: 'Password123!'
    });
    adminToken = adminLogin.body.accessToken;

    // 4. إنشاء مستخدم Chauffeur
    const chauffeurEmail = `driver_maint_${Date.now()}@test.com`;
    await User.create({
        nom: 'Chauffeur Maintenance',
        email: chauffeurEmail,
        password: 'Password123!',
        role: 'Chauffeur',
        statut: 'actif'
    });
    const chauffeurLogin = await request(app).post('/api/auth/login').send({
        email: chauffeurEmail,
        password: 'Password123!'
    });
    chauffeurToken = chauffeurLogin.body.accessToken;
});

describe("Tests d'Intégration - Maintenance API (Complete & Security)", () => {

    it("1. Doit interdire l'accès aux alertes sans token (401)", async () => {
        const res = await request(app).get('/api/maintenance/alertes');
        expect(res.statusCode).toBe(401);
    });

    it("2. Doit permettre à l'Admin et au Chauffeur de récupérer les alertes (200 avec structure correcte)", async () => {
        // اختبار الأدمن
        const resAdmin = await request(app)
            .get('/api/maintenance/alertes')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(resAdmin.statusCode).toBe(200);
        expect(resAdmin.body).toHaveProperty('alertes');
        expect(Array.isArray(resAdmin.body.alertes)).toBeTruthy();

        // اختبار السائق
        const resChauffeur = await request(app)
            .get('/api/maintenance/alertes')
            .set('Authorization', `Bearer ${chauffeurToken}`);
        expect(resChauffeur.statusCode).toBe(200);
        expect(resChauffeur.body).toHaveProperty('alertes');
    });

    it("3. Doit interdire à un Chauffeur de configurer une règle de maintenance (403 Forbidden)", async () => {
        const res = await request(app)
            .post('/api/maintenance/regles')
            .set('Authorization', `Bearer ${chauffeurToken}`)
            .send({
                camionId: camionId.toString(),
                type: 'vidange',
                periodiciteKm: 10000,
                seuilAlerteKm: 9000
            });
        expect(res.statusCode).toBe(403);
    });

    it("4. Doit permettre à l'Admin de configurer une règle de maintenance (200 / 201)", async () => {
        const res = await request(app)
            .post('/api/maintenance/regles')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                camionId: camionId.toString(),
                type: 'vidange',
                periodiciteKm: 10000,
                seuilAlerteKm: 9000
            });
        expect([200, 201]).toContain(res.statusCode);
    });

    it("5. Doit rejeter la configuration d'une règle avec des données invalides selon le DTO (400)", async () => {
        const res = await request(app)
            .post('/api/maintenance/regles')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                camionId: camionId.toString(),
                type: 'vidange',
                periodiciteKm: 5000,
                seuilAlerteKm: 8000 // خطأ: يجب ألا يتجاوز seuilAlerteKm قيمة periodiciteKm حسب الـ Schema
            });
        expect(res.statusCode).toBe(400);
    });

    it("6. Doit rejeter la résolution d'une alerte avec un ID invalide (400)", async () => {
        const res = await request(app)
            .patch('/api/maintenance/alertes/id-invalide-12345/resoudre')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ 
                statut: 'resolue',
                commentaire: 'Résolu' 
            });
        
        expect(res.statusCode).toBe(400);
    });

});