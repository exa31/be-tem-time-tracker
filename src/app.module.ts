import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeSessionModule } from './time-session/time-session.module';
import VarEnv from './config/varEnv';
import { IsAuth } from './middleware/is-auth.middleware';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './lib/logger';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';

@Module({
  imports: [
    MongooseModule.forRoot(VarEnv.mongo_uri, {
      maxPoolSize: 1,
      minPoolSize: 1,
      retryAttempts: 3,
      maxConnecting: 1,
      connectionErrorFactory: (err) => {
        console.log(VarEnv.mongo_uri);
        console.error('MongoDB connection error:', err);
        throw new Error('Failed to connect to MongoDB');
      },
    }),
    TimeSessionModule,
    AuthModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*api');
    consumer.apply(IsAuth).exclude('*api/v1/auth').forRoutes('*api');
  }
}
