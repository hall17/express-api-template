import 'reflect-metadata';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cron from 'node-cron';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { CREDENTIALS, LOG_FORMAT, NODE_ENV, ORIGIN, PORT } from '@/config';
import { errorMiddleware } from '@/middlewares';

import { logger, stream } from '@/libs/logger';
import { Routes } from '@/types/routes.interface';

export class App {
  app: express.Application;
  env: string;
  port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    try {
      this.initializeMiddlewares();
      this.initializeRoutes(routes);
      this.initializeSwagger();
      this.initializeErrorHandling();

      cron.schedule('0 */14 * * * *', () => {
        fetch('http://localhost:3000/health-check').catch(() => {
          console.log('error in health check');
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT as string, { stream }));
    // this.app.use(hpp());
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    // health check endpoint
    this.app.get('/health-check', (req, res) => {
      res.status(200).send('OK');
    });

    routes.forEach((route) => {
      this.app.use('/api', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Express API',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}
