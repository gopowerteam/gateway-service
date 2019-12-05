import { Module } from '@nestjs/common'
import { ConfigModule } from './modules/config/config.module'
import { join } from 'path'
import { ConsulModule } from './modules/consul/consul.module'
import { ProxyService } from './services/proxy.service'
import { GatewayController } from './controllers/gateway.controller'
import { GatewayService } from './services/gateway.service'

@Module({
  imports: [
    ConfigModule.forRoot(join(__dirname, '..', 'config.yml')),
    ConsulModule.forRoot()
  ],
  controllers: [GatewayController],
  providers: [GatewayService, ProxyService]
})
export class AppModule {}
