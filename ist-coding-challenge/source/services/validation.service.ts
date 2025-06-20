import { FileService } from "./file.service";

export interface RequestValidation {
    countryCode: string;
    vat: string;
}
export interface ResponseValidation {
    validated: boolean;
    details: string;
}

export class ValidationService {

    constructor(private fileService: FileService) { }



    public async isValidCountryCode(requestValidation: RequestValidation): Promise<ResponseValidation> {

        if (!requestValidation || !requestValidation.countryCode) {
            return Promise.reject(new Error("Country code is required for validation."));
        }

        if (!requestValidation.vat ) {
            return Promise.reject(new Error("VAT number is required for validation."));
        }

        const countryCodes = await this.fileService.lodCountries();
        
        if (!countryCodes || !Array.isArray(countryCodes)) {
            return Promise.reject(new Error("Country codes data is not available or invalid."));
        }

        if (countryCodes.length === 0) {
            return Promise.reject(new Error("Country codes data is empty."));
        }

        const found = countryCodes.find(country => country.countryCode === requestValidation.countryCode);

        if (!found) {
            return Promise.reject(new Error(`Invalid country code: ${requestValidation.countryCode}`));
        }

        const result = new RegExp(`${found.regex}`, 'g').test(requestValidation.vat);

        if (!result)
            return Promise.reject(new Error(`Invalid VAT number: ${requestValidation.vat} for country code: ${requestValidation.countryCode}`));


        return Promise.resolve({ validated: true, details: "VAT number is valid for the given country code." });



    }

  
}   