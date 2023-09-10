import { z } from 'zod';

const schema = z.object({
  // General Config
  VITE_NODE_ENV: customStringValidation('VITE_NODE_ENV'),
  // Backend Server Config
  VITE_BACKEND_HOST: customStringValidation('VITE_BACKEND_HOST'),
  VITE_BACKEND_PORT: customNumberValidation('VITE_BACKEND_PORT'),
});

const validatedEnv = schema.safeParse(import.meta.env);

if (validatedEnv.success === false) {
  throw new Error(validatedEnv.error.errors[0].message);
}

export const env = validatedEnv.data;

function customStringValidation(envVarName: string) {
  return z.string({ required_error: `${envVarName} is required` }).min(1);
}

function customNumberValidation(envVarName: string) {
  return z.preprocess(
    (input) => {
      if (typeof input === 'string' && input.length < 1) return input;
      const processed = z.string().regex(/^\d+$/).transform(Number).safeParse(input);
      return processed.success ? processed.data : input;
    },
    z
      .number({
        required_error: `${envVarName} is required`,
        invalid_type_error: `${envVarName} must be of type number`,
      })
      .min(0, { message: `${envVarName} must be greater than 0` })
      .max(65535, { message: `${envVarName} must be less than 65536` }),
  );
}
