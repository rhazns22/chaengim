export function calculateDDay(dateString: string | null): number | null {
  if (!dateString) return null;
  // Parse common Korean date formats like "2024.12.31", "2024년 12월 31일"
  const cleanDateStr = dateString.replace(/[^\d.-]/g, '.').replace(/\.+/g, '.').replace(/\.$/, '');
  const parts = cleanDateStr.split('.');
  
  if (parts.length >= 2) {
    const year = parts[0].length === 4 ? parseInt(parts[0]) : new Date().getFullYear();
    const month = parseInt(parts.length === 3 ? parts[1] : parts[0]) - 1;
    const day = parseInt(parts.length === 3 ? parts[2] : parts[1]);
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

    const targetDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  }
  return null;
}

export function formatDDay(dDay: number | null): string {
  if (dDay === null) return '';
  if (dDay === 0) return 'D-Day';
  if (dDay < 0) return `D+${Math.abs(dDay)}`;
  return `D-${dDay}`;
}
