FROM node:18 AS build-stage
WORKDIR /usr/src/app
COPY . .
RUN npm ci
ENV REACT_APP_BACKEND_URL=http://localhost:3003
ENV DISABLE_ESLINT_PLUGIN=true
RUN npm run build

FROM node:18 AS test-stage
WORKDIR /usr/src/app
COPY --from=build-stage /usr/src/app/ /usr/src/app/
ENV CI=true
RUN npm test

RUN npm install -g serve
CMD ["serve", "build"]