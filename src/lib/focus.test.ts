// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { releaseFocus } from './focus'

describe('releaseFocus', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('quita el foco del elemento activo', () => {
    document.body.innerHTML = '<button id="a">A</button>'
    const button = document.getElementById('a')!
    button.focus()
    expect(document.activeElement).toBe(button)

    releaseFocus()

    expect(document.activeElement).toBe(document.body)
  })

  it('no falla si no hay un elemento activo enfocable', () => {
    expect(() => releaseFocus()).not.toThrow()
  })
})
