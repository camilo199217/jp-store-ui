// Test del átomo BaseBadge.
// Practica: verificar variantes visuales y la prop dot.
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseBadge from '@/components/atoms/BaseBadge.vue'

describe('BaseBadge', () => {
  it('renderiza el texto del slot', () => {
    // TODO: monta con texto "En stock" y verifica que aparezca
  })

  it('aplica las clases de variant="success"', () => {
    // TODO: verifica que el badge tenga clases de color verde
  })

  it('aplica las clases de variant="danger"', () => {
    // TODO: verifica que el badge tenga clases de color rojo
  })

  it('muestra el indicador dot cuando dot=true', () => {
    // TODO: monta con :dot="true" y verifica que el pequeño círculo exista en el DOM
  })

  it('no muestra el dot cuando dot=false (default)', () => {
    // TODO: monta sin la prop dot y verifica que el círculo NO exista
  })
})
