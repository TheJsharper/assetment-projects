import { Server } from "http";
import fs from "fs";
import { PostSchema } from "../validations/post-schema";

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
  readonly postSchema: PostSchema;
  readonly port: number;
  readonly expressServerOptions: ExpressServerOptions;
}

export const readAppConfiguration = (file: string): Configuration => {
  /*const configuration: Configuration = JSON.parse(
    fs.readFileSync(file, "utf-8")
  );*/
  const configuration: Configuration = {
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
