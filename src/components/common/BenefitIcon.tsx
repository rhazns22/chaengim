import { useState } from 'react';
import bookIcon from '../../assets/icons/benefit-book.png';
import taxIcon from '../../assets/icons/benefit-tax.png';
import rocketImg from '../../assets/icons/benefit-rocket.png';
import energyIcon from '../../assets/icons/benefit-energy.png';
import cardIcon from '../../assets/icons/benefit-card.png';
import medicalIcon from '../../assets/icons/benefit-medical.png';
import employmentIcon from '../../assets/icons/benefit-employment.png';
import { Gift, BookOpen, Coins, Rocket, Zap, CreditCard, HeartPulse, BriefcaseBusiness } from 'lucide-react';

interface Props {
  iconType: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function BenefitIcon({ iconType, size, className }: Props) {
  const [error, setError] = useState(false);

  // Map iconType (which might be an emoji or category string) to specific icon paths
  const getIconSource = () => {
    switch (iconType) {
      case 'education': return bookIcon;
      case 'finance': return taxIcon;
      case 'startup': return rocketImg;
      case 'life': return energyIcon;
      case 'welfare': return cardIcon;
      case 'medical': return medicalIcon;
      case 'employment': return employmentIcon;
      default: return null; // Use fallback
    }
  };

  const src = getIconSource();

  const getCombinedClass = () => {
    if (className) return className;
    
    // Size mapping when no custom className is provided
    const sizeClasses = {
      sm: 'w-8 h-8 rounded-[12px] bg-chipBg',
      md: 'w-12 h-12 rounded-[16px] bg-chipBg',
      lg: 'w-14 h-14 rounded-[20px] bg-chipBg', // Default matching original w-14 h-14
    };
    
    return sizeClasses[size || 'lg'];
  };

  const combinedClass = getCombinedClass();

  // Padding inside the icon wrapper
  const getPaddingClass = () => {
    if (size === 'sm') return 'p-1';
    if (size === 'md') return 'p-1.5';
    return 'p-1.5';
  };

  // Fallback Soft Icon Box
  const renderFallback = () => {
    let FallbackIcon = Gift;
    if (iconType === 'education') FallbackIcon = BookOpen;
    if (iconType === 'finance') FallbackIcon = Coins;
    if (iconType === 'startup') FallbackIcon = Rocket;
    if (iconType === 'life') FallbackIcon = Zap;
    if (iconType === 'welfare') FallbackIcon = CreditCard;
    if (iconType === 'medical') FallbackIcon = HeartPulse;
    if (iconType === 'employment') FallbackIcon = BriefcaseBusiness;

    const iconSize = size === 'sm' ? 16 : size === 'md' ? 22 : 24;

    return (
      <div className={`${combinedClass} flex items-center justify-center text-primary flex-shrink-0`}>
        <FallbackIcon size={iconSize} />
      </div>
    );
  };

  if (!src || error) {
    return renderFallback();
  }

  return (
    <div className={`${combinedClass} flex-shrink-0 overflow-hidden flex items-center justify-center`}>
      <img 
        src={src} 
        alt={`${iconType} 카테고리 아이콘`} 
        aria-hidden="false"
        className={`w-full h-full object-contain ${getPaddingClass()}`}
        onError={() => setError(true)}
      />
    </div>
  );
}
