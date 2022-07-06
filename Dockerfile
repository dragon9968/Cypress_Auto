FROM node:slim as build_image

WORKDIR /bc

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:latest

COPY --from=build_image /bc/dist/keromatsu-angular /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 4200