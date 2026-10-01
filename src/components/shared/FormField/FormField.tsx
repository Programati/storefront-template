import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'

export interface FieldControlProps {
  id: string
  'aria-invalid'?: true
  'aria-describedby'?: string
}

interface FormFieldProps {
  id: string
  label: string
  error?: string
  optional?: boolean
  children: (control: FieldControlProps) => ReactNode
}

export function FormField({
  id,
  label,
  error,
  optional,
  children,
}: FormFieldProps) {
  const errorId = `${id}-error`

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {optional && (
          <span className="font-normal text-muted-foreground"> (opcional)</span>
        )}
      </Label>
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
      })}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
