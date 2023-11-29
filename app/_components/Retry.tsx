import Button from "./Button";

export default function Retry({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => any;
}) {
  return (
    <div className="bg-red-100 rounded-md p-2 flex justify-center items-center w-full h-[200px]">
      <div className="flex gap-2 flex-col items-center">
        <div className="font-medium">{message}</div>
        <Button onClick={() => onRetry()} className="flex gap-2">
          <img src="/redo-icon.svg" height={24} width={24} />
          <div>Retry</div>
        </Button>
      </div>
    </div>
  );
}
