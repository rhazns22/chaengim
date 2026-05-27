import type { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function ProfileQuestionCard({ title, description, children }: Props) {
  return (
    <div className="bg-white rounded-[24px] p-6 shadow-sm mb-4">
      <h3 className="text-lg font-extrabold text-textMain mb-2">{title}</h3>
      {description && <p className="text-sm text-textSub font-medium mb-5">{description}</p>}
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
}