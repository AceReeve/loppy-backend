FROM node:20

RUN npm i -g @nestjs/cli

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD ["nest", "start"]