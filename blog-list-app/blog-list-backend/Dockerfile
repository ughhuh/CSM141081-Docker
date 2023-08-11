FROM node:18
WORKDIR /usr/src/app
COPY --chown=node:node . .
ENV MONGODB_URI=mongodb+srv://user:password@clusterfs.uvlhihl.mongodb.net/phonebookEntries?retryWrites=true&w=majority
ENV PORT=3003
ENV TEST_MONGODB_URI=mongodb+srv://user:password@clusterfs.uvlhihl.mongodb.net/testEntries?retryWrites=true&w=majority
ENV SECRET=morebloodforthebloodgod
RUN npm ci
ENV CI=true
RUN npm test
USER node
CMD npm start