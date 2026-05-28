import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, helperText, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-1.5">
        <input
          ref={ref}
          className={`h-[52px] w-full rounded-[16px] border px-4 text-[15px] font-semibold text-textMain transition-colors focus:outline-none ${
            error
              ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:bg-white'
              : 'border-transparent bg-background focus:border-primary focus:bg-white'
          } ${className}`}
          {...props}
        />
        {(error || helperText) && (
          <span className={`px-1 text-[13px] font-semibold ${error ? 'text-red-500' : 'text-textMuted'}`}>
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
