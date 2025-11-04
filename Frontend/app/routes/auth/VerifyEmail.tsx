"use client";

import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, Loader, XCircle } from "lucide-react";

import { useVerifyEmailMutation } from "~/hooks/use-auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "~/components/ui/card";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate, isPending: isVerifying } = useVerifyEmailMutation();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setIsSuccess(false);
    } else {
      mutate(
        { token },
        {
          onSuccess: () => {
            setIsSuccess(true);
          },
          onError: (error: any) => {
            const errorMessage =
              error.response?.data?.message || "An error occurred";
            setIsSuccess(false);
            toast.error(errorMessage);
          },
        }
      );
    }
  }, [searchParams]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 p-4">
      {/* Animated gradient blobs */}
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

      {/* Animated card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-md"
      >
        <Card className="p-6 shadow-lg border border-gray-200 dark:border-gray-700 rounded-2xl backdrop-blur-md bg-white/80 dark:bg-gray-900/60">
          <CardHeader className="text-center space-y-1">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Verify Email
              </CardTitle>
            </motion.div>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Please wait while we verify your email
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4 py-6">
              {isVerifying ? (
                <>
                  <Loader className="w-16 h-16 text-blue-500 animate-spin" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Verifying email...
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Please wait while we verify your email.
                  </p>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Email Verified
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your email has been successfully verified.
                  </p>
                  <Link
                    to="/signin"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    Go to Sign In
                  </Link>
                </>
              ) : (
                <>
                  <XCircle className="w-16 h-16 text-red-500" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Verification Failed
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    We couldn't verify your email. Please try again.
                  </p>
                </>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Link
              to="/signin"
              className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Subtle footer */}
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

export default VerifyEmail;
