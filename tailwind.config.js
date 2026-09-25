// Configuración de Tailwind — defino el tema visual de toda la app aquí.
// El diseño es "Noir Commerce": oscuro, elegante, con acentos en violeta y verde.
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Fondo principal oscuro — transmite confianza y premium
        surface: {
          DEFAULT: '#0D0D1A',
          card: 'rgba(255,255,255,0.05)',
          hover: 'rgba(255,255,255,0.08)',
        },
        // Acento principal violeta eléctrico
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          DEFAULT: '#7c3aed',
        },
        // Verde esmeralda para éxito y confirmación
        success: {
          400: '#34d399',
          500: '#10b981',
          DEFAULT: '#10b981',
        },
        // Rojo para errores
        danger: {
          400: '#f87171',
          500: '#ef4444',
          DEFAULT: '#ef4444',
        },
        // Ámbar para advertencias
        warning: {
          400: '#fbbf24',
          DEFAULT: '#f59e0b',
        },
        // Escala de grises para textos
        ink: {
          100: '#f8fafc',
          200: '#e2e8f0',
          400: '#94a3b8',
          600: '#475569',
          800: '#1e293b',
        },
      },
      fontFamily: {
        // Inter es la fuente premium estándar en fintech
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      // Sombras tipo glassmorphism
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.3)',
        'glass-lg': '0 8px 60px rgba(0, 0, 0, 0.5)',
        glow: '0 0 20px rgba(124, 58, 237, 0.4)',
        'glow-success': '0 0 20px rgba(16, 185, 129, 0.4)',
      },
      // Fondos glassmorphism
      backdropBlur: {
        xs: '2px',
      },
      // Animaciones personalizadas
      animation: {
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'card-flip': 'cardFlip 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 1.5s infinite',
        'bounce-subtle': 'bounceSubtle 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        cardFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.97)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(124, 58, 237, 0.7)' },
        },
      },
    },
  },
  plugins: [],
}
