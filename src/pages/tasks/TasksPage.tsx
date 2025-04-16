import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

const tasks = [
  {
    id: "1",
    title: "數學應用題練習",
    description: "透過 Bot 輔助學生解決數學應用題",
    status: "進行中",
    deadline: "2023-09-30",
    botId: "1",
    botName: "數學教學助手"
  },
  {
    id: "2",
    title: "短文寫作練習",
    description: "引導學生完成短文寫作並提供修改建議",
    status: "進行中",
    deadline: "2023-10-15",
    botId: "2",
    botName: "語文寫作輔導"
  },
  {
    id: "3",
    title: "歷史人物探究",
    description: "學生透過對話了解歷史人物的生平與貢獻",
    status: "進行中",
    deadline: "2023-11-05",
    botId: "3",
    botName: "歷史知識問答"
  }
];

export function TasksPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">學習任務</h1>
        <Link to="/tasks/create">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>新增任務</span>
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <CardTitle>{task.title}</CardTitle>
              <div className="flex justify-between items-center mt-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  task.status === "進行中" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}>
                  {task.status}
                </span>
                <span className="text-sm text-muted-foreground">截止日期: {task.deadline}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">{task.description}</p>
              <p className="text-sm">使用 Bot: {task.botName}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link to={`/tasks/${task.id}`}>
                <Button variant="outline">查看詳情</Button>
              </Link>
              <Link to={`/tasks/${task.id}/edit`}>
                <Button>編輯任務</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 