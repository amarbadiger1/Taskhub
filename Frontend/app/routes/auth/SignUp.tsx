"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SignupSchema } from "~/lib/schema";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Link } from "react-router";
import { useSignUpMutation } from "~/hooks/use-auth";
import { toast } from "sonner";

export type SignupFormData = z.infer<typeof SignupSchema>;

const SignUp = () => {
  const form = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate,isPending } = useSignUpMutation();

  const handleOnSubmit = (values: SignupFormData) => {
    // console.log("✅ Signup Submitted:", values);
    mutate(values,{
      onSuccess:(data)=>{
        toast.success("User registered successfully");
      },
      onError:(error:any)=>{
        const errorMessage=error.response?.data?.message || "An error occurred";
        console.log("❌ Signup Error:", error);
        toast.error(errorMessage);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-muted/40 p-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Sign up to get started</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-4">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <Link to="/signin" className="hover:underline">
            Already have an account? Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
