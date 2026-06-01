const { z } = require("zod");

const updateProfileSchema = z
  .object({
    name:     z.string().min(2, "Name must be at least 2 characters").optional(),
    email:    z.string().email("Invalid email address").optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

module.exports = { updateProfileSchema };
