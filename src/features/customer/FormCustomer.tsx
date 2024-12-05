"use client";

import { FormSchema } from "@/interface/interface";
import { Path } from "react-hook-form";

import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { FieldValues } from "react-hook-form";

interface FormCustomerProps<T extends FieldValues> {
  schema: FormSchema<T>;
}

const FormCustomer = <T extends FieldValues>({
  schema,
}: FormCustomerProps<T>) => {
  const submitForm = (data: T) => {
    schema.submit(data);
  };
  useEffect(() => {
    schema.setDefault();
  }, [schema.form]);

  return (
    <form
      onSubmit={schema.form.handleSubmit(submitForm)}
      className="h-full mb-10   flex-col items-center justify-center"
    >
      {schema.fields.map((field) => (
        <React.Fragment key={field.key}>
          <Label htmlFor={field.key}>{field.label}</Label>

          <Input
            {...schema.form.register(field.key as Path<T>, {
              required: field.required,
            })}
          />
        </React.Fragment>
      ))}

      <Button type="submit">登録</Button>
    </form>
  );
};

export default FormCustomer;
