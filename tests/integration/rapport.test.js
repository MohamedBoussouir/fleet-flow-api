const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const JwtService = require('../../src/services/jwtService');

describe("Integration Tests - Rapport Module", () => {
    let adminToken;

    beforeEach(async () => {
        // إنشاء مستخدم بصلاحية مشرف للاختبار
        const adminUser = await User.create({
            nom: 'Admin Rapport',
            email: `admin_rapport_${Date.now()}@test.com`,
            password: 'password123',
            role: 'Admin'
        });
        adminToken = JwtService.generateAccessToken({ userId: adminUser._id, role: adminUser.role });
    });

    it("Doit permettre à l'admin d'accéder aux rapports (200 ou 404)", async () => {
        const res = await request(app)
            .get('/api/rapports')
            .set('Authorization', `Bearer ${adminToken}`);

        expect([200, 404]).toContain(res.status);
    });
});