# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install --only=production
CMD ["node", "-r", "reflect-metadata", "dist/src/main.js"]