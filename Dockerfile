# 编译阶段
FROM node:12.3.1-slim as builder

ADD . /builder/
WORKDIR /builder

RUN yarn config set registry https://registry.npm.taobao.org/ \
  && yarn \
  && npm run build \
  && rm -rf src test

# 运行阶段
FROM node:12.3.1-alpine

COPY --from=builder /builder/ /app/

EXPOSE 3000

ENTRYPOINT [ "main", "/app/dist/main" ]




