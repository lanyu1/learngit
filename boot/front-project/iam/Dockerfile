FROM registry.saas.hand-china.com/tools/nginx:stable

MAINTAINER jianwu.bin@hand-china.com

RUN echo "Asia/shanghai" > /etc/timezone;
ADD dist /usr/share/nginx/html
EXPOSE 80
