
FROM node:24

WORKDIR /usr/src/app

COPY library-frontend/package*.json ./

RUN npm ci

COPY library-frontend/ ./

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
