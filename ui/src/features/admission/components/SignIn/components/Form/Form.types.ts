export type Values<T extends string> = Partial<Record<T, string>>
export type Errors<T extends string> = Partial<Record<T, boolean>>
export type FormProps<T extends string> = {
  values: Values<T>;
  errors: Errors<T>;
  onChange: (payload: Partial<Values<T>>) => void;
} 