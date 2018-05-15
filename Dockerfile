FROM node:latest
RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY server.js      /opt/app/
COPY package.json   /opt/app/

COPY .babelrc       /opt/app/
COPY .postcssrc.js  /opt/app/
COPY yarn.lock      /opt/app/
COPY index.html     /opt/app/

COPY src            /opt/app/src
COPY build          /opt/app/build
COPY config         /opt/app/config
COPY static         /opt/app/static

RUN  npm install --registry=https://registry.npm.taobao.org
RUN  npm run build

EXPOSE 8080
CMD [ "npm", "start" ]
