import { z } from "zod";

// 🔹 Signin Schema
export const SigninSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// 🔹 Signup Schema
export const SignupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// 🔹 Forget Password Schema
export const ForgetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// 🔹 Reset Password Schema
export const ResetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// 🔹 Verify Email Schema
export const VerifyEmailSchema = z.object({
  code: z.string().length(6, "Verification code must be 6 characters"),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be 8 characters"),
  confirmPassword: z.string().min(8, "Password must be 8 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invaild email address"),
})

export const workspaceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  color: z.string().min(3, "Color must be at least 3 characters"),
  description: z.string().optional(),
})