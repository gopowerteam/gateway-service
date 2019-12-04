import { All, Controller, Param, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { ProxyService } from 'src/services/proxy.service'
import { GatewayService } from 'src/services/gateway.service'

@Controller('/:service')
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly proxyService: ProxyService
  ) {}

  @All()
  do(@Req() req: Request, @Res() res: Response, @Param('service') serviceName) {
    const service = this.gatewayService.findService(serviceName)
    if (service) {
      this.proxyService.forward(req, res, service)
    }
  }
}
