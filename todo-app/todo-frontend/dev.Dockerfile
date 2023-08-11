FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN npm install
ENV REACT_APP_BACKEND_URL=http://localhost:8080/api
# Magic ENV variables START
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true 
# END
CMD ["npm", "start"]