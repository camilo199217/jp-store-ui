/// <reference types="vite/client" />

// Tipos de las variables de entorno de Vite — agrego aquí las que usa el proyecto
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_PAYMENT_PUBLIC_KEY: string
  readonly VITE_PAYMENT_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
