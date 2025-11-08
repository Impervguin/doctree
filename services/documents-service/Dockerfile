FROM node:24

RUN mkdir -p /usr/packages/shared
COPY ./packages/shared/ /usr/packages/shared/
WORKDIR /usr/packages/shared
RUN npm install
RUN npm run build

WORKDIR /usr/src/app

COPY ./services/documents-service/package*.json ./
RUN npm install

COPY ./services/documents-service/ ./

RUN npm run build

CMD ["npm", "run", "start:prod"]