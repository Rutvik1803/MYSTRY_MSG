'use client';
import { use, useCallback, useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { MessageCard } from '@/components/MessageCard';
import { IMessage } from '@/model/User';
import { set } from 'mongoose';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

const page = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    // delete message
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messageId)
    );
  };
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch accept messages',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMesages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages((response.data.messages as IMessage[]) || []);
        if (refresh) {
          toast({
            title: 'Messages refreshed',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  //handle switch change
  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update accept messages',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMesages();
    fetchAcceptMessages();
  }, [session, setValue, fetchMesages, fetchAcceptMessages]);

  return (
    <>
      {/* <MessageCard /> */}
      Dashboard
    </>
  );
};

export default page;
