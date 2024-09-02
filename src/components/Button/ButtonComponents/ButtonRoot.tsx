import { ReactNode } from "react"


interface ButtonRootProps {
    children: ReactNode;
    onClick?: () => void; 
    className?: string;
  }

export function ButtonRoot({ children, onClick, className = "" }: ButtonRootProps) {
    return(
      <button onClick={onClick} className={className}>
        {children}
      </button>
    )
}