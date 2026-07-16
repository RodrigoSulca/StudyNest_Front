interface AlertProps {
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
}

const styles = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
};

export function Alert({ type, message, onClose }: AlertProps) {
  return (
    <div className={`rounded-lg border p-4 ${styles[type]}`} role="alert">
      <div className="flex items-start justify-between">
        <p className="text-sm">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 text-current opacity-50 hover:opacity-100"
            aria-label="Dismiss"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
}
