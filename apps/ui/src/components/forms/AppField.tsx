"use client"

import type React from "react"
import { useFormContext } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { removeThisWhenYouNeedMe } from "@/lib/general-helpers"
import { sanitizePasswordInput, sanitizeTextInput } from "@/lib/sanitize"
import { cn } from "@/lib/styles"

import { AppFormDescription } from "./AppFormDescription"
import { AppFormLabel } from "./AppFormLabel"

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> & {
  readonly name: string
  readonly label?: React.ReactNode
  readonly endAdornment?: React.ReactNode
  readonly containerClassName?: string
  readonly fieldClassName?: string
  readonly description?: React.ReactNode
}

export function AppField({
  name,
  label,
  endAdornment,
  containerClassName,
  fieldClassName,
  description,
  ...nativeProps
}: Props) {
  removeThisWhenYouNeedMe("AppField")

  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn(containerClassName)}>
          <AppFormLabel
            fieldState={fieldState}
            label={label}
            required={nativeProps.required}
          />

          <FormControl>
            <div className="relative flex items-stretch overflow-hidden rounded-md">
              <Input
                {...field}
                {...nativeProps}
                value={field.value ?? ""}
                onChange={(event) => {
                  const value = event.target.value
                  const sanitizedValue =
                    nativeProps.type === "password"
                      ? sanitizePasswordInput(value)
                      : sanitizeTextInput(value, {
                          maxLength: nativeProps.maxLength,
                          trim: true,
                        })

                  if (nativeProps.type === "number") {
                    field.onChange(Number(sanitizedValue))
                  } else {
                    field.onChange(sanitizedValue)
                  }
                }}
                className={cn(
                  "w-full",
                  {
                    "border-red-600": fieldState.invalid,
                    "rounded-md border": !endAdornment,
                    "rounded-l-md border-y border-l": !!endAdornment,
                  },
                  fieldClassName
                )}
              />
              {endAdornment && (
                <div
                  className={cn(
                    "flex items-center rounded-r-md border bg-gray-100 px-2",
                    {
                      "border-y-red-600 border-r-red-600 text-red-600":
                        fieldState.invalid,
                      "border-gray-100": !fieldState.invalid,
                    }
                  )}
                >
                  {endAdornment}
                </div>
              )}
            </div>
          </FormControl>

          <AppFormDescription description={description} />

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
