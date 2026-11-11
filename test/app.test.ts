import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Suite de Pruebas de Integración (5 Tests Fundamentales)', () => {

    // Test 1: Registro correcto de usuario
    it('1. Debe permitir el registro de un usuario nuevo', async () => {
        const res = await request(app)
            .post('/registro')
            .send({
                nombre: 'Usuario Test Vitest',
                email: 'vitest.user@campus.es',
                password: 'Password123!'
            });

        expect(res.status).toBe(303);
        expect(res.header.location).toBe('/login');
    });

    // Test 2: Rechazo de login con contraseña incorrecta
    it('2. Debe rechazar el inicio de sesión con credenciales inválidas', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                email: 'vitest.user@campus.es',
                password: 'PasswordErronea'
            });

        expect(res.status).toBe(303);
        expect(res.header.location).toBe('/login');
    });

    // Test 3: Bloqueo de rutas protegidas sin sesión previa (/reservas)
    it('3. Debe redirigir al login si un usuario no autenticado intenta crear una reserva', async () => {
        const res = await request(app)
            .post('/reservas')
            .send({
                equipoId: '1',
                fecha: '2026-12-01',
                turno: 'manana'
            });

        expect(res.status).toBe(303);
        expect(res.header.location).toBe('/login');
    });

    // Test 4: Bloqueo de zona Admin redirigiendo a /login si no está autenticado
    it('4. Debe denegar y redirigir al login si se accede a /admin/equipos sin autenticar', async () => {
        const res = await request(app).get('/admin/equipos');

        expect(res.status).toBe(303);
        expect(res.header.location).toBe('/login');
    });

    // Test 5: Creación exitosa de reserva por un usuario registrado y autenticado
    it('5. Debe permitir crear una reserva a un usuario autenticado', async () => {
        const agent = request.agent(app);

        // 1. Registramos un usuario nuevo exclusivo para este test
        await agent
            .post('/registro')
            .send({
                nombre: 'Usuario Reserva',
                email: 'reserva.user@campus.es',
                password: 'UserPass123!'
            });

        // 2. Iniciamos sesión con sus credenciales correctas
        await agent
            .post('/login')
            .send({
                email: 'reserva.user@campus.es',
                password: 'UserPass123!'
            });

        // 3. Crear la reserva vinculada a la sesión activa
        const res = await agent
            .post('/reservas')
            .send({
                equipoId: '1',
                fecha: '2026-12-01',
                turno: 'manana'
            });

        expect(res.status).toBe(303);
        expect(res.header.location).toBe('/reservas');
    });
});