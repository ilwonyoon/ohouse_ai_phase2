import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface FilterChipProps {
  label: string;
  options: string[];
  selectedValue?: string;
  onSelect?: (value: string) => void;
}

export function FilterChip({ label, options, selectedValue, onSelect }: FilterChipProps) {
  const displayText = selectedValue || label;
  const isSelected = !!selectedValue;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`h-[40px] px-4 shrink-0 border rounded-full flex items-center gap-2 hover:bg-accent transition-colors ${
          isSelected ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border'
        }`}>
          <span className="text-sm">{displayText}</span>
          <ChevronDown className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem 
            key={option}
            onClick={() => onSelect?.(option)}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
