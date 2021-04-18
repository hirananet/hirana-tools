import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const bodyParser = require('body-parser');

// APM //
import { APM_MIDDLEWARE, ApmErrorInterceptor, ApmHttpUserContextInterceptor, initializeAPMAgent } from 'elastic-apm-nest';
initializeAPMAgent({
  serviceName: process.env.APM_SERVICE_NAME ? process.env.APM_SERVICE_NAME : 'tools-poc',
  serverUrl: process.env.APM_SERVER ? process.env.APM_SERVER : 'http://srv-captain--apm:8200',
});
// APM //

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn']
  });
  app.enableCors();
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

  // APM //
  const apmMiddleware = app.get(APM_MIDDLEWARE);
  const globalInterceptors = [
    app.get(ApmHttpUserContextInterceptor),
    app.get(ApmErrorInterceptor),
  ];
  app.useGlobalInterceptors(... globalInterceptors);
  app.use(apmMiddleware);
  // APM //
  await app.listen(3000);
}
bootstrap();
