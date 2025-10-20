interface RoomTypeChipProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function RoomTypeChip({ label, isSelected, onClick }: RoomTypeChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        h-[40px] px-4 shrink-0 border rounded-full flex items-center gap-2 hover:bg-accent transition-colors
        ${isSelected
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-background border-border'
        }
      `}
    >
      <span className="text-sm whitespace-nowrap">{label}</span>
    </button>
  );
}
