interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  iconBgColor: string;
  onClick?: () => void;
}

export function FeatureCard({ title, icon, iconBgColor, onClick }: FeatureCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-[150px] h-[100px] shrink-0 bg-card border border-border rounded-lg p-3 flex flex-col items-start justify-between hover:bg-accent transition-colors"
    >
      <div 
        className="size-8 rounded-full flex items-center justify-center"
        style={{ backgroundColor: iconBgColor }}
      >
        {icon}
      </div>
      <span className="text-sm text-left">{title}</span>
    </button>
  );
}
