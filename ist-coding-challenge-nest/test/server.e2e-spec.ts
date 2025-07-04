
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { VatModule } from './../src/vat-checker/vat.module';
import request from 'supertest';
import { App } from "supertest/types";
import { FileService } from "../src/vat-checker/services/file.service";
import { ValidationExternalFetchService } from "../src/vat-checker/services/validation-external-fetch.service";
import { ValidationExternalReqService } from "../src/vat-checker/services/validation-external-req.service";
import { ValidationExternalService } from "../src/vat-checker/services/validation-external.service";
import { ValidationService } from "../src//vat-checker/services/validation.service";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { VatCheckerController } from "../src/vat-checker/controllers/vat-checker.controller";

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
                vat: "DE123456789"
            }
        };
        const res = await request(app.getHttpServer()).post(`/valid-vat`)
            .send(paylaod)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect("Content-Type", /json/)
            .expect(200);
        expect(res.body).toMatchObject<{ validated: boolean, details: string }>({
            validated: true,
            details: 'VAT number is valid for the given country code.'
        });

    }, 10000)
    it('simple server post handler /valid-vat/ testing invalid countryCode length payload', async () => {

        const paylaod = {
            body: {
                countryCode: "DEX",
                vat: "123456789"
            }
        };
        const res = await request(app.getHttpServer(),).post(`/valid-vat`)
            .send(paylaod)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect("Content-Type", /json/)
            .expect(400);
        expect(() => {
            throw new Error(res.body.errors[0].message);

        }).toThrow('contryCode must be 2 characters length');




    })
    it('simple server post handler /valid-vat/ testing invalid vat length payload', async () => {

        const paylaod = {
            body: {
                countryCode: "DE",
                vat: "12345678910112"
            }
        };
        const res = await request(app.getHttpServer()).post(`/valid-vat`)
            .send(paylaod)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect("Content-Type", /json/)
            .expect(400)
        expect(() => {
            throw new Error(res.body.errors[0].message);
        }).toThrow('vat must be between 8 to 12 length');

    })
    it('simple server post handler /valid-vat/ testing invalid vat length payload and countryCode length payload', async () => {

        const paylaod = {
            body: {
                countryCode: "DEX",
                vat: "12345678910112"
            }
        };
        const res = await request(app.getHttpServer()).post(`/valid-vat`)
            .send(paylaod)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect("Content-Type", /json/)
            .expect(400)
        expect(() => {
            throw new Error(res.body.errors[0].message);
        }).toThrow('contryCode must be 2 characters length');
        expect(() => {
            throw new Error(res.body.errors[1].message);
        }).toThrow('vat must be between 8 to 12 length');

    })


})