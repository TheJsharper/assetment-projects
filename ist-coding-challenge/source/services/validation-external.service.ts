import { ValidationExternalFetchService } from "./validation-external-fetch.service";
import { ValidationExternalReqService } from "./validation-external-req.service";

export interface CheckVatRequest {
    countryCode: string;
    vatNumber: string;
}

export interface CheckVatResponse {
    countryCode: string;
    vatNumber: string;
    requestDate: string;
    format: string
    valid: boolean;
    requestIdentifier: string;
    name: string;
    address: string;
    traderName: string;
    traderStreet: string;
    traderPostalCode: string;
    traderCity: string;
    traderCompanyType: string;
}

export class ValidationExternalService {


    constructor(private validationExternalFetchService: ValidationExternalFetchService, private validationExternalReqService: ValidationExternalReqService) { }

    async validateVat(req: CheckVatRequest): Promise<Partial<CheckVatResponse>> {

        if ('fetch' in global) {
            return this.validationExternalFetchService.validateVatFetch(req);
        } else {
            return this.validationExternalReqService.validateVatRequest(req);
        }
    }
  
}