import { NextFunction, Request, Response } from "express";
import { ZodError, ZodIssue } from "zod";



const validVatValidator = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body)
    next();
  } catch (error: any) {
    if (error instanceof ZodError) {

      const errorMessages = error.errors.map((issue: ZodIssue) => ({
        message: `${issue.message}`,

      }))
      return res.status(400).json({ error: 'Invalid data', details: errorMessages });
    } else {

      return res.status(500).json({ errors: error.errors, test: 'errr' });
    }
  }
};

export default validVatValidator;

