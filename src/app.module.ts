import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './modules/config/config.module';
import { join } from 'path';
import { ConsulModule } from './modules/consul/consul.module';
import { ServiceModule } from './modules/service/service.module';

@Module({
  imports: [
    ConfigModule.forRoot(join(__dirname, '..', 'config.yml')),
    ConsulModule.forRoot(),
    ServiceModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
