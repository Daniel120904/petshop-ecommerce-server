# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile
COPY . .
RUN npx prisma generate
RUN yarn build


# Production stage
FROM node:20-alpine
WORKDIR /app

COPY package.json yarn.lock* ./
COPY prisma ./prisma

# Instala deps de produção E limpa o cache do yarn na MESMA camada
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Gera o Prisma Client já com o schema correto presente
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 3001
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]