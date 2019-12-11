import { Inject } from '@nestjs/common'
import { Consul, Thenable } from 'consul'
import { APP_CONSUL_PROVIDER } from 'src/core/constants'
import { ConsulService } from 'src/modules/consul/services/consul.service'
import { isNullOrUndefined } from 'util'

export class GatewayService {
  private readonly consul: Consul
  private services: { [id: string]: any } = {}

  constructor(
    @Inject(APP_CONSUL_PROVIDER) private consulService: ConsulService
  ) {
    this.consul = this.consulService.consul
    this.createConsulWatch()
  }

  /**
   * 创建Consul服务监听
   */
  private createConsulWatch() {
    const watch = this.consul.watch({
      method: this.consul.catalog.services
    })

    // 更新服务节点
    watch.on('change', () => this.updateServices())
  }

  /**
   * 更新服务列表
   */
  public updateServices(): Thenable<any> {
    return this.getServices().then((services: any) => {
      this.services = services
    })
  }

  /**
   * 获取服务列表
   */
  public getServices(): Thenable<any> {
    return this.consul.agent.services()
  }

  /**
   * 清理服务
   */
  public deregisterServices(services: { id: string; tags: string[] }[]) {
    // 可以移除的服务Tag
    const serviceTags = ['api', 'default']
    // 通过Tag查找Service
    const findServiceByTag = service =>
      serviceTags.some(tag => service.tags.includes(tag))
    // 清理服务
    return Promise.all(
      Object.values(services)
        .filter(services => findServiceByTag(services))
        .map(({ id }) => {
          this.consul.agent.service.deregister(id)
        })
    )
  }

  /**
   * 重置服务列表
   */
  public resetServiceList(): Thenable<any> {
    return this.consul.agent
      .services()
      .then(services =>
        Object.values(services).map((service: any) => ({
          id: service.ID,
          tags: service.Tags
        }))
      )
      .then(services => this.deregisterServices(services))
  }

  /**
   * 清理服务列表
   */
  public clearServiceList() {
    return this.consul.health
      .state('critical')
      .then((services: any[]) =>
        services.map(service => ({
          id: service.ServiceID,
          tags: service.ServiceTags
        }))
      )
      .then(services => this.deregisterServices(services))
  }

  /**
   * 查询服务信息
   */
  public findService({ serviceName = undefined, serviceTags = [] }) {
    // 通过Tag查找Service
    const findServiceByTag = service =>
      serviceTags.every(tag => service.Tags.includes(tag))

    // 通过Name查找Service
    const findServiceByName = service =>
      isNullOrUndefined(serviceName) || service.Service === serviceName

    return Object.values(this.services).find(
      service => findServiceByTag(service) && findServiceByName(service)
    )
  }

  /**
   * 查询API服务信息
   */
  public findApiService(serviceName) {
    return this.findService({
      serviceName,
      serviceTags: ['api']
    })
  }


  /**
   * 查询API服务信息
   */
  public findWebService(serviceName) {
    return this.findService({
      serviceName,
      serviceTags: ['web']
    })
  }

  /**
   * 查询API服务信息
   */
  public findDefaultService() {
    return this.findService({
      serviceTags: ['default', 'web']
    })
  }
}
