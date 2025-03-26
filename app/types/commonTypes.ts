export type BaseInputProps = {
  label: string;
  value: string;
  name?: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
};

export type TextAreaProps = BaseInputProps & {
  rows?: number;
};

export type FormActionsProps = {
  onCancel?: () => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
  submitText?: string;
  cancelText?: string;
  loadingText?: string;
  entityName?: string;
};

export type SelectProps<T> = Omit<BaseInputProps, 'value' | 'onChange'> & {
  value: T | '';
  onChange: (value: T | '') => void;
  options: readonly T[] | T[];
  placeholder?: string;
  labelFn?: (option: T) => string;
};
