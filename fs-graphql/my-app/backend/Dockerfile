
FROM node:24

WORKDIR /usr/src/app

COPY library-backend/package*.json ./

RUN npm ci --omit=dev

COPY library-backend/ ./

CMD ["npm", "start"]
