# Base image. Alpine 6 times smaller than just node
FROM node:alpine

RUN npm install -g ts-node

# Create and set working directory
WORKDIR /app/server

# Add `/usr/src/app/server/node_modules/.bin` to $PATH
# To tell our container's shell where to look for executables (nodemon in our case)
ENV PATH /app/server/node_modules/.bin:$PATH

COPY ./ /app/server/

RUN yarn install

