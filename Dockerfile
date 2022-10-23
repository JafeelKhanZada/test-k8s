# Development Environment
FROM node:14-buster-slim as dev
RUN apt-get update && apt-get install -y iputils-ping vim nano libaio1 wget unzip postgresql-client
WORKDIR /opt/oracle

RUN wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip && \
    unzip instantclient-basiclite-linuxx64.zip && rm -f instantclient-basiclite-linuxx64.zip && \
    cd /opt/oracle/instantclient* && rm -f *jdbc* *occi* *mysql* *mql1* *ipc1* *jar uidrvci genezi adrci && \
    echo /opt/oracle/instantclient* > /etc/ld.so.conf.d/oracle-instantclient.conf && ldconfig

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

RUN npm install glob rimraf

COPY . .

RUN npm run build

EXPOSE 80

CMD ["node", "dist/main.js"]