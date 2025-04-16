import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";

const records = [
  {
    id: "1",
    studentName: "張小明",
    className: "三年級一班",
    botName: "數學教學助手",
    taskName: "數學應用題練習",
    date: "2023-09-25",
    duration: "25分鐘",
    interactions: 18
  },
  {
    id: "2",
    studentName: "李小華",
    className: "三年級一班",
    botName: "數學教學助手",
    taskName: "數學應用題練習",
    date: "2023-09-25",
    duration: "32分鐘",
    interactions: 23
  },
  {
    id: "3",
    studentName: "王小明",
    className: "三年級二班",
    botName: "語文寫作輔導",
    taskName: "短文寫作練習",
    date: "2023-09-24",
    duration: "45分鐘",
    interactions: 15
  },
  {
    id: "4",
    studentName: "陳小美",
    className: "三年級二班",
    botName: "語文寫作輔導",
    taskName: "短文寫作練習",
    date: "2023-09-24",
    duration: "38分鐘",
    interactions: 12
  },
  {
    id: "5",
    studentName: "林小玉",
    className: "四年級一班",
    botName: "歷史知識問答",
    taskName: "歷史人物探究",
    date: "2023-09-23",
    duration: "29分鐘",
    interactions: 21
  }
];

export function RecordsPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">互動紀錄</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>搜尋紀錄</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-2">
              <Input placeholder="搜尋學生姓名或班級" />
              <Button size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="">所有 Bot</option>
                <option value="1">數學教學助手</option>
                <option value="2">語文寫作輔導</option>
                <option value="3">歷史知識問答</option>
              </select>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="">所有班級</option>
                <option value="3-1">三年級一班</option>
                <option value="3-2">三年級二班</option>
                <option value="4-1">四年級一班</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>學生互動列表</CardTitle>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>匯出報表</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-medium">學生</th>
                  <th className="py-3 px-4 text-left font-medium">班級</th>
                  <th className="py-3 px-4 text-left font-medium">Bot</th>
                  <th className="py-3 px-4 text-left font-medium">任務</th>
                  <th className="py-3 px-4 text-left font-medium">日期</th>
                  <th className="py-3 px-4 text-left font-medium">使用時間</th>
                  <th className="py-3 px-4 text-left font-medium">互動次數</th>
                  <th className="py-3 px-4 text-left font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b">
                    <td className="py-3 px-4">{record.studentName}</td>
                    <td className="py-3 px-4">{record.className}</td>
                    <td className="py-3 px-4">{record.botName}</td>
                    <td className="py-3 px-4">{record.taskName}</td>
                    <td className="py-3 px-4">{record.date}</td>
                    <td className="py-3 px-4">{record.duration}</td>
                    <td className="py-3 px-4">{record.interactions}</td>
                    <td className="py-3 px-4">
                      <Button variant="link" size="sm">查看對話</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 