import { HttpStatus } from '@api/common/enums';
import { HttpException } from '@api/common/types';
import { NextFunction, Request, Response } from 'express';
import { ZodSchema, z } from 'zod';

type BodyValidation = {
  body: boolean;
};
type QueryValidation = {
  query: boolean;
};
type ParamsValidation = {
  params: boolean;
};

type ValidationOptions = BodyValidation | QueryValidation | ParamsValidation;

export const validate = (schema: ZodSchema, options: ValidationOptions = { body: true }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if ('body' in options) {
        if (req.file?.fieldname) {
          req.body[req.file?.fieldname] = req.file;
        }
        const parsedSchema = schema.parse(req.body);
        req.body = parsedSchema;
      } else if ('query' in options) {
        const parsedSchema = schema.parse(req.query);
        req.query = parsedSchema;
      }
      next();
    } catch (error) {
      let err = error;
      if (err instanceof z.ZodError) {
        err = err.issues.map((e) => ({ path: e.path[0], message: e.message }));
      }
      next(new HttpException({ status: HttpStatus.BAD_REQUEST, message: err as string }));
    }
  };
};
