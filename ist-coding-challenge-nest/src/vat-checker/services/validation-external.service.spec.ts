import { CheckVatRequest, ValidationExternalFetchService, CheckVatResponse } from "./validation-external-fetch.service"
import { ValidationExternalReqService } from "./validation-external-req.service";
import { ValidationExternalService } from "./validation-external.service";


describe('validation external with fetch or request service', () => {

    let validationExternalService: ValidationExternalService;


    beforeEach(() => {
        validationExternalService = new ValidationExternalService(new ValidationExternalFetchService(), new ValidationExternalReqService());
    })

    it('external api test validation Vat AT Valid', async () => {

        const payload: CheckVatRequest = { countryCode: 'AT', vatNumber: 'U62060511' }

        const validate: Partial<CheckVatResponse> = await validationExternalService.validateVat(payload);

        expect(validate).toBeDefined();

        console.log("===> validate", validate)

        expect(validate.valid).toBe(true);

    })
    it.skip('external api test validation Vat AT Valid', async () => {

        delete (global as any)?.fetch;

        const payload: CheckVatRequest = { countryCode: 'AT', vatNumber: 'U62060511' }

        const validate: Partial<CheckVatResponse> = await validationExternalService.validateVat(payload);

        expect(validate).toBeDefined();

        console.log("===> validate", validate)

        expect(validate.valid).toBe(true);

    })

    it.skip('if fetch-api is implemented by nodejs version', async () => {

        if ('fetch' in global) {

            expect('fetch' in globalThis).toBe(true);
        } else {
            expect('fetch' in global).toBe(false);
        }

    })
})