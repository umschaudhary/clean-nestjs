FROM node:18-slim as base

RUN apt-get update
RUN apt-get install -y openssl
RUN apt-get install -y --no-install-recommends postgresql-client
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*


WORKDIR /src
COPY package*.json /

RUN npm install
COPY . /
EXPOSE 3000

FROm base as dev
CMD ["npm", "run", "start:dev"]

FROM base as production
RUN npm run build
CMD ["node", "dist/main"]
