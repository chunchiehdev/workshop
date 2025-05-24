// src/pages/bots/BotsPage.tsx - Bot列表頁面
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  MessageCircle, 
  MoreHorizontal, 
  Calendar, 
  Edit,
  Trash2,
  AlertCircle
} from "lucide-react";
import { useGetAllBots, useDeleteBot } from "@/services/queryHooks";
import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/lib/toast";
import { useQueryClient } from "@tanstack/react-query";

export function BotsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: bots, isLoading, error, refetch } = useGetAllBots();
  const deleteBot = useDeleteBot();
  const queryClient = useQueryClient();
  
  // AlertDialog 的 ref，用於手動控制
  const dialogRef = useRef<HTMLDivElement>(null);
  
  // 確認刪除對話框
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [botToDelete, setBotToDelete] = useState<number | null>(null);
  // 添加錯誤狀態
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  // 設置頁面標題並在路由變化時刷新數據
  useEffect(() => {
    document.title = "我的 Bots";
    
    // 當用戶通過導航到達此頁面時，刷新數據
    refetch();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
  
  const handleCreateBot = () => {
    navigate("/bots/create");
  };

  const handleBotClick = (botId: number) => {
    navigate(`/bots/${botId}/chat`);
  };
  
  const handleEditBot = (e: React.MouseEvent, botId: number) => {
    e.stopPropagation(); // 防止觸發卡片點擊
    navigate(`/bots/${botId}/edit`);
  };
  
  const openDeleteDialog = (e: React.MouseEvent, botId: number) => {
    e.stopPropagation(); // 防止觸發卡片點擊
    setBotToDelete(botId);
    setDeleteError(null); // 重置錯誤狀態
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (botToDelete) {
      try {
        // 開始刪除前清除錯誤狀態
        setDeleteError(null);
        
        // 保存當前要刪除的 bot 資訊用於後續操作
        const currentBotToDelete = botToDelete;
        const botDataFromList = bots?.find(b => b.id === currentBotToDelete);
        const botName = botDataFromList?.name;
        
        // 執行刪除操作
        await deleteBot.mutateAsync(currentBotToDelete);
        
        // 檢查當前路徑，確保從任何含有此bot ID的路徑都重定向回列表頁
        const currentPath = location.pathname;
        const botIdInPath = currentPath.includes(`/bots/${currentBotToDelete}`);
        
        // 清除 sessionStorage 中可能存在的歡迎訊息標記
        if (botName) {
          sessionStorage.removeItem(`welcomeMessage_${botName}`);
        }
        
        // 先關閉對話框並重置狀態，避免 UI 卡頓
        setDeleteDialogOpen(false);
        setBotToDelete(null);
        
        // 使用 invalidateQueries 讓 React Query 重新獲取數據，而不是直接 refetch
        // 這樣可以確保所有相關查詢都被重新獲取，並且不會有快取問題
        await queryClient.invalidateQueries();
        
        // 如果必要，重新導航
        if (botIdInPath) {
          // 如果當前在被刪除bot的頁面，使用replace方式導航回列表頁
          navigate('/bots', { replace: true });
        }
        
        // 使用導入的 toast 顯示成功通知
        toast({
          title: "刪除成功",
          description: "Bot 已成功刪除",
        });
        
      } catch (error) {
        console.error("刪除Bot失敗:", error);
        // 設置錯誤狀態，但不關閉對話框
        setDeleteError(error instanceof Error ? error.message : "刪除失敗，請稍後再試");
        
        // 使用導入的 toast 顯示錯誤通知
        toast({
          title: "刪除失敗",
          description: error instanceof Error ? error.message : "無法刪除 Bot，請稍後再試",
          variant: "destructive"
        });
      }
    }
  };

  // 取消刪除
  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    // 使用 setTimeout 確保對話框完全關閉後再清除狀態
    setTimeout(() => {
      setBotToDelete(null);
      setDeleteError(null);
    }, 300);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: zhTW 
      });
    } catch (e) {
      return '未知時間';
    }
  };

  // 確保 bots 是一個數組
  const botsArray = Array.isArray(bots) ? bots : [];

  return (
    <div className="container py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">我的 Bots</h1>
        <Button 
          onClick={handleCreateBot}
          className="flex items-center gap-2 px-5 h-11"
        >
          <Plus className="h-5 w-5" />
          建立 Bot
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 px-6 text-red-500 bg-red-50 rounded-xl my-6">
          <p className="mb-3 font-semibold text-lg">發生錯誤，無法載入 Bots</p>
          <p className="text-sm text-red-400">請檢查網絡連接或稍後再試</p>
        </div>
      ) : botsArray.length === 0 ? (
        <Card className="bg-muted/40 border-dashed border-2 my-8">
          <CardContent className="flex flex-col items-center py-20">
            <p className="text-muted-foreground mb-6 text-lg">您還沒有建立任何 Bot</p>
            <Button 
              onClick={handleCreateBot}
              className="flex items-center gap-2 px-5 h-10"
            >
              <Plus className="h-4 w-4" />
              建立第一個 Bot
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-6">
          {botsArray.map((bot) => (
            <Card 
              key={bot.id} 
              className="overflow-hidden border hover:border-primary/50 transition-all hover:shadow-md cursor-pointer group"
              onClick={() => handleBotClick(bot.id)}
            >
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">{bot.name}</h3>
                    
                    {/* 操作選單 */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-60 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={(e) => handleEditBot(e, bot.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          編輯
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onClick={(e) => openDeleteDialog(e, bot.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          刪除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-muted-foreground text-sm mb-5 line-clamp-2">
                    {bot.role}: {bot.goal}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(bot.created_at)}</span>
                  </div>
                </div>
                <div className="bg-muted/30 px-6 py-4 border-t flex justify-between items-center">
                  <div className="flex gap-2 text-xs">
                    <div className="bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                      {bot.model}
                    </div>
                    <div className="bg-green-100 text-green-800 px-2.5 py-1 rounded-full font-medium">
                      活躍
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="flex items-center gap-1 h-8 opacity-80 group-hover:opacity-100 group-hover:bg-primary group-hover:text-white transition-all"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    聊天
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* 刪除確認對話框 */}
      <AlertDialog 
        open={deleteDialogOpen} 
        onOpenChange={(open) => {
          // 只在對話框要關閉時處理
          if (!open) cancelDelete();
        }}
      >
        <AlertDialogContent ref={dialogRef}>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              確認刪除 Bot
            </AlertDialogTitle>
            <AlertDialogDescription>
              此操作無法撤銷，確定要刪除該 Bot 嗎？刪除後，所有相關的對話記錄也將被刪除。
              {deleteError && (
                <div className="mt-2 text-red-500 bg-red-50 p-2 rounded-md text-sm">
                  錯誤: {deleteError}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>取消</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600"
              onClick={confirmDelete}
              disabled={deleteBot.isPending}
            >
              {deleteBot.isPending ? '處理中...' : '刪除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}