import { Consul } from 'consul';
import { ConfigService } from 'src/modules/config/services/config.service';
import { getIPAddress } from 'src/common/utils/os.util';
import { MD5 } from 'crypto-js';

export class ConsulService {
  private serviceId: string;
  private serviceName: string;
  private servicePort: number;
  private serviceAddress: string;
  private serviceTags: string[];

  constructor(private readonly consul: Consul, config: ConfigService) {
    this.consul = consul;
    this.serviceName = config.get('service.name');
    this.servicePort = parseInt(config.get('service.port'), 10);
    this.serviceAddress = config.get('service.address', getIPAddress());
    this.serviceId = MD5(`${this.serviceName}:${this.servicePort}`).toString();
    this.serviceTags = config.get('service.tags', ['user']);
  }

  public register() {
    this.consul.agent.service.register({
      id: this.serviceId,
      name: this.serviceName,
      address: this.serviceAddress,
      port: this.servicePort,
      tags: this.serviceTags,
    });
  }
}
