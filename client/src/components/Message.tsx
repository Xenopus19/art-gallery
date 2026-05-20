import { useAppSelector } from "../store/hooks";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { AlertTriangleIcon, InfoIcon } from "lucide-react";

const Message = () => {
  const { message, details, isError } = useAppSelector((state) => state.message)

  console.log(message)
  if (message === "") return;

  return (
    <Alert className="mt-2 mb-2" variant={isError ? 'destructive' : 'default'}>
        {isError ? <AlertTriangleIcon/> : <InfoIcon/>}
      <AlertTitle>{message}</AlertTitle>
      <AlertDescription>
        {details}
      </AlertDescription>
    </Alert>
  );
};

export default Message;
