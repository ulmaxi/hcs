FROM node:12-alpine3.11

ENV NODE_ENV=production
COPY package.json package.json
RUN yarn install --production
COPY . ulmax
CMD mv node_modules ulmax/node_modules
WORKDIR /ulmax
RUN npm install -g @nestjs/cli
EXPOSE 3000
ENV NODE_ENV=docker
ENTRYPOINT ["npx", "nest", "start" ]
