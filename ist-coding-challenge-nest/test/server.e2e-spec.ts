
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { VatModule } from './../src/vat-checker/vat.module';
import request from 'supertest';
import { App } from "supertest/types";
import { FileService } from "src/vat-checker/services/file.service.js";
import { ValidationExternalFetchService } from "src/vat-checker/services/validation-external-fetch.service.js";
import { ValidationExternalReqService } from "src/vat-checker/services/validation-external-req.service.js";
import { ValidationExternalService } from "src/vat-checker/services/validation-external.service.js";
import { ValidationService } from "src/vat-checker/services/validation.service.js";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { VatCheckerController } from "src/vat-checker/controllers/vat-checker.controller";

describe('Server test suite', () => {

    let app: INestApplication<App>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [VatModule],
            providers: [
                FileService,
                ValidationExternalFetchService,
                ValidationExternalReqService,
                ValidationExternalService,
                ValidationService,
                {
                    provide: APP_PIPE,
                    useClass: ZodValidationPipe
                }
            ],
            controllers: [VatCheckerController]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    })
    afterEach(() => {
        app.close();
    })


    it('simple server post handler /valid-vat/ testing valid payload', async () => {

        const paylaod = {
            body: {
                countryCode: "DE",
                vat: "12345678"
            }
        };
        const res = await request(app.getHttpServer()).post(`/valid-vat/`)
            .send(paylaod)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect("Content-Type", /json/)
            .expect(200);

    }, 10000)
    it('simple server post handler /valid-vat/ testing invalid countryCode length payload', async () => {

        const paylaod = {
            body: {
                countryCode: "DEX",
                vat: "123456789"
            }
        };
        const res = await request(app.getHttpServer(),).post(`/valid-vat/`)
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
        const res = await request(app.getHttpServer()).post(`/valid-vat/`)
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
        const res = await request(app.getHttpServer()).post(`/valid-vat/`)
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