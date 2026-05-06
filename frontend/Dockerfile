# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps --force

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN addgroup -S app && adduser -S app -G app
RUN chown -R app:app /usr/share/nginx/html
USER app
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
