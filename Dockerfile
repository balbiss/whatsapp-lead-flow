FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependências da raiz (se houver) e do frontend
COPY package*.json ./
RUN npm ci

# Copiar todo o código fonte do frontend
COPY . .

# Fazer o build de produção com a variável de ambiente correta
# Podes passar ARG VITE_API_URL na hora do build
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Servir o React App com Nginx
FROM nginx:alpine

# Copiar build gerado
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração personalizada do Nginx (para SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
