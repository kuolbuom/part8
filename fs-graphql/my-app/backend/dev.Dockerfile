
FROM node:24

WORKDIR /usr/src/app

COPY library-backend/package*.json ./

RUN npm ci

COPY library-backend/ ./

CMD ["npm", "run", "dev"]
