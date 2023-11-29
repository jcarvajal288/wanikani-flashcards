FROM node:21-alpine3.18
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node . .
USER node
RUN npm install
EXPOSE 3001
CMD [ "npm", "start" ]
