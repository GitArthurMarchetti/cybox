interface ButtonContentProps {
  text: string;
  className?: string;
}

export function ButtonContent({ text, className = "" }: ButtonContentProps) {
  return (
    <div>
      {text}
    </div>
  );
}
