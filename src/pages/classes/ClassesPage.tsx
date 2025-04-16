import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Users, BookOpen, Bot, MessageSquare } from "lucide-react";

const classes = [
  {
    id: "1",
    name: "三年級一班",
    students: 32,
    activeBots: 2,
    activeTasks: 3,
    teacher: "張老師"
  },
  {
    id: "2",
    name: "三年級二班",
    students: 30,
    activeBots: 3,
    activeTasks: 2,
    teacher: "李老師"
  },
  {
    id: "3",
    name: "四年級一班",
    students: 28,
    activeBots: 1,
    activeTasks: 1,
    teacher: "王老師"
  },
  {
    id: "4",
    name: "四年級二班",
    students: 29,
    activeBots: 2,
    activeTasks: 2,
    teacher: "林老師"
  }
];

export function ClassesPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">班級管理</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>新增班級</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新增班級</DialogTitle>
              <DialogDescription>
                輸入新班級的基本資訊。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="class-name">班級名稱</Label>
                <Input id="class-name" placeholder="例如: 三年級三班" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teacher-name">班導師</Label>
                <Input id="teacher-name" placeholder="導師姓名" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="student-count">學生人數</Label>
                <Input id="student-count" type="number" placeholder="學生人數" />
              </div>
            </div>
            <DialogFooter>
              <Button>建立班級</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <CardHeader>
              <CardTitle>{cls.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">學生: {cls.students}人</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Bot: {cls.activeBots}個</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-green-500" />
                  <span className="text-sm">任務: {cls.activeTasks}個</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">班導: {cls.teacher}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" className="flex-1">管理學生</Button>
              <Button className="flex-1">查看任務</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 