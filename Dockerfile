FROM node:latest
RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY .postcssrc.js  /opt/app/
COPY yarn.lock      /opt/app/
COPY index.html     /opt/app/
COPY package.json   /opt/app/
COPY src            /opt/app/
COPY build          /opt/app/
COPY config         /opt/app/
COPY static         /opt/app/

RUN npm install
EXPOSE 8080
CMD [ "npm", "start" ]