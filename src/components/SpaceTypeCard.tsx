interface SpaceTypeCardProps {
  title: string;
  icon: React.ReactNode;
  iconBgColor: string;
  onClick?: () => void;
}

export function SpaceTypeCard({ title, icon, iconBgColor, onClick }: SpaceTypeCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full aspect-[4/3] bg-card border border-border rounded-lg p-3 flex flex-col items-start justify-between hover:bg-accent transition-colors"
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
