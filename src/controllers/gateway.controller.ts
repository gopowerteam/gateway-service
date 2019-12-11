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

  /**
   * api服务网关
   * @param req 
   * @param res 
   * @param serviceName 
   */
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
      res.end('API SERVICE NOT FOUND')
    }
  }

  /**
   * web服务网关
   * @param req 
   * @param res 
   * @param serviceName 
   */
  @All('/web/:service')
  webProxy(
    @Req() req: Request,
    @Res() res: Response,
    @Param('service') serviceName
  ) {
    const service = this.gatewayService.findWebService(serviceName)

    if (service) {
      this.proxyService.forward(req, res, service)
    } else {
      res.end('WEB SERVICE NOT FOUND')
    }
  }

  /**
   * 默认服务网关
   * @param req 
   * @param res 
   */
  @All()
  doProxy(@Req() req: Request, @Res() res: Response) {
    const service = this.gatewayService.findDefaultService()

    if (service) {
      this.proxyService.forward(req, res, service)
    } else {
      res.end('DEFAULT SERVICE NOT FOUND')
    }
  }
}
