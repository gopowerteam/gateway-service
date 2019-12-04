import { Module, Inject, DynamicModule, Global } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/services/config.service';
import { APP_CONSUL_PROVIDER, APP_CONFIG_PROVIDER } from 'src/core/constants';
import * as Consul from 'consul';

@Global()
@Module({})
export class ConsulModule {
  public static forRoot(): DynamicModule {
    const consulProvider = {
      provide: APP_CONSUL_PROVIDER,
      useFactory: async (config: ConfigService): Promise<Consul.Consul> => {
        const consulConfig = config.get('consul');

        const option = { host: consulConfig.host, port: consulConfig.port };

        return new Consul({
          ...option,
          promisify: true,
        });
      },
      inject: [APP_CONFIG_PROVIDER],
    };
    return {
      module: ConsulModule,
      providers: [consulProvider],
      exports: [consulProvider],
    };
  }
}
