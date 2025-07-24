import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TaskCard } from "./TaskCard";

interface ScheduledTask {
  id: string;
  name: string;
  duration: number;
  category: string;
  description?: string;
  startTime: string;
  endTime: string;
}

interface TimeSchedulerProps {
  scheduledTasks: ScheduledTask[];
  onTaskScheduled: (task: ScheduledTask) => void;
  onTaskRemoved: (taskId: string) => void;
}

const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 7; hour <= 23; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 23) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return slots;
};

const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startMinutes = hours * 60 + minutes;
  const endMinutes = startMinutes + durationMinutes;
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  
  if (endHours >= 24) {
    return "23:59";
  }
  
  return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
};

const isTimeSlotAvailable = (
  startTime: string, 
  durationMinutes: number, 
  existingTasks: ScheduledTask[]
): boolean => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = startMinutes + durationMinutes;
  
  // Check if task goes beyond working hours (23:00)
  if (endMinutes > 23 * 60) {
    return false;
  }
  
  for (const task of existingTasks) {
    const [taskStartHour, taskStartMin] = task.startTime.split(':').map(Number);
    const [taskEndHour, taskEndMin] = task.endTime.split(':').map(Number);
    const taskStartMinutes = taskStartHour * 60 + taskStartMin;
    const taskEndMinutes = taskEndHour * 60 + taskEndMin;
    
    // Check for overlap
    if (
      (startMinutes < taskEndMinutes && endMinutes > taskStartMinutes)
    ) {
      return false;
    }
  }
  
  return true;
};

export function TimeScheduler({ scheduledTasks, onTaskScheduled, onTaskRemoved }: TimeSchedulerProps) {
  const [draggedOverSlot, setDraggedOverSlot] = useState<string | null>(null);
  const timeSlots = generateTimeSlots();

  const handleDrop = (e: React.DragEvent, timeSlot: string) => {
    e.preventDefault();
    setDraggedOverSlot(null);
    
    try {
      const taskData = JSON.parse(e.dataTransfer.getData("application/json"));
      
      if (isTimeSlotAvailable(timeSlot, taskData.duration, scheduledTasks)) {
        const endTime = calculateEndTime(timeSlot, taskData.duration);
        const scheduledTask: ScheduledTask = {
          ...taskData,
          id: `${taskData.id}-${Date.now()}`,
          startTime: timeSlot,
          endTime,
        };
        
        onTaskScheduled(scheduledTask);
      }
    } catch (error) {
      console.error("Error scheduling task:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent, timeSlot: string) => {
    e.preventDefault();
    setDraggedOverSlot(timeSlot);
  };

  const handleDragLeave = () => {
    setDraggedOverSlot(null);
  };

  const getTaskAtTime = (timeSlot: string): ScheduledTask | null => {
    return scheduledTasks.find(task => task.startTime === timeSlot) || null;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>稼働時間スケジュール (7:00 - 23:00)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {timeSlots.map((timeSlot) => {
            const taskAtTime = getTaskAtTime(timeSlot);
            const isDraggedOver = draggedOverSlot === timeSlot;
            
            return (
              <div
                key={timeSlot}
                className={`flex items-center gap-2 p-2 rounded-lg border-2 border-dashed transition-colors min-h-[60px] ${
                  isDraggedOver
                    ? 'border-blue-500 bg-blue-50'
                    : taskAtTime
                    ? 'border-transparent bg-transparent'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onDrop={(e) => handleDrop(e, timeSlot)}
                onDragOver={(e) => handleDragOver(e, timeSlot)}
                onDragLeave={handleDragLeave}
              >
                <div className="w-14 text-sm font-mono text-center flex-shrink-0">
                  {timeSlot}
                </div>
                <div className="flex-1">
                  {taskAtTime ? (
                    <TaskCard
                      task={taskAtTime}
                      onRemove={onTaskRemoved}
                      draggable={false}
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground p-2 text-center">
                      タスクをここにドラッグ
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}