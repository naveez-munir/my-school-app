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

export function FormField<TFieldValues extends FieldValues>({
  name,
  control,
  errors,
  render,
}: FormFieldProps<TFieldValues>) {
  const error = errors[name]?.message as string | undefined;

  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const inputElement = render(field);

          // Clone the element and inject the error prop using React.cloneElement
          return React.cloneElement(inputElement, {
            ...inputElement.props,
            error,
          });
        }}
      />
    </div>
  );
}

