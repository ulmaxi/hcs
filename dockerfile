FROM node:12-alpine3.11

ENV NODE_ENV=production

RUN npm install ts-node -g

COPY package.json ulmax/package.json

WORKDIR /ulmax

RUN yarn install --production

COPY . .

EXPOSE 3000

ENV NODE_ENV=docker

ENTRYPOINT ["ts-node", "-r", "tsconfig-paths/register" ]
