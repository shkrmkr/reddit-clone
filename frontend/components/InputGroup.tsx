import { ChangeEvent } from "react";
import cn from "classnames";

interface Props {
  className?: string;
  type: string;
  name: string;
  placeholder: string;
  value: string;
  error?: string | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function InputGroup({
  className,
  type,
  name,
  placeholder,
  value,
  error,
  onChange,
}: Props) {
  return (
    <div className={className}>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        className={cn(
          "w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white",
          { "border-red-500": error }
        )}
        onChange={onChange}
      />
      <small className="font-medium text-red-600">{error}</small>
    </div>
  );
}
