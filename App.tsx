import { useState } from "react";
import { TaskSelector } from "./components/TaskSelector";
import { FreeTaskInput } from "./components/FreeTaskInput";
import { TaskCard } from "./components/TaskCard";
import { TimeScheduler } from "./components/TimeScheduler";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { FileText, Plus, Calendar } from "lucide-react";

interface Task {
  id: string;
  name: string;
  duration: number;
  category: string;
  description?: string;
}

interface ScheduledTask extends Task {
  startTime: string;
  endTime: string;
}

export default function App() {
  const [unscheduledTasks, setUnscheduledTasks] = useState<Task[]>([]);
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);

  const handleCreateTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setUnscheduledTasks(prev => [...prev, newTask]);
  };

  const handleTaskScheduled = (scheduledTask: ScheduledTask) => {
    setScheduledTasks(prev => [...prev, scheduledTask]);
  };

  const handleTaskRemoved = (taskId: string) => {
    setScheduledTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleUnscheduledTaskRemoved = (taskId: string) => {
    setUnscheduledTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const getTotalScheduledTime = (): number => {
    return scheduledTasks.reduce((total, task) => total + task.duration, 0);
  };

  const formatTotalTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}時間${remainingMinutes}分` : `${hours}時間`;
  };

  const generateDailyReport = (): string => {
    const today = new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
    
    let report = `【日報】 ${today}\n\n`;
    report += `【合計稼働時間】 ${formatTotalTime(getTotalScheduledTime())}\n\n`;
    
    if (scheduledTasks.length > 0) {
      report += "【実施業務】\n";
      scheduledTasks
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
        .forEach(task => {
          report += `${task.startTime} - ${task.endTime} : ${task.name}`;
          if (task.description) {
            report += ` (${task.description})`;
          }
          report += `\n`;
        });
    }
    
    return report;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">定形業務日報アプリ</h1>
          <p className="text-muted-foreground">
            タスクを作成し、稼働時間に配置して日報を作成しましょう
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Task Creation */}
          <div className="space-y-6">
            <Tabs defaultValue="predefined" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="predefined">定形業務</TabsTrigger>
                <TabsTrigger value="free">自由入力</TabsTrigger>
              </TabsList>
              <TabsContent value="predefined">
                <TaskSelector onCreateTask={handleCreateTask} />
              </TabsContent>
              <TabsContent value="free">
                <FreeTaskInput onCreateTask={handleCreateTask} />
              </TabsContent>
            </Tabs>

            {/* Unscheduled Tasks */}
            {unscheduledTasks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    未配置タスク ({unscheduledTasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      右側のスケジュールにドラッグして時間を配置してください
                    </p>
                    {unscheduledTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onRemove={handleUnscheduledTaskRemoved}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Middle Column - Time Scheduler */}
          <div>
            <TimeScheduler
              scheduledTasks={scheduledTasks}
              onTaskScheduled={handleTaskScheduled}
              onTaskRemoved={handleTaskRemoved}
            />
          </div>

          {/* Right Column - Summary and Report */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  今日の概要
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">配置済みタスク数</p>
                    <p className="text-2xl font-bold">{scheduledTasks.length}件</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">合計稼働時間</p>
                    <p className="text-2xl font-bold">{formatTotalTime(getTotalScheduledTime())}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">未配置タスク数</p>
                    <p className="text-2xl font-bold">{unscheduledTasks.length}件</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  日報プレビュー
                </CardTitle>
              </CardHeader>
              <CardContent>
                {scheduledTasks.length > 0 ? (
                  <div className="space-y-4">
                    <pre className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-lg">
                      {generateDailyReport()}
                    </pre>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(generateDailyReport());
                      }}
                      className="w-full"
                    >
                      クリップボードにコピー
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    タスクを配置すると日報が表示されます
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}