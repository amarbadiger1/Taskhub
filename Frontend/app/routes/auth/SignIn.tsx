"use client";

import React, { use } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SigninSchema } from "~/lib/schema";

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
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "~/hooks/use-auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "~/provider/auth-context";

type SigninFormData = z.infer<typeof SigninSchema>;

const Signin = () => {
  const navigate=useNavigate();
  const {login}=useAuth();
  const form = useForm<SigninFormData>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {mutate,isPending}= useLoginMutation();
  const handleOnSubmit = (values: SigninFormData) => {
    mutate(values,{
      onSuccess:(data)=>{
        login(data);
        console.log("Login successful:",data);
        toast.success("Login successful!");
        navigate('/dashboard');
        // Handle successful login, e.g., redirect or show a success message
      },
      onError:(error:any)=>{
        const errorMessage=error.response?.data?.message || "An error occurred during login.";
        console.log("Login error:",error);
        toast.error(errorMessage);
        // Handle login error, e.g., show an error message
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-muted/40 p-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-4">
              {/* Email Field */}
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

              {/* Password Field */}
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

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className=" w-4 h-4 animate-spin" /> : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <Link to="/forget-password" className="hover:underline">
            Forgot password?
          </Link>
          <Link to="/signup" className="hover:underline">
            Create account
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signin;
