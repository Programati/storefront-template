// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { DemoNotice } from './DemoNotice'

afterEach(cleanup)

describe('DemoNotice', () => {
  it('muestra el mensaje recibido', () => {
    render(<DemoNotice message="Vista de demostración" />)
    expect(screen.getByRole('note').textContent).toBe('Vista de demostración')
  })
})
