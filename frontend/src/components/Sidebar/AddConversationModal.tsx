import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Wifi, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import Modal from "../ui/Modal";
import { conversationService } from "../../services/conversationService";
import { useSocketContext } from "../../contexts/SocketContext";

const addConversationSchema = z.object({
  connectCode: z.string().min(6, { message: "Invalid connect ID" }),
});

type FormData = z.infer<typeof addConversationSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AddConversationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { socket } = useSocketContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addConversationSchema),
    defaultValues: { connectCode: "" },
  });

  const mutation = useMutation({
    mutationFn: (connectCode: string) =>
      conversationService.checkConnectCode(connectCode),
    onSuccess: (result, variables) => {
      if (result?.success) {
        socket?.emit("conversation:request", { connectCode: variables });
        onClose();
        toast.success("Request sent!");
      } else {
        console.log(result);
        toast.error(result.error?.message ?? "Invalid connect ID");
      }
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data.connectCode);
  };

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Conversation">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label
          htmlFor="connectCode"
          className="block text-gray-700 mb-2 text-sm"
        >
          Connect ID
        </label>
        <div className="relative mb-2">
          <Wifi className="absolute inset-y-0 left-3 size-5 text-gray-400 top-1/2 -translate-y-1/2" />
          <input
            {...register("connectCode")}
            className="text-black text-sm w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        {errors.connectCode && (
          <p className="text-red-500 text-sm">{errors.connectCode.message}</p>
        )}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full flex justify-center items-center bg-sky-500 text-white py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer mt-4"
        >
          {mutation.isPending ? (
            <Loader2 className="animate-spin size-5" />
          ) : (
            "Connect"
          )}
        </button>
      </form>
    </Modal>
  );
};

export default AddConversationModal;
