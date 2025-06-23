import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ZodValidationPipe, } from "nestjs-zod";
import { z } from 'zod';
import { PostSchemaVatValidator } from "../validations/post-schema";


@ApiTags('Vat Validation')
@Controller('/')
export class VatCheckerController {



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
    @ApiBody({

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
    postValidationVat(@Body() vatValidatorDto: z.infer<typeof PostSchemaVatValidator>): Promise<any> {
        return Promise.resolve({});
    }
}