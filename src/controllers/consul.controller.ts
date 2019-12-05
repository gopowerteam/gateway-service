import { All, Controller, Param, Req, Res, Get } from '@nestjs/common'
import { Request, Response } from 'express'
import { ProxyService } from 'src/services/proxy.service'
import { GatewayService } from 'src/services/gateway.service'
import { ConsulService } from 'src/modules/consul/services/consul.service'
import Consul = require('consul')

@Controller('/consul')
export class ConsulController {
  private readonly consul: Consul.Consul

  constructor(private readonly gatewayService: GatewayService) {}

  @Get('reset')
  async resetServiceList() {
    await this.gatewayService.resetServiceList()
    return '重置成功'
  }

  @Get('clear')
  async clearServiceList() {
    await this.gatewayService.clearServiceList()
    return '清理成功'
  }
}
