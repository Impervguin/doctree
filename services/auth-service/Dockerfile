FROM node:24

RUN mkdir -p /usr/packages/shared
COPY ./packages/shared/ /usr/packages/shared/
WORKDIR /usr/packages/shared
RUN npm install
RUN npm run build

WORKDIR /usr/src/app

COPY ./services/auth-service/package*.json ./
RUN npm install

COPY ./services/auth-service/ ./

RUN npm run build

CMD ["npm", "run", "start:prod"]