import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useStoreConfig } from '@/app/store'
import { useCart, useCartLineViews } from '@/features/cart'
import { copyToClipboard } from '@/lib/clipboard'
import { buildOrder, toOrderLines } from './buildOrder'
import { prepareOrderMessage } from './prepareOrderMessage'
import type { CheckoutField, CheckoutFormValues } from './types'
import { FIELD_ORDER, todayLocalISO, validateCheckout } from './validation'

export function useCheckoutForm() {
  const config = useStoreConfig()
  const cart = useCart()
  const views = useCartLineViews()
  const navigate = useNavigate()

  const [values, setValues] = useState<CheckoutFormValues>(() => ({
    name: '',
    deliveryMethodId: config.deliveryMethods[0]?.id ?? '',
    address: '',
    date: '',
    time: '',
    notes: '',
  }))
  const [showErrors, setShowErrors] = useState(false)
  const [sent, setSent] = useState(false)

  const today = todayLocalISO()
  // Los errores se DERIVAN de los valores (sin efectos ni estado duplicado);
  // recién se muestran después del primer intento de envío.
  const errors = useMemo(
    () => validateCheckout(values, config.deliveryMethods, today),
    [values, config.deliveryMethods, today],
  )
  const lines = useMemo(() => toOrderLines(views), [views])

  function setField(field: CheckoutField, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  // Devuelve el primer campo inválido (para darle el foco) o null si el pedido salió.
  function submit(): CheckoutField | null {
    setShowErrors(true)
    const firstInvalid = FIELD_ORDER.find((field) => errors[field])
    if (firstInvalid) return firstInvalid

    const order = buildOrder({
      values,
      views,
      totals: cart.totals,
      deliveryMethods: config.deliveryMethods,
      storeName: config.storeName,
    })
    const { message, url, includesMessage } = prepareOrderMessage(order, config)

    // Plan B: si el mensaje no entra en el enlace, lo copiamos para que el cliente lo pegue.
    // Va ANTES de abrir WhatsApp: el portapapeles exige que haya un gesto del usuario en curso.
    if (!includesMessage) void copyToClipboard(message)
    window.open(url, '_blank', 'noopener,noreferrer')

    setSent(true) // evita que el checkout muestre "pedido vacío" mientras se navega
    cart.clear()
    // replace: "atrás" desde /gracias no vuelve al formulario con un carrito vacío.
    navigate('/gracias', { replace: true, state: { order } })
    return null
  }

  return {
    values,
    errors: showErrors ? errors : {},
    setField,
    submit,
    sent,
    today,
    lines,
  }
}
