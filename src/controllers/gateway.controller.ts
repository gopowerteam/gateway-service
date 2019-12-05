import { All, Controller, Param, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { ProxyService } from 'src/services/proxy.service'
import { GatewayService } from 'src/services/gateway.service'

@Controller('/')
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly proxyService: ProxyService
  ) {}

  @All('/api/:service')
  apiProxy(
    @Req() req: Request,
    @Res() res: Response,
    @Param('service') serviceName
  ) {
    const service = this.gatewayService.findApiService(serviceName)

    if (service) {
      this.proxyService.forward(req, res, service)
    } else {
      res.end('SERVICE NOT FOUND')
    }
  }

  @All()
  doProxy(@Req() req: Request, @Res() res: Response) {
    const service = this.gatewayService.findDefaultService()

    if (service) {
      this.proxyService.forward(req, res, service)
    } else {
      res.end('SERVICE NOT FOUND')
    }
  }
}
