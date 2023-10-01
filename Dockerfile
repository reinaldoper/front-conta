FROM node:16.14-alpine
WORKDIR /loja-frontend
COPY package.json .
#COPY package-lock.json .
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm","run","dev"]