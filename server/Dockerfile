# Express Dockerfile
FROM node:18-alpine as build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json yarn.lock* ./

COPY prisma ./prisma/

RUN yarn install && npx prisma generate && yarn cache clean

# Bundle app source
FROM node:18-alpine

COPY --from=build /usr/src/app /

COPY . .

EXPOSE 5000

CMD [ "yarn", "start" ]