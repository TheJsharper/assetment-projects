import { Server } from "http";
import { PostSchema } from "../validations/post-schema.js";
import { ValidationService } from "../services/validation.service.js";
import { FileService } from "../services/file.service.js";
import { ValidationExternalService } from "../services/validation-external.service.js";
import { ValidationExternalFetchService } from "../services/validation-external-fetch.service.js";
import { ValidationExternalReqService } from "../services/validation-external-req.service.js";

type ExpressServerOptions = Pick<
  Server,
  | "keepAliveTimeout"
  | "maxHeadersCount"
  | "timeout"
  | "maxConnections"
  | "headersTimeout"
  | "requestTimeout"
>;

export interface Configuration {
  // TO_CHANGE: add your needed configuration parameters
  readonly validationExternalService: ValidationExternalService,
  readonly validationService: ValidationService 
  readonly postSchema: PostSchema;
  readonly port: number;
  readonly expressServerOptions: ExpressServerOptions;
}

export const readAppConfiguration = (file: string): Configuration => {
  /*const configuration: Configuration = JSON.parse(
    fs.readFileSync(file, "utf-8")
  );*/
  const configuration: Configuration = {
    validationExternalService: new ValidationExternalService(
      new ValidationExternalFetchService(),
      new ValidationExternalReqService()
    ),
    validationService: new ValidationService(new FileService()),
    postSchema: new PostSchema(),
    expressServerOptions: {
      headersTimeout: 10000,
      keepAliveTimeout: 10000,
      maxConnections: 1000,
      maxHeadersCount: 100,
      requestTimeout: 100000,
      timeout: 100000,
    },
    port: 3000
  }

  return configuration;
};

