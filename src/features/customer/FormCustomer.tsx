"use client";

import { FormSchema } from "@/utils/interface";
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
      className="max-w-lg mx-auto space-y-6 shadow-lg p-6 bg-white rounded-md"
    >
      {schema.fields.map((field) => (
        <div className="flex flex-col space-y-2" key={field.key}>
          <Label htmlFor={field.key} className="font-semibold text-gray-700">
            {field.label}
          </Label>

          <Input
            type={field.type}
            {...schema.form.register(field.key as Path<T>, {
              required: field.required,
            })}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      <Button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        登録
      </Button>
    </form>
  );
};

export default FormCustomer;
