import { TestingModule, Test } from "@nestjs/testing"
import { VatCheckerController } from "./vat-checker.controller";
import { ValidationExternalService } from "../services/validation-external.service";
import { ValidationExternalReqService } from "../services/validation-external-req.service";
import { ValidationExternalFetchService } from "../services/validation-external-fetch.service";
import { FileService } from "../services/file.service";
import { ValidationService } from "../services/validation.service";
import { APP_PIPE } from "@nestjs/core";
import { validate, ZodValidationPipe } from "nestjs-zod";

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

            expect(async () => {
                try {
                    const result = await vatCheckerController.postValidationVat({ body: vatData });
                    return result;
                } catch (error) {
                    throw (error as { validated: boolean; details: string }).details;
                }
            }).rejects.toThrow('Validation failed: Invalid VAT number: 123456789 for country code: DE');


        });

        it('should handle empty VAT data', async () => {
            const vatData = {
                countryCode: '',
                vat: ''
            };
            await expect(async () => {
                try {
                    await vatCheckerController.postValidationVat({ body: vatData });
                } catch (error) {
                    throw (error as { validated: boolean; details: string }).details;
                }
            }).rejects.toThrow('Validation failed: Country code is required for validation.');
        });

        it('should handle invalid country code format Validation failed: Invalid country code: DEU', async () => {
            const vatData = {
                countryCode: 'DEU',
                vat: '123456789'
            };

            await expect(async () => {
                try {
                    await vatCheckerController.postValidationVat({ body: vatData });
                } catch (error) {
                    throw (error as { validated: boolean; details: string }).details;
                }
            }).rejects.toThrow('Validation failed: Invalid country code: DEU');
        });
        it('should handle invalid VAT number format', async () => {
            const vatData = {
                countryCode: 'DE',
                vat: '1234'
            };

            await expect(async () => {
                try {
                    await vatCheckerController.postValidationVat({ body: vatData });
                } catch (error) {
                    throw (error as { validated: boolean; details: string }).details;
                }
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

            await expect(async () => {
                try {
                    await vatCheckerController.postValidationVat({ body: vatData });
                } catch (error) {
                    throw new Error(`External validation failed: ${error.details}`);
                }
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

            jest.spyOn(validationExternalService, 'validateVat').mockResolvedValue({ valid: true });

            const result = await vatCheckerController.postValidationVat({ body: vatData });
            expect(result).toEqual({
                validated: true,
                details: 'VAT number is valid for the given country code.'
            });
        });
    });
});