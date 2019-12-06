FROM node:12.3.1-slim

ADD . /usr/opt/gateway-service/

WORKDIR /usr/opt/gateway-service

RUN yarn config set registry https://registry.npm.taobao.org/ \
  && yarn \
  && npm run build \
  && rm -rf src test

ENTRYPOINT [ "node", "dist/main" ]

EXPOSE 3000




