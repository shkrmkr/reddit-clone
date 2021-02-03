interface Props {
  children: React.ReactNode;
}

export default function ActionButton({ children }: Props) {
  return (
    <div className="flex items-center p-1 mr-1 text-xs text-gray-500 rounded cursor-pointer hover:bg-gray-200">
      {children}
    </div>
  );
}
