import { ConsulService } from 'src/modules/service/services/consul.service'
import * as HttpProxy from 'http-proxy'
import { Request, Response } from 'express'
import * as http from 'http'
import * as url from 'url'

export class ProxyService {
  private readonly proxy: HttpProxy

  constructor() {
    this.proxy = this.createProxy()
  }

  /**
   * 创建代理服务
   */
  private createProxy() {
    const proxy = HttpProxy.createProxyServer({
      prependPath: true,
      ignorePath: true
    })

    proxy.on('error', this.onProxyError)

    return proxy
  }

  /**
   * 代理异常处理
   * @param err
   * @param req
   * @param res
   * @param target
   */
  private onProxyError(
    err: Error,
    req: http.IncomingMessage,
    res: http.ServerResponse,
    target?: string | Partial<url.Url>
  ) {
    res.end(JSON.stringify(err))
    // TODO:添加服务异常处理
  }

  /**
   * 发送代理数据
   * @param req
   * @param res
   * @param service
   */
  public async forward(req: Request, res: Response, service: any) {
    const timeout = 1000 * 30
    const proxyTimeout = 1000 * 30
    // 生成代理路径
    const target = `http://${service.Address}:${service.Port}${req.url}`
    this.proxy.web(req, res, {
      target,
      timeout: Number(timeout),
      proxyTimeout: Number(proxyTimeout)
    })
  }
}
