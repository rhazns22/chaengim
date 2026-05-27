import { ShieldCheck } from 'lucide-react'; // Fallback

interface AppLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  white?: boolean;
}

export default function AppLogo({ className = '', size = 'md', white = false }: AppLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xl',
    md: 'w-8 h-8 text-2xl',
    lg: 'w-12 h-12 text-3xl'
  };

  const containerClasses = `${sizeClasses[size]} rounded-[20px] flex items-center justify-center font-bold flex-shrink-0 ${
    white ? 'bg-white/20 text-white' : 'bg-primary text-white shadow-sm'
  } ${className}`;

  return (
    <div className={containerClasses} aria-hidden="true">
      {/* 
        실제 로고 이미지가 있으면 아래 img 태그 사용,
        현재는 fallback을 위해 텍스트 또는 lucide icon을 사용합니다.
      */}
      {/* <img src={logoUrl} alt="챙김 로고" className="w-full h-full object-contain" /> */}
      <ShieldCheck className="w-3/5 h-3/5" />
    </div>
  );
}
