"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { useForgotPasswordMutation } from "~/hooks/use-auth";
import { forgotPasswordSchema } from "~/lib/schema";

type ForgetPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgetPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate: forgotPassword, isPending } = useForgotPasswordMutation();

  const form = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ForgetPasswordFormData) => {
    forgotPassword(data, {
      onSuccess: () => setIsSuccess(true),
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message || "Something went wrong.";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 p-4">
      {/* Animated background blobs */}
      <motion.div
        className="absolute w-72 h-72 bg-blue-400/30 rounded-full blur-3xl top-10 left-10"
        animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-indigo-400/30 rounded-full blur-3xl bottom-10 right-10"
        animate={{ x: [0, -30, 30, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Animated Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-md"
      >
        <Card className="p-6 shadow-lg border border-gray-200 dark:border-gray-700 rounded-2xl backdrop-blur-md bg-white/80 dark:bg-gray-900/60">
          <CardHeader className="space-y-1 text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Forgot Password
              </CardTitle>
            </motion.div>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Enter your email to reset your password
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Link
              to="/signin"
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-green-500" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Password Reset Email Sent
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Check your email for a link to reset your password.
                </p>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="you@example.com"
                            className="rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full py-6 text-lg rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="absolute bottom-4 text-xs text-gray-400 dark:text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        © {new Date().getFullYear()} TaskHub. All rights reserved.
      </motion.footer>
    </div>
  );
};

export default ForgetPassword;
