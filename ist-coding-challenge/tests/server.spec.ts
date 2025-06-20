import { Server } from "../source/server";
import http from 'http';
import { Express } from "express";

import request from 'supertest';
import { Configuration, readAppConfiguration } from "../source/models/ConfigurationModel";

describe('Server test suite', () => {


    let server: Server;
    let httpServer: http.Server;
    let app: Express;

    beforeEach(() => {
        const configuration: Configuration = readAppConfiguration("configurationFile");
        server = new Server(configuration);
        server.createApp();
        app = server.app;
        httpServer = server.listen();
    })
    afterEach(() => {
        httpServer.close();
    })


    it('simple server post handler /valid-vat/ testing valid payload', async () => {

        const paylaod = {
            body: {
                countryCode: "DE",
                vat: "12345678"
            }
        };
        const res = await request(app).post(`/valid-vat/`)
            .send(paylaod)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect("Content-Type", /json/)
            .expect(200);
        /*expect(res.body).toStrictEqual({
            ...paylaod
        })*/


    }, 10000)
    it('simple server post handler /valid-vat/ testing invalid countryCode length payload', async () => {

        const paylaod = {
            body: {
                countryCode: "DEX",
                vat: "123456789"
            }
        };
        const res = await request(app,).post(`/valid-vat/`)
            .send(paylaod)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect("Content-Type", /json/)
            .expect(400)
        expect(res.body).toMatchObject<{ error: string, details: Array<{ message: string }> }>({
            error: 'Invalid data',
            details: [{ message: 'contryCode must be 2 characters length' }]
        });

    })
    it('simple server post handler /valid-vat/ testing invalid vat length payload', async () => {

        const paylaod = {
            body: {
                countryCode: "DE",
                vat: "12345678910112"
            }
        };
        const res = await request(app,).post(`/valid-vat/`)
            .send(paylaod)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect("Content-Type", /json/)
            .expect(400)
        expect(res.body).toMatchObject<{ error: string, details: Array<{ message: string }> }>({
            error: 'Invalid data',
            details: [{ message: 'vat must be between 8 to 12 length' }]
        });

    })
    it('simple server post handler /valid-vat/ testing invalid vat length payload and countryCode length payload', async () => {

        const paylaod = {
            body: {
                countryCode: "DEX",
                vat: "12345678910112"
            }
        };
        const res = await request(app,).post(`/valid-vat/`)
            .send(paylaod)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect("Content-Type", /json/)
            .expect(400)
        expect(res.body).toMatchObject<{ error: string, details: Array<{ message: string }> }>({
            error: 'Invalid data',
            details: [{ message: 'contryCode must be 2 characters length' }, { message: 'vat must be between 8 to 12 length' }]
        });

    })


})