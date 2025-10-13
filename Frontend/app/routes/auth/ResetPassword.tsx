import React, { useState } from 'react'
import { resetPasswordSchema} from '~/lib/schema'
import {z} from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { useResetPasswordMutation } from '~/hooks/use-auth';
import { toast } from 'sonner';


type ResetPasswordFormData=z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {

  const [searchParams]=useSearchParams();
  const token =searchParams.get("token");

  const [isSuccess,setIsSuccess]=useState(false);

  const {mutate:resetPassword,isPending}=useResetPasswordMutation();


  const form=useForm<ResetPasswordFormData>({
    resolver:zodResolver(resetPasswordSchema),
    defaultValues:{
      newPassword:"",
      confirmPassword:"",
    }
  });

  const onSumbit=(values:ResetPasswordFormData)=>{
    if(!token){
      toast.error("Invaild Token");
      return;
    }

    resetPassword({...values,token:token as string},
    {
        onSuccess:()=>{
          setIsSuccess(true);
        },
        onError:(error:any)=>{
          const errorMessage=error.response?.data?.message;
          toast.error(errorMessage);
          console.log(error);
        },
      });
  };


  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='w-full max-w-md space-y-6'>
        <div className='flex flex-col items-center justify-center space-y-2'>
          <h1 className='text-2xl font-bold'>Reset Password</h1>
          <p className='text-muted-foreground'>Enter your password below</p>
        </div>
        <Card>
          <CardHeader>
            <Link to="/signin" className='flex items-center gap-2'>
            <ArrowLeft className='w-4 h-4'/>
            <span>Back to sign in</span>
            </Link>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className='flex flex-col items-center justify-center'>
                <CheckCircle className='w-10 h-10 text-green-500' />
                <h1 className='text-2xl font-bold'>
                  Password reset successfully
                </h1>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSumbit)} className='space-y-6'>
                   <FormField 
                      name="newPassword"
                      control={form.control}
                      render={({field})=>(
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='Enter your new password' />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                      />

                      <FormField 
                      name="confirmPassword"
                      control={form.control}
                      render={({field})=>(
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='Enter your confirm Password' />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                      />

                      <Button type="submit" className='w-full' disabled={isPending}>
                      {isPending ? (
                        <Loader2 className='w-4 h-4 animate-spin'/> 
                      ):( 
                        "Reset Password"
                      )}
                      </Button>


                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ResetPassword