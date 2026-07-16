import { useState } from 'react';

interface EstrellasCalificacionProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
};

function Star({
  filled,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  filled: boolean;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  return (
    <svg
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  );
}

export function EstrellasCalificacion({
  value,
  onChange,
  size = 'md',
}: EstrellasCalificacionProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const isInteractive = typeof onChange === 'function';
  const displayValue = isInteractive && hoverValue > 0 ? hoverValue : value;

  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          filled={star <= displayValue}
          className={`${sizeClasses[size]} ${
            isInteractive
              ? star <= displayValue
                ? 'text-amber-400'
                : 'text-gray-300'
              : star <= value
                ? 'text-amber-400'
                : 'text-gray-300'
          } ${isInteractive ? 'cursor-pointer hover:text-amber-300 transition-colors' : ''}`}
          onClick={isInteractive ? () => onChange(star) : undefined}
          onMouseEnter={isInteractive ? () => setHoverValue(star) : undefined}
          onMouseLeave={isInteractive ? () => setHoverValue(0) : undefined}
        />
      ))}
    </div>
  );
}
