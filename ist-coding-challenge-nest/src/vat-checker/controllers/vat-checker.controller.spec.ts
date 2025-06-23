import { TestingModule, Test } from "@nestjs/testing"
import { VatCheckerController } from "./vat-checker.controller";
import { ValidationExternalService } from "../services/validation-external.service";
import { ValidationExternalReqService } from "../services/validation-external-req.service";
import { ValidationExternalFetchService } from "../services/validation-external-fetch.service";
import { FileService } from "../services/file.service";
import { ValidationService } from "../services/validation.service";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";

describe('Vat Checker Controller Unit test', () => {
    let vatCheckerController: VatCheckerController;
    let validationService: ValidationService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
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

    it('should be defined', () => {
        expect(vatCheckerController).toBeDefined();
    });

    describe('postValidationVat', () => {
        it('should validate VAT number successfully', async () => {
            const vatData = {
                countryCode: 'DE',
                vat: '123456789'
            };

            const result = await vatCheckerController.postValidationVat({ body: vatData });
            expect(result).toBeDefined();
        });

        it('should handle empty VAT data', async () => {
            const vatData = {
                countryCode: '',
                vat: ''
            };

            await expect(vatCheckerController.postValidationVat({ body: vatData }))
                .rejects
                .toThrow('Validation failed (empty data)');
        });

        it('should handle invalid country code format', async () => {
            const vatData = {
                countryCode: 'DEU',
                vat: '123456789'
            };

            await expect(vatCheckerController.postValidationVat({ body: vatData }))
                .rejects
                .toThrow();
        });
    });
});