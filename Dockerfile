FROM node:alpine
WORKDIR /usr/src/server
COPY . .
RUN npm install
CMD ["npm", "start"]
