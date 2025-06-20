import { RequestHandler } from "express";
import { Configuration } from "../models/ConfigurationModel";
import { CheckVatRequest } from "../services/validation-external-fetch.service";
import { RequestValidation } from "../services/validation.service";

export default class DummyController {
  configuration: Configuration;

  constructor(configuration: Configuration) {
    this.configuration = configuration;
  }

  async postRequestHandler(): Promise<RequestHandler> {

    return async (req, res, next) => {

      const requestValidation: RequestValidation = { ...req.body.body as RequestValidation }

      try {
        const status = await this.configuration.validationService.isValidCountryCode(requestValidation);

        if (status.validated) {

          const checkVatRequest: CheckVatRequest = { countryCode: requestValidation.countryCode, vatNumber: requestValidation.vat };

          try {

            const validationExternalService = await this.configuration.validationExternalService.validateVat(checkVatRequest);

            if (validationExternalService.valid) {
              res.json({
                validated: true,
                details: "VAT number is valid for the given country code."
              })
            } else {
              res.json({
                validated: validationExternalService.valid,
                message: "VAT number is invalid for the given country code."
              })
            }

          } catch (err) {
            res.json({
              validated: false,
              message: "VAT number is invalid for the given country code."
            })

          }

        } else {

          res.json({ ...status })
        }
        next();
      } catch (err) {
        res.json({
          "validated": false,
          "message": "The external service could not be reached."
        });
        next();
      }





    };

  }

}
