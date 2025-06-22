import { CheckVatRequest, ValidationExternalFetchService, CheckVatResponse } from "./validation-external-fetch.service"


describe('validation external with fetch service', () => {

    let validationExternalService: ValidationExternalFetchService;


    beforeEach(() => {
        validationExternalService = new ValidationExternalFetchService();
    })  
    
    it('external api test validation Vat AT Valid', async () => {
        const payload: CheckVatRequest = { countryCode: 'AT', vatNumber: 'U62060511' }

        const validate: Partial<CheckVatResponse> = await validationExternalService.validateVatFetch(payload);

        expect(validate).toBeDefined();

        console.log("===> validate", validate)

        expect(validate.valid).toBe(true);



    })
    it('external api test validation Vat AT Valid II', async () => {
        const payload: CheckVatRequest = { countryCode: 'AT', vatNumber: 'U66889218' }

        const validate: Partial<CheckVatResponse> = await validationExternalService.validateVatFetch(payload);

        expect(validate).toBeDefined();

        console.log("===> validate", validate);

        expect(validate.valid).toBe(true);



    })
    it('external api test validation Vat AT Valid III', async () => {
        const payload: CheckVatRequest = { countryCode: 'AT', vatNumber: 'U52614407' }

        const validate: Partial<CheckVatResponse> = await validationExternalService.validateVatFetch(payload);

        expect(validate).toBeDefined();

        console.log("===> validate", validate);

        expect(validate.valid).toBe(true);



    })
    it('external api test validation Vat AT Valid IV', async () => {
        const payload: CheckVatRequest = { countryCode: 'AT', vatNumber: 'U52614407' }

        const validate: Partial<CheckVatResponse> = await validationExternalService.validateVatFetch(payload);

        expect(validate).toBeDefined();

        console.log("===> validate", validate);

        expect(validate.valid).toBe(true);



    })
    it('external api test validation Vat Germany DE Valid IV ', async () => {
        const payload: CheckVatRequest = { countryCode: 'DE', vatNumber: '279448078' }

        const validate: Partial<CheckVatResponse> = await validationExternalService.validateVatFetch(payload);

        expect(validate).toBeDefined();

        console.log("===> validate", validate);

        expect(validate.valid).toBe(true);



    })
    it('external api test validation Vat SPAIN Valid V ', async () => {
        const payload: CheckVatRequest = { countryCode: 'ES', vatNumber: 'B84570936' }

        const validate: Partial<CheckVatResponse> = await validationExternalService.validateVatFetch(payload);

        expect(validate).toBeDefined();

        console.log("===> validate", validate);

        expect(validate.valid).toBe(true);



    })
    it('external api test validation Vat SPAIN Valid VI ', async () => {
        const payload: CheckVatRequest = { countryCode: 'BE', vatNumber: '0411905847' }

        const validate: Partial<CheckVatResponse> = await validationExternalService.validateVatFetch(payload);


        expect(validate).toBeDefined();

        console.log("===> validate", validate);

        expect(validate.valid).toBe(true);



    })




})