import { Router } from "express";
import DummyController from "../controllers/DummyController.js"; // TO_CHANGE: naming
import validVatValidator from "../middlewares/validate-post-request.middleware.js";
import { Configuration } from "../models/ConfigurationModel.js";

let dummyController: DummyController; // TO_CHANGE: naming

const router = (configuration: Configuration): Router => {
  // TO_CHANGE: if you don't need your configuration here or in the controller, you can remove the function and just export the router itself
  const expressRouter: Router = Router({
    caseSensitive: true,
    strict: true,
  });
  dummyController = new DummyController(configuration); // You can make the controller a const if it doesn't need the configuration
  expressRouter.post(
    "/valid-vat/",validVatValidator(configuration.postSchema.getVatValidValidation()),
    async (req, res, next) => {
      try {
        const handler = await dummyController.postRequestHandler();
        return handler( req, res, next);
      } catch (err) {
        next(err);
      }
    }
  );
  return expressRouter;
};
export default router;
