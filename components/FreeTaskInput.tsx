import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

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

interface FreeTaskInputProps {
  onCreateTask: (task: { name: string; duration: number; category: string; description?: string }) => void;
}

export function FreeTaskInput({ onCreateTask }: FreeTaskInputProps) {
  const [taskName, setTaskName] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateTask = () => {
    if (taskName && selectedDuration) {
      onCreateTask({
        name: taskName,
        duration: parseInt(selectedDuration),
        category: "その他",
        description: description || undefined,
      });
      setTaskName("");
      setSelectedDuration("");
      setDescription("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>自由入力タスク</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block mb-2">タスク名</label>
          <Input
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="タスク名を入力してください"
          />
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

        <div>
          <label className="block mb-2">詳細（任意）</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="タスクの詳細を入力してください"
            rows={3}
          />
        </div>

        <Button 
          onClick={handleCreateTask} 
          disabled={!taskName || !selectedDuration}
          className="w-full"
        >
          タスクカードを作成
        </Button>
      </CardContent>
    </Card>
  );
}