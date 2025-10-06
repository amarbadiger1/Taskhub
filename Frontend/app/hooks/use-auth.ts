import { useMutation } from "@tanstack/react-query"
import { postData } from "~/lib/fetch-util";
import type { SignupFormData } from "~/routes/auth/SignUp";

export const useSignUpMutation = () => {
    return useMutation({
        mutationFn:(data:SignupFormData)=>postData("/auth/register",data),
        });
    };