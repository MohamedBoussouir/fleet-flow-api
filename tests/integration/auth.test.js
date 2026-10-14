const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');

beforeEach(async () => {
    await User.deleteMany({});
});

describe("Tests d'Intégration - Auth API (Complete)", () => {

    it("1. Doit inscrire un nouvel utilisateur avec succès (201)", async () => {
        const res = await request(app).post('/api/auth/register').send({
            nom: 'Mohamed Test',
            email: 'mohamed@test.com',
            password: 'Password123!',
            role: 'Admin'
        });
        expect([200, 201]).toContain(res.statusCode);
        expect(res.body).toHaveProperty('message'); // تم التعديل للتحقق من الرسالة التي يرجعها الـ API
    });

    it("2. Doit rejeter une inscription avec un email déjà existant (400 / 409)", async () => {
        await User.create({
            nom: 'Existing User',
            email: 'duplicate@test.com',
            password: 'Password123!',
            role: 'Admin'
        });

        const res = await request(app).post('/api/auth/register').send({
            nom: 'Another User',
            email: 'duplicate@test.com',
            password: 'Password123!',
            role: 'Admin'
        });
        expect([400, 409]).toContain(res.statusCode);
    });

    it("3. Doit rejeter une inscription invalide (champs manquants) (400)", async () => {
        const res = await request(app).post('/api/auth/register').send({
            nom: 'Ad',
            password: '123'
        });
        expect(res.statusCode).toBe(400);
    });

    it("4. Doit connecter un utilisateur avec des identifiants valides (200)", async () => {
        await User.create({
            nom: 'Login User',
            email: 'login@test.com',
            password: 'Password123!',
            role: 'Admin',
            statut: 'actif'
        });

        const res = await request(app).post('/api/auth/login').send({
            email: 'login@test.com',
            password: 'Password123!'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('accessToken'); 
    });

    it("5. Doit rejeter une connexion avec un mot de passe incorrect (400 / 401)", async () => {
        await User.create({
            nom: 'Login User',
            email: 'login@test.com',
            password: 'Password123!',
            role: 'Admin',
            statut: 'actif'
        });

        const res = await request(app).post('/api/auth/login').send({
            email: 'login@test.com',
            password: 'WrongPassword'
        });

        expect([400, 401]).toContain(res.statusCode);
    });

});