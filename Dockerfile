FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN apk update && apk add bash
EXPOSE 3000
# CMD ["node", "index.js"]