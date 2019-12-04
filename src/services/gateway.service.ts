import { ConsulService } from 'src/modules/service/services/consul.service'
import { Inject } from '@nestjs/common'
import { APP_SERVICE_PROVIDER } from 'src/core/constants'
import { Consul, Thenable } from 'consul'

export class GatewayService {
  private readonly consul: Consul
  private services: { [id: string]: any } = {}

  constructor(
    @Inject(APP_SERVICE_PROVIDER) private consulService: ConsulService
  ) {
    this.consul = this.consulService.consul
    this.updateServices()
  }

  /**
   * 更新服务列表
   */
  public updateServices(): Thenable<any> {
    return this.consul.agent.services().then((services: any) => {
      this.services = services
    })
  }

  /**
   * 查询服务信息
   */
  public findService(serviceName) {
    return Object.values(this.services).find(service => {
      return service.Service === serviceName
    })
  }
}
