'use client';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { signUpSchema } from '@/schemas/signUpSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const page = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  //Zod Implementaion
  const form = useForm<z.infer<typeof signUpSchema>>({
    // z.infer<typeof signUpSchema> is the same as { username: string, email: string, password: string }
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      if (response.data.success) {
        toast({
          title: 'Success',
          description: response.data.message,
        });
      } else {
        toast({
          title: 'Error',
          description: response.data.message,
          variant: 'destructive',
        });
      }
      router.replace(`/verify/${username}`); // We will redicrect to a new page
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Error signing up',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  //Function to Check if username is available or not
  const checkUsernameUnique = async () => {
    if (username) {
      setIsCheckingUsername(true);
      setUsernameMessage('');
      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${username}`
        );
        let message = response.data.message;
        setUsernameMessage(message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data.message || 'Error checking username'
        );
      } finally {
        setIsCheckingUsername(false);
      }
    }
  };

  useEffect(() => {
    if (username) {
      checkUsernameUnique();
    } else {
      setUsernameMessage('');
    }
  }, [username]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl mb-6">
            Sign Up
          </h1>
          <p className="mb-4">Create your account</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="eg. john123"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {/* {!isCheckingUsername && (
                    <div className="message-container">
                      {usernameMessage === 'Username is unique' ? (
                        <CheckCircleIcon className="text-green-500" />
                      ) : (
                        <XCircleIcon className="text-red-500" />
                      )}
                    </div>
                  )} */}
                  <p
                    className={`text-sm ${
                      usernameMessage === 'Username is unique'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="eg. john@email.co"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="eg. password123"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              // isLoading={isSubmitting}
              disabled={usernameMessage !== 'Username is unique'}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already have an account?{' '}
            <a href="/sign-in" className="text-blue-500">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
