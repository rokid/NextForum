FROM node:latest
RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY package.json   /opt/app/
RUN  npm install

COPY .postcssrc.js  /opt/app/
COPY yarn.lock      /opt/app/
COPY index.html     /opt/app/

COPY src            /opt/app/src
COPY build          /opt/app/build
COPY config         /opt/app/config
COPY static         /opt/app/static

EXPOSE 8080
CMD [ "npm", "start" ]
