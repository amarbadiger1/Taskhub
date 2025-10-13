import React, { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { ArrowLeft, CheckCircle, Loader, XCircle } from 'lucide-react';
import { useVerifyEmailMutation } from '~/hooks/use-auth';
import { toast } from 'sonner';
const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const [isSuccess, setIsSuccess] = React.useState(false);
  const {mutate,isPending:isVerifying}=useVerifyEmailMutation();



  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setIsSuccess(false);
    } else {
      mutate({ token }, {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (error:any) => {
          const errorMessage=error.response?.data?.message || "An error occurred";
          setIsSuccess(false);
          // console.error("Email verification failed", error);
          toast.error(errorMessage);
        }
      });
    }
  }, [searchParams]);

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-2xl font-bold'>Verify Email</h1>
      <p className='text-sm text-gray-500'>Verifying your email...</p>

      <Card className='w-full max-w-md'>
        <CardHeader>
          <Link to="/signin" className='flex items-center gap-2 text-sm text-gray-500'>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back To Signin
          </Link>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center space-y-4'>
            {isVerifying ? (<>

             <Loader className='w-16 h-16 text-blue-500 animate-spin' />
              <h3 className='text-lg font-semibold'>Verifying email...</h3>
              <p className='text-sm text-gray-500'>Please wait while we verify your email.</p>
             
             </>
             ) : isSuccess ? (
              <>
                <CheckCircle className='w-16 h-16 text-green-500' />
                <h3 className='text-lg font-semibold'>Email Verified</h3>
                <p className='text-sm text-gray-500'>Your email has been successfully verified.</p>
              </>
            ) : (
              <>
                <XCircle className='w-16 h-16 text-red-500' />
                <h3 className='text-lg font-semibold'>Email Verification Failed</h3>
                <p className='text-sm text-gray-500'>Your email could not be verified. Please try again.</p>
              </>
            )}
          </div>

        </CardContent>
      </Card>

    </div>
  )
}

export default VerifyEmail