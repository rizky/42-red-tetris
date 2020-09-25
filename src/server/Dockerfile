# Base image. Alpine 6 times smaller than just node
FROM node:alpine

# Static server
RUN npm install -g serve

# Create and set working directory
WORKDIR /app/server

# Add `/usr/src/app/server/node_modules/.bin` to $PATH
# To tell our container's shell where to look for executables (nodemon in our case)
ENV PATH /app/server/node_modules/.bin:$PATH

# Install and cache app dependencies
COPY package.json package-lock.json /app/server/

RUN npm install

COPY ./ /app/server/
