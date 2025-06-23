import { ValidationExternalReqService } from "../../source/services/validation-external-req.service";
import { CheckVatRequest, CheckVatResponse } from "../../source/services/validation-external-fetch.service";


describe('validation external with request service', () => {

    let validationExternalReqService: ValidationExternalReqService;
    const timeOut = 10000;


    beforeEach(() => {
        validationExternalReqService = new ValidationExternalReqService();
    })



    it('external api test validation Vat AT Valid', async () => {
        const payload: CheckVatRequest = { countryCode: 'AT', vatNumber: 'U62060511' }

        const validate: Partial<CheckVatResponse> = await validationExternalReqService.validateVatRequest(payload);

        expect(validate).toBeDefined();

        console.log("===> validate", validate)

        expect(validate.valid).toBe(true);



    }, timeOut)
    it('external api test validation Vat AT Valid II', async () => {
        const payload: CheckVatRequest = { countryCode: 'AT', vatNumber: 'U66889218' }

        const validate: Partial<CheckVatResponse> = await validationExternalReqService.validateVatRequest(payload);

        expect(validate).toBeDefined();

        console.log("===> validate", validate);

        expect(validate.valid).toBe(true);



    }, timeOut)
    it('external api test validation Vat AT Valid III', async () => {
        const payload: CheckVatRequest = { countryCode: 'AT', vatNumber: 'U52614407' }

        const validate: Partial<CheckVatResponse> = await validationExternalReqService.validateVatRequest(payload);

        expect(validate).toBeDefined();

        console.log("===> validate", validate);

        expect(validate.valid).toBe(true);



    })
    it('external api test validation Vat AT Valid IV', async () => {
        const payload: CheckVatRequest = { countryCode: 'AT', vatNumber: 'U52614407' }

        const validate: Partial<CheckVatResponse> = await validationExternalReqService.validateVatRequest(payload);

        expect(validate).toBeDefined();

        console.log("===> validate", validate);

        expect(validate.valid).toBe(true);



    })
    it('external api test validation Vat Germany DE Valid IV ', async () => {
        const payload: CheckVatRequest = { countryCode: 'DE', vatNumber: '279448078' }

        const validate: Partial<CheckVatResponse> = await validationExternalReqService.validateVatRequest(payload);

        expect(validate).toBeDefined();

        console.log("===> validate", validate);

        expect(validate.valid).toBe(true);



    }, timeOut)
    it('external api test validation Vat SPAIN Valid V ', async () => {
        const payload: CheckVatRequest = { countryCode: 'ES', vatNumber: 'B84570936' }

        const validate: Partial<CheckVatResponse> = await validationExternalReqService.validateVatRequest(payload);

        expect(validate).toBeDefined();

        console.log("===> validate", validate);

        expect(validate.valid).toBe(true);



    }, timeOut)
    it('external api test validation Vat SPAIN Valid VI ', async () => {
        const payload: CheckVatRequest = { countryCode: 'BE', vatNumber: '0411905847' }

        const validate: Partial<CheckVatResponse> = await validationExternalReqService.validateVatRequest(payload);

        expect(validate).toBeDefined();

        console.log("===> validate", validate);

        expect(validate.valid).toBe(true);



    }, timeOut)
    it('external api test validation error', async () => {
        const payload: CheckVatRequest = null as any

        await expect(validationExternalReqService.validateVatRequest(payload)).rejects.toThrow('Error passing payload')

    }, timeOut)

    it('external api test validation error', async () => {
        const payload: CheckVatRequest = { countryCode: 'BE', vatNumber: '0411905847' }

        jest.spyOn(validationExternalReqService, 'path', 'get').mockReturnValue("/taxation_customs/vies/rest-api//check-vat-number/non-existent" as any);

        await expect(validationExternalReqService.validateVatRequest(payload)).rejects.toThrow('statuscode:====>x 404')

    }, timeOut)




})