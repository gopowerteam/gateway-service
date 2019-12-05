import { Module, Inject, DynamicModule, Global } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { ConfigService } from '../config/services/config.service'
import { APP_CONSUL_PROVIDER, APP_CONFIG_PROVIDER } from 'src/core/constants'
import { TerminusModule } from '@nestjs/terminus'
import { ConsulService } from './services/consul.service'
@Global()
@Module({
  imports: [
    // 健康检查
    TerminusModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        endpoints: [
          {
            url: config.get('consul.check.router', '/health'),
            healthIndicators: []
          }
        ]
      }),
      inject: [APP_CONFIG_PROVIDER]
    })
  ]
})
export class ConsulModule {
  public static forRoot(): DynamicModule {
    const consulProvider = {
      provide: APP_CONSUL_PROVIDER,
      useFactory: async (config: ConfigService): Promise<ConsulService> => {
        // 创建consulService
        const consulService = new ConsulService(config)
        await consulService.register()
        return consulService
      },
      inject: [APP_CONFIG_PROVIDER]
    }
    return {
      module: ConsulModule,
      providers: [consulProvider],
      exports: [consulProvider]
    }
  }
}
