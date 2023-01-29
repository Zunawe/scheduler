FROM node:18

WORKDIR /opt/app
COPY . .
RUN npm ci
RUN npm run build

EXPOSE 8000
