FROM node:18
WORKDIR /usr/src/app
COPY . .
RUN npm install
# Magic ENV variables START
ENV ESLINT_NO_DEV_ERRORS=true
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true 
ENV REACT_APP_BACKEND_URL=http://localhost:3003
# END
CMD ["npm", "start"]