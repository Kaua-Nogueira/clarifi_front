FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=https://api.clarifi.nogs.systems/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

FROM node:22-alpine AS runtime

ENV NODE_ENV=production

RUN npm install --global serve@14.2.5

WORKDIR /app

COPY --from=build --chown=node:node /app/dist ./dist

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/ || exit 1

CMD ["serve", "--single", "--listen", "3000", "dist"]
