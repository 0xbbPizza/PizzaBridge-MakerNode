FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN apk update && apk add bash
EXPOSE 3000 
# DAI: 3000   USDC: 3001    ETH: 3002