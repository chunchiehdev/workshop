import React from "react";
import {
  useForm,
  FormProvider,
  UseFormProps,
  UseFormReturn,
  FieldValues,
  SubmitHandler,
  UseFormSetValue,
  UseFormGetValues,
  UseFormReset,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Props for the Form component
interface FormProps<TFormValues extends FieldValues> {
  /** Default values for the form */
  defaultValues: UseFormProps<TFormValues>["defaultValues"];
  
  /** The form validation schema using Zod */
  schema: z.ZodType<TFormValues>;

  /** Function to execute when the form is submitted and validation passes */
  onSubmit: SubmitHandler<TFormValues>;

  /** Form elements to render */
  children: React.ReactNode | ((methods: UseFormMethods<TFormValues>) => React.ReactNode);

  /** Additional form options */
  formOptions?: UseFormProps<TFormValues>;
  
  /** Additional props for the form element */
  formProps?: React.FormHTMLAttributes<HTMLFormElement>;
}

// Subset of form methods that we want to expose
export interface UseFormMethods<TFormValues extends FieldValues> {
  setValue: UseFormSetValue<TFormValues>;
  getValues: UseFormGetValues<TFormValues>;
  reset: UseFormReset<TFormValues>;
  formState: UseFormReturn<TFormValues>["formState"];
}

/**
 * A wrapper component for React Hook Form that simplifies form handling and validation with Zod
 */
export function Form<TFormValues extends FieldValues>({
  defaultValues,
  schema,
  onSubmit,
  children,
  formOptions,
  formProps,
}: FormProps<TFormValues>) {
  const methods = useForm<TFormValues>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: "onChange",
    ...formOptions,
  });

  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        noValidate 
        {...formProps}
      >
        {typeof children === "function" 
          ? children({
              setValue: methods.setValue,
              getValues: methods.getValues,
              reset: methods.reset,
              formState: methods.formState,
            })
          : children}
      </form>
    </FormProvider>
  );
}

/**
 * React Hook Form field components with TypeScript support
 */

// Props for FormField
interface FormFieldProps {
  /** Field name */
  name: string;
  
  /** Child components */
  children: React.ReactNode;
}

/**
 * Form field component for accessing field context
 */
export function FormField({ name, children }: FormFieldProps) {
  return (
    <FormFieldProvider name={name}>
      {children}
    </FormFieldProvider>
  );
}

// Context provider component
interface FormFieldContextValue {
  name: string;
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

function FormFieldProvider({ name, children }: FormFieldProps) {
  const value = React.useMemo(() => ({ name }), [name]);
  return (
    <FormFieldContext.Provider value={value}>
      {children}
    </FormFieldContext.Provider>
  );
}

/**
 * Hook to use form field context
 * Provides access to the field name and form methods
 */
export function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const formContext = useFormContext();
  
  if (!fieldContext) {
    throw new Error("useFormField must be used within a FormField");
  }
  
  if (!formContext) {
    throw new Error("useFormField must be used within a Form");
  }
  
  const { name } = fieldContext;
  
  return {
    name,
    formState: formContext.formState,
    field: formContext.register(name),
    fieldState: formContext.getFieldState(name, formContext.formState),
    setValue: formContext.setValue,
    getValues: formContext.getValues,
    clearErrors: formContext.clearErrors,
  };
} 