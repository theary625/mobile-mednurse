import { Calendar } from "lucide-react";

interface LastUpdatedProps {
  date: string;
  className?: string;
}

const LastUpdated = ({ date, className = "" }: LastUpdatedProps) => {
  return (
    <div className={`inline-flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
      <Calendar className="w-4 h-4" />
      <span>Last reviewed: {date}</span>
    </div>
  );
};

export default LastUpdated;
