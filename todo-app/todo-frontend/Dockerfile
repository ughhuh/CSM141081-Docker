FROM node:16 AS build-stage
WORKDIR /usr/src/app
COPY . .
RUN npm ci
ENV REACT_APP_BACKEND_URL=http://localhost:8080/api/
RUN npm run build

FROM node:16 AS test-stage
WORKDIR /usr/src/app
COPY --from=build-stage /usr/src/app/ /usr/src/app/
ENV CI=true
RUN npm test

RUN npm install -g serve
CMD ["serve", "build"]