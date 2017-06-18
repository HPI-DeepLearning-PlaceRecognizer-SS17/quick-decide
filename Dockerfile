FROM node:7
MAINTAINER torben.meyer@student.hpi.de

COPY ./ /app/
WORKDIR /app

RUN npm install
RUN /app/node_modules/bower/bin/bower install

EXPOSE 3010

ENTRYPOINT ["node", "server/index.js"]