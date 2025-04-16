import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, BookOpen, Users, MessageSquare, Activity, Clock } from "lucide-react";

export function Dashboard() {
  const stats = [
    {
      title: "Bot 總數",
      value: "5",
      description: "已建立的 Bot 數量",
      icon: <Bot className="h-6 w-6 text-blue-500" />,
      trend: "+2 本週"
    },
    {
      title: "學習任務",
      value: "3",
      description: "進行中的學習任務",
      icon: <BookOpen className="h-6 w-6 text-purple-500" />,
      trend: "+1 本週"
    },
    {
      title: "學生人數",
      value: "78",
      description: "平台上的學生總數",
      icon: <Users className="h-6 w-6 text-green-500" />,
      trend: "+5 本月"
    },
    {
      title: "互動總數",
      value: "246",
      description: "本週學生與 Bot 的互動次數",
      icon: <MessageSquare className="h-6 w-6 text-amber-500" />,
      trend: "+28 今天"
    }
  ];

  const recentActivities = [
    { 
      user: "張小明",
      action: "更新了數學 Bot",
      time: "30 分鐘前",
      icon: <Bot className="h-4 w-4 text-blue-500" />
    },
    { 
      user: "李老師",
      action: "建立了新的學習任務",
      time: "2 小時前",
      icon: <BookOpen className="h-4 w-4 text-purple-500" />
    },
    { 
      user: "王老師",
      action: "查看了班級互動紀錄",
      time: "昨天",
      icon: <Activity className="h-4 w-4 text-amber-500" />
    },
    { 
      user: "林老師",
      action: "新增了 15 位學生到四年級二班",
      time: "昨天",
      icon: <Users className="h-4 w-4 text-green-500" />
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">儀表板</h1>
        <p className="text-muted-foreground mt-1">歡迎回來，教師帳號！查看您平台的最新數據。</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  {stat.trend}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>最近活動</CardTitle>
            <CardDescription>平台上的最新活動</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-center">
                  <div className="mr-4 rounded-full bg-muted p-2">
                    {activity.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {activity.user} <span className="text-muted-foreground">{activity.action}</span>
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
            <CardDescription>常用功能的快速連結</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Bot className="h-8 w-8 text-blue-500 mb-2" />
                  <p className="text-sm font-medium">建立新的 Bot</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <BookOpen className="h-8 w-8 text-purple-500 mb-2" />
                  <p className="text-sm font-medium">新增學習任務</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Users className="h-8 w-8 text-green-500 mb-2" />
                  <p className="text-sm font-medium">管理班級</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Activity className="h-8 w-8 text-amber-500 mb-2" />
                  <p className="text-sm font-medium">查看紀錄</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 