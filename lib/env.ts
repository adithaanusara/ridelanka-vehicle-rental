import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  PAYMENT_PROVIDER: z.enum(["mock"]).default("mock"),
  CRON_SECRET: z.string().min(20),
});

export const env = () => schema.parse(process.env);
