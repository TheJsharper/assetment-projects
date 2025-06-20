import express, { Express, Router, json } from "express";
import responseTime from "response-time";
import Helmet from "helmet";
import DummyRouter from "./routers/DummyRouter.js"; // TO_CHANGE: naming
import { Configuration } from "./models/ConfigurationModel.js";
import http from 'http'

export default function createApp(configuration: Configuration): {
  app: Express;
  router: Router;
} {
  const app: Express = express();

  app.use(Helmet());
  app.use(json());

  app.use(responseTime({ suffix: true }));

  const router = DummyRouter(configuration);
  app.use("/", router);
  app.get("/", (req, res) => {
    res.json({
      "ok": true,
      msg: ' GET Hello world'
    })
  })

  return { app, router };
}

export class Server {
  private _app: Express;
  public get app(): Express {
    return this._app;
  }

  constructor(private configuration: Configuration) {
    this._app = express();
    this.middlewares();
  }
  private middlewares(): void {
    this.app.use(Helmet());
    this.app.use(json());

    this.app.use(responseTime({ suffix: true }));

  }
  public createApp(): { app: Express, router: Router } {

    const router = DummyRouter(this.configuration);
    this.app.use("/", router);
    this.app.get("/", (req, res) => {
      res.json({
        "ok": true,
        msg: ' GET Hello world'
      })
    })

    return { app: this.app, router };
  }

  listen(): http.Server {
    return this._app.listen(this.configuration.port, () => console.log({ description: `STARTED AND SERVING PORT: ${this.configuration.port}`  }));
  }

}