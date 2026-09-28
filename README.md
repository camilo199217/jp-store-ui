# jp-store-ui

Frontend de la tienda jp-store. Vue 3 + Vite + TailwindCSS con integración al backend NestJS.

## App en producción

**https://d1ooypu8bqmie2.cloudfront.net**

## Stack

- **Vue 3** (Composition API, `<script setup>`)
- **Vuex 4** — gestión de estado (módulos: `products`, `checkout`)
- **vuex-persistedstate** + **secure-ls** — persistencia cifrada AES del estado en localStorage (resiliencia en refresh)
- **VeeValidate** — validación de formularios en tiempo real
- **vue-i18n** — internacionalización (ES)
- **TailwindCSS** — estilos
- **credit-card-type** — detección de marca de tarjeta por BIN
- **Vite** — bundler

## Estructura

```
src/
├── components/
│   ├── atoms/          # BaseInput, BaseButton, logos de marcas
│   ├── molecules/      # CreditCardVisual, ToastNotification
│   └── organisms/      # CheckoutForm, DevDrawer
├── composables/
│   └── useCardDetection.ts   # Detección de marca en tiempo real
├── i18n/locales/es.ts        # Todos los textos de la UI
├── router/                   # Vue Router (/, /checkout, /summary, /result)
├── store/modules/            # Vuex: products, checkout
├── types/                    # Tipos TypeScript compartidos
└── views/                    # ProductView, CheckoutView, SummaryView, ResultView
```

## Instalación local

```bash
pnpm install
```

Crea un archivo `.env.local` con:

```env
VITE_API_URL=http://localhost:3000
```

## Comandos

```bash
# Servidor de desarrollo (http://localhost:5173)
pnpm dev

# Build de producción
pnpm build

# Preview del build
pnpm preview

# Tests unitarios
pnpm test

# Tests con cobertura
pnpm test:cov
```

## Deploy a producción

```bash
# Build — VITE_API_URL apunta a CloudFront (HTTPS); el proxy /api/* reenvía al backend
VITE_API_URL=https://d1ooypu8bqmie2.cloudfront.net pnpm build

# Subir a S3
aws s3 sync dist/ s3://jp-store-frontend --delete --region us-east-1

# Invalidar caché CloudFront
aws cloudfront create-invalidation --distribution-id EY2A9FJ9FA1D7 --paths "/*"
```

## Herramienta de desarrollo (DevDrawer)

En modo `DEV` aparece un botón ámbar (beaker) en la esquina inferior derecha con datos de prueba del sandbox de Wompi: tarjetas de múltiples marcas, usuarios de diferentes ciudades y combos de un solo clic para rellenar el formulario completo.

### Tarjetas de sandbox disponibles

| Marca | Número | Resultado |
|---|---|---|
| Visa | 4242 4242 4242 4242 | APPROVED |
| Visa | 4111 1111 1111 1111 | DECLINED |
| Mastercard | 5254 1336 7443 8670 | APPROVED |
| Mastercard | 5399 2420 7311 1197 | DECLINED |
| Amex | 3782 822463 10005 | APPROVED |
| Diners | 3622 720627 1667 | APPROVED |
| Discover | 6011 1111 1111 1117 | APPROVED |

## Pruebas unitarias

Herramienta: **Vitest** (API 100% compatible con Jest)

```
Test Files  22 passed (22)
Tests      121 passed (121)
```

### Cobertura global

```
All files  | 91.41% Stmts | 81.36% Branches | 88.57% Funcs | 91.41% Lines
```

### Cobertura por módulo

| Módulo | Statements | Branches | Funciones |
|---|---|---|---|
| `components/atoms/` | 100% | 100% | 100% |
| `components/molecules/` | 100% | 100% | 100% |
| `components/organisms/` | 95.45% | 84.61% | 87.5% |
| `composables/` | 100% | 78.57% | 100% |
| `store/modules/` | 89.23% | 71.42% | 80% |
| `views/` | 84.13% | 73.07% | 84.21% |

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base del backend | `http://localhost:3000` |
