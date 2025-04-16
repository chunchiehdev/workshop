import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowLeft, UploadCloud } from "lucide-react";

export function CreateBotPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/bots">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">建立新 Bot</h1>
      </div>
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-3">
          <TabsTrigger value="basic">基本資訊</TabsTrigger>
          <TabsTrigger value="prompt">Prompt 模板</TabsTrigger>
          <TabsTrigger value="data">資料上傳</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>基本資訊</CardTitle>
              <CardDescription>設定 Bot 的基本資訊</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full gap-2">
                <Label htmlFor="bot-name">Bot 名稱</Label>
                <Input id="bot-name" placeholder="請輸入 Bot 名稱" />
              </div>
              <div className="grid w-full gap-2">
                <Label htmlFor="bot-description">Bot 描述</Label>
                <Textarea id="bot-description" placeholder="請描述此 Bot 的功能和用途" />
              </div>
              <div className="grid w-full gap-2">
                <Label htmlFor="bot-model">選擇模型</Label>
                <select id="bot-model" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4o-mini">GPT-4o-mini</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                </select>
              </div>
              <Button className="mt-4">下一步: Prompt 模板</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="prompt" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Prompt 模板</CardTitle>
              <CardDescription>設計 Bot 的 Prompt 模板</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full gap-2">
                <Label htmlFor="role">角色</Label>
                <Input id="role" placeholder="例如: 老師、助教" defaultValue="老師" />
              </div>
              <div className="grid w-full gap-2">
                <Label htmlFor="goal">任務目標</Label>
                <Textarea id="goal" placeholder="描述此 Bot 的主要目標" />
              </div>
              <div className="grid w-full gap-2">
                <Label htmlFor="object">教學對象描述</Label>
                <Textarea id="object" placeholder="描述此 Bot 的目標使用者" />
              </div>
              <div className="grid w-full gap-2">
                <Label htmlFor="activity">教學活動進行方式</Label>
                <Textarea id="activity" placeholder="描述此 Bot 如何與學生互動" />
              </div>
              <div className="grid w-full gap-2">
                <Label htmlFor="format">輸出內容與格式</Label>
                <Textarea id="format" placeholder="描述 Bot 回應的格式" />
              </div>
              <div className="grid w-full gap-2">
                <Label htmlFor="responsestyle">回應風格</Label>
                <Textarea id="responsestyle" placeholder="描述 Bot 回應的語氣和風格" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">上一步</Button>
                <Button>下一步: 資料上傳</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>資料上傳</CardTitle>
              <CardDescription>上傳 Bot 需要的參考資料</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <UploadCloud className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  拖放檔案到此處或點擊上傳
                </p>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                />
                <Button variant="outline" className="mt-4">
                  選擇檔案
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                支援的檔案類型: PDF, DOC, DOCX, TXT, CSV, XLSX (最大 20MB)
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">上一步</Button>
                <Button>完成並建立 Bot</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 