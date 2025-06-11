import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyLogger } from './lib/logger';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeSessionModule } from './time-session/time-session.module';
import VarEnv from './config/varEnv';
import { IsAuth } from './middleware/is-auth.middleware';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(VarEnv.mongo_uri, {
      maxPoolSize: 1,
      minPoolSize: 1,
      maxConnecting: 1,
    }),
    TimeSessionModule,
    AuthModule,
  ],
  controllers: [AppController],
  exports: [MyLogger],
  providers: [AppService, MyLogger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsAuth).forRoutes('*');
  }
}
