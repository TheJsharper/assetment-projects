import { RequestHandler } from "express";
import { Configuration } from "../models/ConfigurationModel";

export default class DummyController {
  configuration: Configuration;

  constructor(configuration: Configuration) {
    this.configuration = configuration;
  }

  async postRequestHandler(): Promise<RequestHandler> {

    return (req, res, next) => {
      res.json({
        ok: true,
        mgs: "Hello World from POSt"
      });
      next();
    };

  }

  async dummyFunction(dummyValue: boolean): Promise<boolean> {
    this.dummyFunction.toString();
    return dummyValue;
  }
}
