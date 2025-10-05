# Estagio 1: Instala todas as dependências
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Estagio 2: Desenvolvimento
FROM base AS development
COPY . .
CMD ["npm", "run", "start:dev"]

# Estagio 3: build para produção
FROM base AS builder
COPY . .
RUN npm run build

# Estagio 4: Producao - Imagem final
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 3000
CMD ["node", "dist/src/main.js"]