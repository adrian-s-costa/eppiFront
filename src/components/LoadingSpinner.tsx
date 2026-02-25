interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = "Carregando..." }: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-[#8609A3] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  );
}
