import { App } from '@/app';

import { AuthRoutes } from './api/auth/auth.routes';
import { UsersRoutes } from './api/users/users.routes';

function bootstrap() {
  try {
    const routes = [new AuthRoutes(), new UsersRoutes()];

    const app = new App(routes);

    app.listen();
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
