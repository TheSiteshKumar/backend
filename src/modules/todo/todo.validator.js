import { z } from "zod";

const validate = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.boolean().default(true),
});

export default validate;