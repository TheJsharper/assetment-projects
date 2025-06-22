import { FileService } from "./file.service";
import { ValidationService } from "./validation.service";

describe("ValidationService test suite", () => {
    let validationService: ValidationService;
    let fileService: FileService;

    beforeEach(() => {
        fileService = new FileService();
        validationService = new ValidationService(fileService);
    });

    it('should be defined', () => {
        expect(validationService).toBeDefined();
    });

    it('should validate a correct country DE code and VAT number', async () => {
        const requestValidation = { countryCode: 'DE', vat: 'DE123456789' };
        const response = await validationService.isValidCountryCode(requestValidation);
        expect(response.validated).toBe(true);
        expect(response.details).toBe("VAT number is valid for the given country code.");
    });
    it('should validate a correct country AT code and VAT number', async () => {
        const requestValidation = { countryCode: 'AT', vat: 'ATU12345678' }; // Example VAT number for Austria
        const response = await validationService.isValidCountryCode(requestValidation);
        expect(response.validated).toBe(true);
        expect(response.details).toBe("VAT number is valid for the given country code.");
    });

    it('should throw an error for an invalid country code', async () => {
        const requestValidation = { countryCode: 'XX', vat: 'XX123456789' };
        await expect(validationService.isValidCountryCode(requestValidation)).rejects.toThrow("Invalid country code: XX");
    });

    it('should throw an error for an invalid VAT number', async () => {
        const requestValidation = { countryCode: 'DE', vat: 'XX123456789' };
        await expect(validationService.isValidCountryCode(requestValidation)).rejects.toThrow("Invalid VAT number: XX123456789 for country code: DE");
    });

    it('should throw an error when VAT number is not a string', async () => {
        const requestValidation = { countryCode: 'DE', vat: undefined as any }; // Invalid VAT number type
        await expect(validationService.isValidCountryCode(requestValidation)).rejects.toThrow("VAT number is required for validation.");    
    }
    );
    it('should throw an error when country code is not a string', async () => {
        const requestValidation = undefined as any // Invalid requestValidation type
        await expect(validationService.isValidCountryCode(requestValidation)).rejects.toThrow("Country code is required for validation.");
    });
    it('should throw an error when country code is missing', async () => {
        const requestValidation = { vat: 'DE123456789', countryCode: undefined as any };
        await expect(validationService.isValidCountryCode(requestValidation)).rejects.toThrow("Country code is required for validation.");
    });

    it('should throw an error when VAT number is missing', async () => {
        const requestValidation = { countryCode: 'DE', vat: undefined as any };
        await expect(validationService.isValidCountryCode(requestValidation)).rejects.toThrow("VAT number is required for validation.");
    });

    it('should throw an error when country codes data is not available', async () => {
        jest.spyOn(fileService, 'lodCountries').mockImplementation(() => {
            return Promise.reject(new Error("Country codes data is not available."));
        });
        const requestValidation = { countryCode: 'DE', vat: 'DE123456789' };
        await expect(validationService.isValidCountryCode(requestValidation)).rejects.toThrow("Country codes data is not available.");
    }); 
    it('should throw an error when country codes data is empty', async () => {
        jest.spyOn(fileService, 'lodCountries').mockResolvedValue([]);
        const requestValidation = { countryCode: 'DE', vat: 'DE123456789' };
        await expect(validationService.isValidCountryCode(requestValidation)).rejects.toThrow("Country codes data is empty.");
    });

    it('should throw an error when country codes data is invalid', async () => {
        jest.spyOn(fileService, 'lodCountries').mockResolvedValue(null as any);
        const requestValidation = { countryCode: 'DE', vat: 'DE123456789' };
        await expect(validationService.isValidCountryCode(requestValidation)).rejects.toThrow("Country codes data is not available or invalid.");
    });

    it('should throw an error when VAT number does not match the regex for the country code', async () => {
        const requestValidation = { countryCode: 'DE', vat: 'DE12345678' }; // Invalid VAT number for Germany
        await expect(validationService.isValidCountryCode(requestValidation)).rejects.toThrow("Invalid VAT number: DE12345678 for country code: DE");
    });
    
    
    
});
