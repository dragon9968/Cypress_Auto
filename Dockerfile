FROM node:16.13.0-slim as build_image

WORKDIR /bc

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:latest

# Self signed certs for SSL connection
ADD ./conf/nginx/certs/nginx-selfsigned.crt /etc/ssl/certs/nginx-selfsigned.crt
ADD ./conf/nginx/certs/nginx-selfsigned.key /etc/ssl/private/nginx-selfsigned.key
ADD ./conf/nginx/certs/dhparam.pem /etc/ssl/certs/dhparam.pem

# Config files
ADD ./conf/nginx/self-signed.conf /etc/nginx/snippets/self-signed.conf
ADD ./conf/nginx/ssl-params.conf /etc/nginx/snippets/ssl-params.conf

COPY --from=build_image /bc/dist/keromatsu-angular /usr/share/nginx/html
COPY conf/nginx/default.conf  /etc/nginx/conf.d/default.conf

EXPOSE 4200