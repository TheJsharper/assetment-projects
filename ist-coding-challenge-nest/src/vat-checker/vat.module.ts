import { Module } from "@nestjs/common";
import { VatCheckerController } from "./controllers/vat-checker.controller";
import { FileService } from "./services/file.service";
import { ValidationExternalFetchService } from "./services/validation-external-fetch.service";
import { ValidationExternalReqService } from "./services/validation-external-req.service";
import { ValidationExternalService } from "./services/validation-external.service";
import { ValidationService } from "./services/validation.service";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from 'nestjs-zod'
@Module({
  imports: [],
  controllers: [VatCheckerController],
  providers: [
    FileService,
    ValidationExternalFetchService,
    ValidationExternalReqService,
    ValidationExternalService,
    ValidationService,
    {
      provide:APP_PIPE,
      useClass: ZodValidationPipe
    }
  ]
  ,
})
export class VatModule { }