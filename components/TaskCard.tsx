import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, X } from "lucide-react";
import { Button } from "./ui/button";

interface TaskCardProps {
  task: {
    id: string;
    name: string;
    duration: number;
    category: string;
    description?: string;
    isScheduled?: boolean;
    startTime?: string;
  };
  onRemove?: (id: string) => void;
  draggable?: boolean;
}

const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}分`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}時間${remainingMinutes}分` : `${hours}時間`;
  }
};

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    "調剤業務": "bg-blue-100 text-blue-800",
    "配達・営業": "bg-green-100 text-green-800",
    "事務・管理": "bg-purple-100 text-purple-800",
    "業務管理": "bg-orange-100 text-orange-800",
    "その他": "bg-gray-100 text-gray-800",
  };
  return colors[category] || colors["その他"];
};

export function TaskCard({ task, onRemove, draggable = true }: TaskCardProps) {
  return (
    <Card 
      className={`relative ${draggable ? 'cursor-move hover:shadow-md transition-shadow' : ''} ${
        task.isScheduled ? 'border-blue-500 bg-blue-50' : ''
      }`}
      draggable={draggable}
      onDragStart={(e) => {
        if (draggable) {
          e.dataTransfer.setData("application/json", JSON.stringify(task));
        }
      }}
    >
      <CardContent className="p-4">
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0"
            onClick={() => onRemove(task.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getCategoryColor(task.category)}>
              {task.category}
            </Badge>
            {task.startTime && (
              <Badge variant="outline">
                {task.startTime}
              </Badge>
            )}
          </div>
          
          <h4 className="font-medium">{task.name}</h4>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatDuration(task.duration)}
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground">
              {task.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}