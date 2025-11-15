# Etapa de build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build --prod

# Etapa de producción
FROM nginx:alpine

# Copiar los archivos built de Angular
COPY --from=build /app/dist/tienda-online-frontend /usr/share/nginx/html

# Configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80