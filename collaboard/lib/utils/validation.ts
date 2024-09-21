import { z } from "zod";

/**
 * Validates form data against a provided Zod schema.
 *
 * @param schema - The Zod schema to validate the form data against.
 * @param formData - The form data to validate, adhering to the schema's shape.
 * @returns An object containing:
 *   - `errors`: An object with field-specific error messages if validation fails.
 *   - `data`: The validated form data if validation succeeds, or `null` if validation fails.
 */
export const validateFormData = <T extends z.ZodTypeAny>(
  schema: T,
  formData: z.infer<T>
) => {
  const validation = schema.safeParse(formData);

  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    return { errors, data: null };
  }

  return { errors: null, data: validation.data };
};
