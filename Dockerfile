# Build Stage
FROM node:20 AS build-stage

ENV BACKEND_DOMAIN="api.marketing-bs.de"
ENV FRONTEND_DOMAIN="admin.marketing-bs.de"
ENV SCREENS_DOMAIN="screens.marketing-bs.de"
ENV WEBSITE_DOMAIN="marketing-bs.de"
ENV BASE_PROTOCOL="https://"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production Stage
FROM node:20-alpine AS production-stage

WORKDIR /app

COPY --from=build-stage /app/.output ./.output
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/package*.json ./

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]