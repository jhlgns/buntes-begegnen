FROM node:22-bookworm AS build-env
ARG API_BASE_ADDRESS

RUN if [ -z "$API_BASE_ADDRESS" ]; then echo "API_BASE_ADDRESS is not set!"; exit 1; fi

WORKDIR /source
ADD ./src/frontend ./frontend
ADD ./src/api-client ./api-client

WORKDIR /source/api-client
RUN npm install

WORKDIR /source/frontend
RUN echo BUNTES_BEGEGNEN_API_BASE_ADDRESS=$API_BASE_ADDRESS > ./.env
RUN npm install -g typescript
RUN npm install
RUN npm run build


FROM nginx:1.27.1
COPY --from=build-env /source/frontend/dist /usr/share/nginx/html
# TODO: Configure single page redirection
