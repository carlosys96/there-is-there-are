import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'neutral';
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "px-6 py-3 rounded-full font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg border-b-4";
  
  const variants = {
    primary: "bg-indigo-500 hover:bg-indigo-400 border-indigo-700 text-white",
    secondary: "bg-purple-500 hover:bg-purple-400 border-purple-700 text-white",
    success: "bg-green-500 hover:bg-green-400 border-green-700 text-white",
    danger: "bg-red-500 hover:bg-red-400 border-red-700 text-white",
    neutral: "bg-gray-200 hover:bg-gray-100 border-gray-400 text-gray-800"
  };

  const disabledStyle = "opacity-50 cursor-not-allowed transform-none hover:scale-100";

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? disabledStyle : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;