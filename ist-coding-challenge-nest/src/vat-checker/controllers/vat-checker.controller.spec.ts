import { APP_PIPE } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { validate, ZodValidationPipe } from "nestjs-zod";
import { createResponse } from 'node-mocks-http';
import { FileService } from "../services/file.service";
import { ValidationExternalFetchService } from "../services/validation-external-fetch.service";
import { ValidationExternalReqService } from "../services/validation-external-req.service";
import { ValidationExternalService } from "../services/validation-external.service";
import { ValidationService } from "../services/validation.service";
import { VatCheckerController } from "./vat-checker.controller";

describe('Vat Checker Controller Unit test', () => {
    let vatCheckerController: VatCheckerController;
    let validationService: ValidationService;
    let app: TestingModule;

    beforeEach(async () => {
        app = await Test.createTestingModule({
            controllers: [VatCheckerController],
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
            ]
        }).compile();

        vatCheckerController = app.get<VatCheckerController>(VatCheckerController);
        validationService = app.get<ValidationService>(ValidationService);
    });

    afterEach(async () => {
        await app.close();
    });

    it('should be defined', () => {
        expect(vatCheckerController).toBeDefined();
    });

    describe('postValidationVat', () => {

        it('should validate VAT number Invalid VAT number: 123456789 for country code: DE', async () => {
            const vatData = {
                countryCode: 'DE',
                vat: '123456789'
            };

            const res = createResponse();
            expect(async () => {
                const result = await vatCheckerController.postValidationVat({ body: vatData }, res);

                expect(res.statusCode).toBe(400);

                expect(res._getJSONData()).toEqual({
                    validated: false,
                    details: `Invalid VAT number: ${vatData.vat} for country code: ${vatData.countryCode}`
                });
                throw new Error(`Validation failed: Invalid VAT number: ${vatData.vat} for country code: ${vatData.countryCode}`);

            }).rejects.toThrow('Validation failed: Invalid VAT number: 123456789 for country code: DE');


        });

        it('should handle empty VAT data', async () => {
            const vatData = {
                countryCode: '',
                vat: ''
            };
            const response = createResponse();
            await expect(async () => {

                const result = await vatCheckerController.postValidationVat({ body: vatData }, response);

                expect(response.statusCode).toBe(400);

                expect(response._getJSONData()).toEqual({
                    validated: false,
                    details: 'Country code is required for validation.'
                });
                throw new Error('Validation failed: Country code is required for validation.');

            }).rejects.toThrow('Validation failed: Country code is required for validation.');
        });

        it('should handle invalid country code format Validation failed: Invalid country code: DEU', async () => {
            const vatData = {
                countryCode: 'DEU',
                vat: '123456789'
            };

            const response = createResponse();
            await expect(async () => {

                const result = await vatCheckerController.postValidationVat({ body: vatData }, response);

                expect(response.statusCode).toBe(400);

                expect(response._getJSONData()).toEqual({
                    validated: false,
                    details: 'Invalid country code: DEU'
                });
                throw new Error('Validation failed: Invalid country code: DEU');

            }).rejects.toThrow('Validation failed: Invalid country code: DEU');
        });
        it('should handle invalid VAT number format', async () => {
            const vatData = {
                countryCode: 'DE',
                vat: '1234'
            };

            const response = createResponse();

            await expect(async () => {
                const result = await vatCheckerController.postValidationVat({ body: vatData }, response);

                expect(response.statusCode).toBe(400);

                expect(response._getJSONData()).toEqual({
                    validated: false,
                    details: `Invalid VAT number: ${vatData.vat} for country code: ${vatData.countryCode}`
                });
                throw new Error(`Validation failed: Invalid VAT number: ${vatData.vat} for country code: ${vatData.countryCode}`);

            }).rejects.toThrow('Validation failed: Invalid VAT number: 1234 for country code: DE');
        });
    });
    describe('postValidationVat with external validation', () => {
        it('should handle external validation failure', async () => {
            const vatData = {
                countryCode: 'DE',
                vat: '123456789'
            };

            jest.spyOn(validationService, 'isValidCountryCode').mockResolvedValue({
                validated: true,
                details: 'Valid country code'
            });

            const validationExternalService = app.get<ValidationExternalService>(ValidationExternalService);

            jest.spyOn(validationExternalService, 'validateVat').mockRejectedValue(new Error('Invalid VAT number: 123456789 for country code: DE'));

            const response = createResponse();

            await expect(async () => {
                const result = await vatCheckerController.postValidationVat({ body: vatData }, response);

                expect(response.statusCode).toBe(500);

                expect(response._getJSONData()).toEqual({
                    validated: false,
                    details: 'External validation failed: Invalid VAT number: 123456789 for country code: DE'
                });

                throw new Error('External validation failed: Invalid VAT number: 123456789 for country code: DE');

            }).rejects.toThrow('External validation failed: Invalid VAT number: 123456789 for country code: DE');
        });

        it('should validate successfully when external service confirms valid VAT', async () => {

            const vatData = {
                countryCode: 'DE',
                vat: '123456789'
            };


            jest.spyOn(validationService, 'isValidCountryCode').mockResolvedValue({
                validated: true,
                details: 'Valid country code'
            });

            const validationExternalService = app.get<ValidationExternalService>(ValidationExternalService);

            const response = createResponse();



            jest.spyOn(validationExternalService, 'validateVat').mockResolvedValue({ valid: true });


            const result = await vatCheckerController.postValidationVat({ body: vatData }, response);


            expect(response.statusCode).toBe(200);

            expect(response._getJSONData()).toEqual({
                validated: true,
                details: 'VAT number is valid for the given country code.'
            });
        });

        it('should handle external validation with valid VAT number', async () => {
            const vatData = {
                countryCode: 'AT',
                vat: 'U62060511'
            };

            const expectedResponse = {
                valid: true,
                details: 'VAT number is valid for the given country code.'
            };


            const response = createResponse();

            const result = await vatCheckerController.postValidationVat({ body: vatData }, response);

            expect(result.statusCode).toBe(200);

            expect(response.statusCode).toBe(200);

            expect(response._getJSONData()).toEqual(expectedResponse);
        });

        it('should handle external validation with valid VAT number II', async () => {
            const vatData = {
                countryCode: 'AT',
                vat: 'U66889218'
            };

            jest.spyOn(validationService, 'isValidCountryCode').mockResolvedValue({
                validated: true,
                details: 'Valid country code'
            });

            const expectedResponse = {
                valid: true,
                details: 'VAT number is valid for the given country code.'
            };


            const response = createResponse();

            const result = await vatCheckerController.postValidationVat({ body: vatData }, response);

            expect(result.statusCode).toBe(200);

            expect(response.statusCode).toBe(200);

            expect(response._getJSONData()).toEqual(expectedResponse);
        });

        describe('Valid VAT numbers for different EU countries', () => {
            it('should handle external validation with valid VAT number for Germany', async () => {
                const vatData = {
                    countryCode: 'DE',
                    vat: 'DE279448078'
                };

                const expectedResponse = {
                    validated: true,
                    details: 'VAT number is valid for the given country code.'
                };

                const response = createResponse();

                const result = await vatCheckerController.postValidationVat({ body: vatData }, response);

                expect(result.statusCode).toBe(200);
                expect(response.statusCode).toBe(200);
                expect(response._getJSONData()).toEqual(expectedResponse);
            });

            it('should handle external validation with valid VAT number for Spain', async () => {
                const vatData = {
                    countryCode: 'ES',
                    vat: 'B84570936'
                };

                const expectedResponse = {
                    validated: true,
                    details: 'VAT number is valid for the given country code.'
                };

                const response = createResponse();

                const result = await vatCheckerController.postValidationVat({ body: vatData }, response);

                expect(result.statusCode).toBe(200);
                expect(response.statusCode).toBe(200);
                expect(response._getJSONData()).toEqual(expectedResponse);
            });

            it('should handle external validation with valid VAT number for Belgium', async () => {
                const vatData = {
                    countryCode: 'BE',
                    vat: 'BE0411905847'
                };

                const expectedResponse = {
                    validated: true,
                    details: 'VAT number is valid for the given country code.'
                };

                const response = createResponse();

                const result = await vatCheckerController.postValidationVat({ body: vatData }, response);

                expect(result.statusCode).toBe(200);
                expect(response.statusCode).toBe(200);
                expect(response._getJSONData()).toEqual(expectedResponse);
            });
        });
    });
});