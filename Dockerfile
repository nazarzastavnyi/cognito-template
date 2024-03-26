FROM node:lts as builder

# Create app directory
WORKDIR /usr/src/app

ARG APP_PORT=3000

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

RUN rm -f .npmrc

COPY . .

RUN pnpm run build

EXPOSE ${APP_PORT}
CMD ["bash", "./start.sh"]