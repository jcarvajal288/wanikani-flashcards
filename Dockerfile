FROM node:23-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
USER node
RUN npm install --force
COPY --chown=node:node . .
EXPOSE 5173
CMD [ "npm", "run", "host" ]
