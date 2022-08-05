FROM node:18-alpine as base

WORKDIR /src
COPY package*.json /
COPY yarn.lock /

RUN yarn install
COPY . /
EXPOSE 3000

FROm base as dev
CMD ["yarn", "run", "start:dev"]

FROM base as production
RUN yarn build
CMD ["node", "dist/main"]
