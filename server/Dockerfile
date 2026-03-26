FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies including Prisma
COPY package*.json ./
RUN npm ci

# Copiar os arquivos principais
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expor a porta que o Fastify usa
EXPOSE 3006

# Start the server (usando tsx ou rodando o build antes)
# Aqui, para produção, o ideal é compilar, mas tsx watch também funciona se mantido `npm run dev`
# Se quisermos produção pura: "npm run build" e "npm start"
# Mas considerando a estrutura existente, usaremos tsc:
RUN npm run build
CMD ["npm", "start"]
