import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";

interface Task {
  id: string;
  name: string;
  category: string;
}

const predefinedTasks: Task[] = [
  // 調剤業務
  { id: "pharmacy-1", name: "処方入力", category: "調剤業務" },
  { id: "pharmacy-2", name: "入力チェック", category: "調剤業務" },
  { id: "pharmacy-3", name: "ピッキング", category: "調剤業務" },
  { id: "pharmacy-4", name: "調剤", category: "調剤業務" },
  { id: "pharmacy-5", name: "監査", category: "調剤業務" },
  { id: "pharmacy-6", name: "セット", category: "調剤業務" },
  { id: "pharmacy-7", name: "セット監査", category: "調剤業務" },
  
  // 配達・営業
  { id: "delivery-1", name: "定期薬配達", category: "配達・営業" },
  { id: "delivery-2", name: "往診同行", category: "配達・営業" },
  { id: "delivery-3", name: "臨時薬対応", category: "配達・営業" },
  
  // 事務・管理
  { id: "admin-1", name: "薬歴", category: "事務・管理" },
  { id: "admin-2", name: "報告書", category: "事務・管理" },
  { id: "admin-3", name: "レセプト請求　毎月１０日まで", category: "事務・管理" },
  { id: "admin-4", name: "原本処方箋確認（有無）", category: "事務・管理" },
  { id: "admin-5", name: "請求書・領収書・明細書", category: "事務・管理" },
  { id: "admin-6", name: "月末書類準備", category: "事務・管理" },
  { id: "admin-7", name: "入居書類準備", category: "事務・管理" },
  { id: "admin-8", name: "レジ締め　毎日", category: "事務・管理" },
  
  // 業務管理
  { id: "management-1", name: "発注", category: "業務管理" },
  { id: "management-2", name: "残薬確認", category: "業務管理" },
  { id: "management-3", name: "新規入居時・契約（対面・郵送）", category: "業務管理" },
];

const timeOptions = [
  { value: "15", label: "15分" },
  { value: "30", label: "30分" },
  { value: "45", label: "45分" },
  { value: "60", label: "1時間" },
  { value: "90", label: "1時間30分" },
  { value: "120", label: "2時間" },
  { value: "150", label: "2時間30分" },
  { value: "180", label: "3時間" },
  { value: "240", label: "4時間" },
];

interface TaskSelectorProps {
  onCreateTask: (task: { name: string; duration: number; category: string }) => void;
}

export function TaskSelector({ onCreateTask }: TaskSelectorProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string>("");

  const handleCreateTask = () => {
    if (selectedTask && selectedDuration) {
      onCreateTask({
        name: selectedTask.name,
        duration: parseInt(selectedDuration),
        category: selectedTask.category,
      });
      setSelectedTask(null);
      setSelectedDuration("");
    }
  };

  // Group tasks by category
  const tasksByCategory = predefinedTasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>薬局業務タスク選択</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block mb-2">タスクを選択</label>
          <Select
            value={selectedTask?.id || ""}
            onValueChange={(value: string) => {
              const task = predefinedTasks.find(t => t.id === value);
              setSelectedTask(task || null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="タスクを選択してください" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(tasksByCategory).map(([category, tasks]) => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                    {category}
                  </div>
                  {tasks.map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {task.category}
                        </Badge>
                        {task.name}
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block mb-2">所要時間を選択</label>
          <Select value={selectedDuration} onValueChange={setSelectedDuration}>
            <SelectTrigger>
              <SelectValue placeholder="時間を選択してください" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleCreateTask} 
          disabled={!selectedTask || !selectedDuration}
          className="w-full"
        >
          タスクカードを作成
        </Button>
      </CardContent>
    </Card>
  );
}