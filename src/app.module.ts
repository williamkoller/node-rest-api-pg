import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './infra/db/models/user/user.model';
import { UserModule } from './presentation/modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: 'db-pg',
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        port: 5432,
        database: config.get<string>('DB_NAME'),
        synchronize: true,
        entities: [UserModel],
        extra: {
          max: 3,
          connectionTimeoutMillis: 3000,
        },
      }),
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
