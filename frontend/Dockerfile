### Stage 1 – build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Vite bakes env vars at build time; pass them as build args
ARG VITE_API_BASE_URL=http://localhost:5000
ARG VITE_APP_ENV=production
ARG VITE_ENABLE_MOCK_ACTIONS=false

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_ENABLE_MOCK_ACTIONS=$VITE_ENABLE_MOCK_ACTIONS

COPY . .
RUN npm run build

### Stage 2 – serve
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5000

CMD ["nginx", "-g", "daemon off;"]
