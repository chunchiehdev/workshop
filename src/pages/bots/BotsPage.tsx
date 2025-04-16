import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { PlusCircle, Search, Filter, Calendar, MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const bots = [
  {
    id: "1",
    name: "數學教學助手",
    description: "協助學生解決數學問題的 Bot",
    lastUpdated: "2023-08-15",
    model: "GPT-4o",
    status: "已啟用"
  },
  {
    id: "2",
    name: "語文寫作輔導",
    description: "幫助學生提升寫作能力的 Bot",
    lastUpdated: "2023-09-03",
    model: "Claude 3 Opus",
    status: "已啟用"
  },
  {
    id: "3",
    name: "歷史知識問答",
    description: "回答學生歷史相關問題的 Bot",
    lastUpdated: "2023-10-21",
    model: "GPT-4o",
    status: "已啟用"
  },
  {
    id: "4",
    name: "科學實驗助手",
    description: "指導學生進行科學實驗的 Bot",
    lastUpdated: "2023-11-05",
    model: "Claude 3 Sonnet",
    status: "維護中"
  },
  {
    id: "5",
    name: "英語口語練習",
    description: "幫助學生練習英語會話的 Bot",
    lastUpdated: "2023-12-18",
    model: "GPT-4o",
    status: "已啟用"
  }
];

export function BotsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bot 管理</h1>
          <p className="text-muted-foreground mt-1">管理您的 AI 教學助手</p>
        </div>
        <Link to="/bots/create">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>建立新 Bot</span>
          </Button>
        </Link>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="search" className="text-sm font-medium block mb-2">搜尋 Bot</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="輸入關鍵字..."
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>篩選條件</span>
              </Button>
            </div>
            <div>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span>排序</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bots.map((bot) => (
          <Card key={bot.id} className="group overflow-hidden border transition-colors hover:border-primary">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg mr-2">{bot.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to={`/bots/${bot.id}`} className="flex w-full">查看詳情</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to={`/bots/${bot.id}/edit`} className="flex w-full">編輯設定</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>複製 Bot</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">刪除 Bot</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{bot.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">模型</div>
                  <div className="font-medium">{bot.model}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">狀態</div>
                  <div className={`font-medium ${bot.status === "已啟用" ? "text-green-600" : "text-amber-600"}`}>
                    {bot.status}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 pb-4 flex items-center justify-between">
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                最後更新: {bot.lastUpdated}
              </div>
              <Link to={`/bots/${bot.id}`}>
                <Button size="sm">查看</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 