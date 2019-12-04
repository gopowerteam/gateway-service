import { Module, Inject, DynamicModule, Global } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/services/config.service';
import {
  APP_CONSUL_PROVIDER,
  APP_CONFIG_PROVIDER,
  APP_SERVICE_PROVIDER,
} from 'src/core/constants';
import { Consul } from 'consul';
import { ConsulService } from './services/consul.service';

@Global()
@Module({})
export class ServiceModule {
  public static forRoot(): DynamicModule {
    const serviceProvider = {
      provide: APP_SERVICE_PROVIDER,
      useFactory: async (
        config: ConfigService,
        consul: Consul,
      ): Promise<ConsulService> => {
        const service = new ConsulService(consul, config);

        await service.register();

        return service;
      },
      inject: [APP_CONFIG_PROVIDER, APP_CONSUL_PROVIDER],
    };
    return {
      module: ServiceModule,
      providers: [serviceProvider],
      exports: [serviceProvider],
    };
  }
}
