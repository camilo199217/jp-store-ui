# ─── Stage 1: Builder ─────────────────────────────────────────────────────────
# Compilo el proyecto Vue con Vite y genero los archivos estáticos en /app/dist
FROM node:22-alpine AS builder

# Instalo pnpm globalmente — el proyecto usa pnpm como gestor de paquetes
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copio manifiestos primero para aprovechar la caché de capas de Docker:
# si package.json y pnpm-lock.yaml no cambian, no reinstalo dependencias
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Copio el resto del código fuente
COPY . .

# Variables de entorno para el build de producción
# Deben pasarse como build args en el CI/CD
ARG VITE_API_URL
ARG VITE_WOMPI_PUBLIC_KEY
ARG VITE_WOMPI_API_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WOMPI_PUBLIC_KEY=$VITE_WOMPI_PUBLIC_KEY
ENV VITE_WOMPI_API_URL=$VITE_WOMPI_API_URL

RUN pnpm build


# ─── Stage 2: Production ──────────────────────────────────────────────────────
# Sirvo los archivos estáticos con Nginx — imagen muy ligera
FROM nginx:1.27-alpine AS production

# Copio la build desde el stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración de Nginx para SPA:
# - Todas las rutas que no sean archivos estáticos redirigen a index.html
# - Activo gzip para mejor performance
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Puerto de exposición de Nginx
EXPOSE 80

# Healthcheck para que el orquestador sepa si el contenedor está listo
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
