import { App } from '@api/app';

import { AuthRoutes } from './api/auth/auth.routes';
import { UserRoutes } from './api/user/user.routes';

function bootstrap() {
  try {
    const routes = [new AuthRoutes(), new UserRoutes()];

    const app = new App(routes);

    app.listen();
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
