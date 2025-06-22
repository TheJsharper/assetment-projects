import { Module } from "@nestjs/common";
import { FileService } from "./services/file.service";
import { ValidationExternalFetchService } from "./services/validation-external-fetch.service";
import { ValidationExternalReqService } from "./services/validation-external-req.service";
import { ValidationExternalService } from "./services/validation-external.service";
import { ValidationService } from "./services/validation.service";

@Module({
  imports: [],
  controllers: [],
  providers: [FileService, ValidationExternalFetchService, ValidationExternalReqService, ValidationExternalService, ValidationService],
})
export class VatModule {}