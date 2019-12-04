import { Consul } from 'consul'
import { ConfigService } from 'src/modules/config/services/config.service'
import { getIPAddress } from 'src/common/utils/os.util'
import { MD5 } from 'crypto-js'

export class ConsulService {
  public readonly consul: Consul
  private serviceId: string
  private serviceName: string
  private servicePort: number
  private serviceAddress: string
  private serviceTags: string[]
  private checkInterval: string
  private checkProtocol: string
  private checkRouter: string
  private checkTimeout: string
  private checkMaxRetry: number
  private checkRetryInterval: string

  constructor(consul: Consul, config: ConfigService) {
    this.consul = consul
    this.serviceName = config.get('service.name')
    this.servicePort = parseInt(config.get('service.port'), 10)
    this.serviceAddress = config.get('service.address', getIPAddress())
    this.serviceId = MD5(
      `${this.serviceName}:${this.serviceAddress}:${this.servicePort}`
    ).toString()
    this.serviceTags = config.get('service.tags', ['user'])

    this.checkInterval = config.get('consul.check.interval', '10s')
    this.checkProtocol = config.get('consul.check.protocol', 'http')
    this.checkRouter = config.get('consul.check.router', '/health')
    this.checkTimeout = config.get('consul.check.timeout', '3s')
    this.checkMaxRetry = config.get('consul.check.maxRetry', 5)
    this.checkRetryInterval = config.get('consul.check.retryInterval', '5s')
  }

  /**
   * 生成配置信息
   */
  private generateRegisterOption() {
    const checkRouterPath = `${this.checkProtocol}://${this.serviceAddress}:${this.servicePort}${this.checkRouter}`
    const check = {
      http: checkRouterPath,
      interval: this.checkInterval,
      timeout: this.checkTimeout,
      maxRetry: this.checkMaxRetry,
      retryInterval: this.checkRetryInterval
    }

    return {
      id: this.serviceId,
      name: this.serviceName,
      address: this.serviceAddress,
      port: this.servicePort,
      tags: this.serviceTags,
      check
    }
  }

  public register() {
    const registerOption = this.generateRegisterOption()
    this.consul.agent.service.register(registerOption)
  }
}
