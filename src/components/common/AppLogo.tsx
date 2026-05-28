import logoUrl from '../../assets/logo/logo.png';

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

  const containerClasses = `${sizeClasses[size]} flex shrink-0 items-center justify-center overflow-hidden rounded-[10px] font-bold ${
    white ? 'bg-white/20 text-white' : 'bg-primary text-white shadow-sm'
  } ${className}`;

  return (
    <div className={containerClasses} aria-hidden="true">
      <img src={logoUrl} alt="챙김 로고" className="h-full w-full object-contain" />
    </div>
  );
}
