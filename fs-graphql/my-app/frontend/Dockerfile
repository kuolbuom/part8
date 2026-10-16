
# Stage 1: Build the frontend
FROM node:24 AS build

WORKDIR /usr/src/app

COPY library-frontend/package*.json ./

RUN npm ci

COPY library-frontend/ ./

RUN npm run build

# Stage 2: Serve the production files
FROM nginx:1.29-alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
