import { NextFunction, Request, Response } from 'express';

type ExpressFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const response = (controller: ExpressFunction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await controller(req, res, next);
      res.status(200).json(data);
    } catch (error) {
      console.error('error', error);
      next(error);
    }
  };
};
