# Etapa 1: Constrói a aplicação (Build)
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Etapa 2: Serve a aplicação com Nginx (Produção)
FROM nginx:alpine

COPY --from=builder /app/dist/conta-justa /usr/share/nginx/html

# Ou use /app/build se for React padrão: COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]