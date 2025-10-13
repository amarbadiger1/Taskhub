import {z} from 'zod';

const registerSchema = z.object({
    name: z.string().min(3,"Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8,"Password must be at least 8 characters long")
});

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8,"Password must be at least 8 characters long")
});

const verifyEmailSchema = z.object({
    token: z.string().min(1, "Token is required")
});

const resetPasswordSchema=z.object({
    token:z.string().min(1,"Token is required"),
    newPassword:z.string().min(8,"Password must be at least 8 characters Long"),
    confirmPassword:z.string().min(8,"Confirm Password is required"),
})

const emailSchema=z.object({
    email:z.string().email("Invaild Email Address"),
})
export { registerSchema, loginSchema, verifyEmailSchema,resetPasswordSchema,emailSchema };