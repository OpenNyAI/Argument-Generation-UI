FROM node:latest as build
WORKDIR /app

COPY package*.json ./
RUN yarn install
COPY . .

RUN yarn build

FROM nginx:alpine
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]