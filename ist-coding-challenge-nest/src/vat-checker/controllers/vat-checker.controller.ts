import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { ZodValidationPipe, } from "nestjs-zod";
import { z } from 'zod';
import { ValidationExternalService } from "../services/validation-external.service";
import { RequestValidation, ValidationService } from "../services/validation.service";
import { PostSchemaVatValidator } from "../validations/post-schema";


@ApiTags('Vat Validation')
@Controller('/')
export class VatCheckerController {


    constructor(private readonly validationService: ValidationService, private readonly validationExternalService: ValidationExternalService) {

    }

    @Post('valid-vat/')
    @UsePipes(new ZodValidationPipe(PostSchemaVatValidator))
    @ApiResponse({
        status: 200,
        description: 'if the vat number is correct',
        schema: {
            type: 'object',
            properties: {
                validated: {
                    type: 'boolean',
                    example: true,
                    description: 'vatnumber is correct'
                },
                details: {
                    type: 'string',
                    example: 'VAT number is valid for the given country code.'
                }
            }
        }

    })
    @ApiResponse({
        status: 400,
        description: 'if the vat number is not correct',
        schema: {
            type: 'object',
            properties: {
                validated: {
                    type: 'boolean',
                    example: false,
                    description: 'vatnumber is not correct'
                },
                details: {
                    type: 'string',
                    example: 'Invalid country code or VAT number.'
                }
            }
        }
    })
    @ApiResponse({
        status: 500,
        description: 'if there is an internal server error',
        schema: {
            type: 'object',
            properties: {
                countryCode: {
                    type: 'string',
                    example: "DE",
                    description: 'The country Code', required: [],
                    maxLength: 2,
                    minLength: 2
                },
                vat: {
                    type: 'string',
                    example: '12345678',
                    description: 'The VAT number',
                    minLength: 8,
                    maxLength: 15
                }
            },
        }

    })
    async postValidationVat(@Body() vatValidatorDto: z.infer<typeof PostSchemaVatValidator>): Promise<{ validated: boolean, details: string }> {


        const validationRequest: RequestValidation = {
            countryCode: vatValidatorDto.body.countryCode,
            vat: vatValidatorDto.body.vat
        };

        try {

            const listFileCountry = await this.validationService.isValidCountryCode(validationRequest);
            if (listFileCountry.validated) {
                try {
                    await this.validationExternalService.validateVat({ countryCode: validationRequest.countryCode, vatNumber: validationRequest.vat });
                    if (listFileCountry.validated) {
                        return Promise.resolve({ validated: true, details: "VAT number is valid for the given country code." });
                    }
                } catch (error) {
                    return Promise.reject({ validated: false, details: `External validation failed: ${error.message}` });
                }
            }
            return { validated: false, details: "Invalid country code or VAT number." };
        } catch (error) {
            console.log('Validation error:=====>', error);
            return  Promise.reject(new Error(`Validation failed:==>||||===`));
        }
    }
}