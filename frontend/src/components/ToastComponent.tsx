import { Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";

interface ToastComponentProps {
  isSuccess: boolean;
  message: string;
}

export const ToastComponent: React.FC<ToastComponentProps> = ({ isSuccess, message }) => {
  return (
    <Toast>
      <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isSuccess ? 'dark:bg-green-800 dark:text-green-200' : 'dark:bg-red-800 dark:text-red-200'}`}>
        {isSuccess ? <HiCheck className="h-5 w-5" /> : <HiX className="h-5 w-5" />}
      </div>
      <div className="ml-3 text-sm font-normal">
        {message}
      </div>
      <Toast.Toggle />
    </Toast>
  )
}
