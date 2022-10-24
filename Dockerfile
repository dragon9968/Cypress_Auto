FROM node:16.13.0-slim as build_image

WORKDIR /bc

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:latest

COPY --from=build_image /bc/dist/keromatsu-angular /usr/share/nginx/html
COPY conf/nginx/default.conf  /etc/nginx/conf.d/default.conf

EXPOSE 4200