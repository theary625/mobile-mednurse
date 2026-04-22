import { Lightbulb } from "lucide-react";
import { ReactNode } from "react";

interface QuickAnswerProps {
  title?: string;
  children: ReactNode;
}

const QuickAnswer = ({ title = "Quick Answer", children }: QuickAnswerProps) => {
  return (
    <div className="bg-info/10 border border-info/20 rounded-2xl p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-info/20 rounded-lg flex-shrink-0">
          <Lightbulb className="w-5 h-5 text-info" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground mb-2">{title}</h2>
          <div className="text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default QuickAnswer;
