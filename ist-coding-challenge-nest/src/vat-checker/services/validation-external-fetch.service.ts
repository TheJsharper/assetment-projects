import { Injectable } from "@nestjs/common";

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
@Injectable()
export class ValidationExternalFetchService {

    public static readonly path = 'https://ec.europa.eu/taxation_customs/vies/rest-api//check-vat-number';

   /* async validateVat(req: CheckVatRequest): Promise<Partial<CheckVatResponse>> {

        if ('fetch' in global) {
            return this.validateVatFetch(req);
        } else {
            //  return this.validateVatRequest(req);
            return Promise.resolve({});
        }
    }*/

    async validateVatFetch(req: CheckVatRequest): Promise<Partial<CheckVatResponse>> {

        const init: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req)
        };

        const response = await fetch(ValidationExternalFetchService.path, init);

        return await response.json() as Partial<CheckVatResponse>;



    }
}