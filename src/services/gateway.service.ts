import { Inject } from '@nestjs/common'
import { Consul, Thenable } from 'consul'
import { APP_CONSUL_PROVIDER } from 'src/core/constants'
import { ConsulService } from 'src/modules/consul/services/consul.service'

export class GatewayService {
  private readonly consul: Consul
  private services: { [id: string]: any } = {}

  constructor(
    @Inject(APP_CONSUL_PROVIDER) private consulService: ConsulService
  ) {
    this.consul = this.consulService.consul
    this.updateServices()
    var watch = this.consul.watch({
      method: this.consul.agent.services,
      options: { key: 'test' },
      backoffFactor: 1000
    })
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
