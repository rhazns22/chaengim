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
  className?: string;
}

export default function BenefitIcon({ iconType, className = "w-14 h-14 rounded-[20px]" }: Props) {
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

    return (
      <div className={`${className} bg-chipBg flex items-center justify-center text-primary flex-shrink-0`}>
        <FallbackIcon size={24} />
      </div>
    );
  };

  if (!src || error) {
    return renderFallback();
  }

  return (
    <div className={`${className} bg-chipBg flex-shrink-0 overflow-hidden flex items-center justify-center`}>
      <img 
        src={src} 
        alt="" 
        aria-hidden="true"
        className="w-full h-full p-1.5 object-contain"
        onError={() => setError(true)}
      />
    </div>
  );
}
