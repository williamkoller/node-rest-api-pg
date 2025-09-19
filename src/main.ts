import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cluster from 'cluster';
import { cpus } from 'os';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableShutdownHooks();
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0', () =>
    logger.log(`Server running at port: ${port}`),
  );
}
if (cluster.isPrimary) {
  const numCPUs = cpus().length;
  const logger = new Logger('Cluster');

  logger.log(`🧠 Primary PID ${process.pid} starting ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`❌ Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  bootstrap();
}
