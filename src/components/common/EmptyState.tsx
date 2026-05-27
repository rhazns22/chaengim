import type { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[300px] text-center px-6">
      <div className="w-20 h-20 bg-background rounded-[24px] flex items-center justify-center mb-6 text-textMuted shadow-sm">
        {icon}
      </div>
      <h3 className="text-[18px] font-bold text-textMain mb-2 leading-snug">{title}</h3>
      <p className="text-[14px] text-textSub mb-8 leading-relaxed max-w-[260px]">{description}</p>
      {action}
    </div>
  );
}