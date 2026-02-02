import React from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path, FieldErrors } from "react-hook-form";

interface FormFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  render: (field: {
    value: any;
    onChange: (...event: any[]) => void;
    onBlur: () => void;
    name: string;
  }) => React.ReactElement;
}

function getNestedError(errors: FieldErrors<any>, path: string): string | undefined {
  const parts = path.split('.');
  let current: any = errors;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  return current?.message as string | undefined;
}

export function FormField<TFieldValues extends FieldValues>({
  name,
  control,
  errors,
  render,
}: FormFieldProps<TFieldValues>) {
  const error = getNestedError(errors, name);

  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const inputElement = render(field);
          return React.cloneElement(inputElement, {
            ...inputElement.props,
            error,
          });
        }}
      />
    </div>
  );
}

