FROM node:16
WORKDIR /usr/src/app
COPY --chown=node:node . .
ENV MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database
ENV REDIS_URL=redis://localhost:6379
RUN npm ci 
USER node
CMD npm start