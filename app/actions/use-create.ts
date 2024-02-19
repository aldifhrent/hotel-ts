
import { axiosInstance } from "@/lib/axios";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { toast } from "sonner";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const response: AxiosResponse<User> = await axiosInstance.post(
        `/api/beasiswa`,
        body,
      );
      return response.data;
    },
    onError: (error) => {
      console.error("Error creating customer:", error);
      toast.error(error.message);
    },
  });
};
