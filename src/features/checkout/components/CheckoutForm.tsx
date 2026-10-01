import { MessageCircle } from 'lucide-react'
import { FormField } from '@/components/shared/FormField/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import type { DeliveryMethod, SchedulingMode } from '@/types'
import type {
  CheckoutErrors,
  CheckoutField,
  CheckoutFormValues,
} from '../types'
import { LIMITS } from '../validation'

interface CheckoutFormProps {
  values: CheckoutFormValues
  errors: CheckoutErrors
  deliveryMethods: DeliveryMethod[]
  scheduling: SchedulingMode
  minDate: string
  onChange: (field: CheckoutField, value: string) => void
  onSubmit: () => CheckoutField | null // devuelve el primer campo inválido, o null si salió bien
}

export function CheckoutForm({
  values,
  errors,
  deliveryMethods,
  scheduling,
  minDate,
  onChange,
  onSubmit,
}: CheckoutFormProps) {
  const needsAddress = deliveryMethods.find(
    (m) => m.id === values.deliveryMethodId,
  )?.requiresAddress

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const firstInvalid = onSubmit()
    if (firstInvalid)
      document.getElementById(`checkout-${firstInvalid}`)?.focus()
  }

  return (
    // noValidate: validamos nosotros, con mensajes propios, y no con los globos del navegador.
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <FormField id="checkout-name" label="Tu nombre" error={errors.name}>
        {(control) => (
          <Input
            {...control}
            value={values.name}
            maxLength={LIMITS.name}
            autoComplete="name"
            onChange={(e) => onChange('name', e.target.value)}
          />
        )}
      </FormField>

      {deliveryMethods.length > 1 && (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">¿Cómo lo recibís?</legend>
          <RadioGroup
            value={values.deliveryMethodId}
            onValueChange={(value) => onChange('deliveryMethodId', value)}
            className="gap-2"
          >
            {deliveryMethods.map((method) => (
              <Label
                key={method.id}
                htmlFor={`delivery-${method.id}`}
                className="flex cursor-pointer items-start gap-3 rounded-md border p-3 font-normal has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
              >
                <RadioGroupItem
                  id={`delivery-${method.id}`}
                  value={method.id}
                  className="mt-0.5"
                />
                <span className="flex-1">
                  {method.label}
                  {method.note && (
                    <span className="block text-sm text-muted-foreground">
                      {method.note}
                    </span>
                  )}
                </span>
              </Label>
            ))}
          </RadioGroup>
        </fieldset>
      )}

      {needsAddress && (
        <FormField
          id="checkout-address"
          label="Dirección de entrega"
          error={errors.address}
        >
          {(control) => (
            <Input
              {...control}
              value={values.address}
              maxLength={LIMITS.address}
              autoComplete="street-address"
              onChange={(e) => onChange('address', e.target.value)}
            />
          )}
        </FormField>
      )}

      {scheduling !== 'none' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="checkout-date"
            label="Fecha deseada"
            optional
            error={errors.date}
          >
            {(control) => (
              <Input
                {...control}
                type="date"
                min={minDate}
                value={values.date}
                onChange={(e) => onChange('date', e.target.value)}
              />
            )}
          </FormField>
          {scheduling === 'datetime' && (
            <FormField
              id="checkout-time"
              label="Horario"
              optional
              error={errors.time}
            >
              {(control) => (
                <Input
                  {...control}
                  type="time"
                  value={values.time}
                  onChange={(e) => onChange('time', e.target.value)}
                />
              )}
            </FormField>
          )}
        </div>
      )}

      <FormField
        id="checkout-notes"
        label="Notas"
        optional
        error={errors.notes}
      >
        {(control) => (
          <Textarea
            {...control}
            rows={3}
            maxLength={LIMITS.notes}
            placeholder="Aclaraciones para tu pedido"
            value={values.notes}
            onChange={(e) => onChange('notes', e.target.value)}
          />
        )}
      </FormField>

      <div className="space-y-2">
        <Button type="submit" size="lg" className="w-full">
          <MessageCircle className="size-4" aria-hidden="true" />
          Enviar pedido por WhatsApp
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Se abrirá WhatsApp con tu pedido listo para enviar.
        </p>
      </div>
    </form>
  )
}
