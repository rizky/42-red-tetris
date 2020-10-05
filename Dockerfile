# Base image. Alpine 6 times smaller than just node
FROM node:alpine

RUN yarn global add ts-node expo-cli

# Create and set working directory
WORKDIR /app/red-tetris

# Add `/usr/src/app/red-tetris/node_modules/.bin` to $PATH
# To tell our container's shell where to look for executables (nodemon in our case)
ENV PATH /app/red-tetris/node_modules/.bin:$PATH

# Install and cache app dependencies
COPY package.json yarn.lock /app/red-tetris/

RUN yarn install

