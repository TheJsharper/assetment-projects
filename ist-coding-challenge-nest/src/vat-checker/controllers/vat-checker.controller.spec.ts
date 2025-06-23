import { TestingModule, Test } from "@nestjs/testing"
import { VatCheckerController } from "./vat-checker.controller";
import { ValidationExternalService } from "../services/validation-external.service";
import { ValidationExternalReqService } from "../services/validation-external-req.service";
import { ValidationExternalFetchService } from "../services/validation-external-fetch.service";
import { FileService } from "../services/file.service";
import { ValidationService } from "../services/validation.service";

describe('Vat Checker Controller Unit test',()=>{
    let vatCheckerController:VatCheckerController;

    beforeEach(async ()=>{
        const app:TestingModule = await Test.createTestingModule({
            controllers:[VatCheckerController],
            providers:[FileService, ValidationExternalFetchService, ValidationExternalReqService, ValidationExternalService, ValidationService]
        }).compile();
        vatCheckerController = app.get<VatCheckerController>(VatCheckerController);

    })
})