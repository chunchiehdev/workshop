import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();

  // 設定麵包屑路徑
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === "/dashboard") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">首頁</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>儀表板</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    } else if (path.startsWith("/bots")) {
      if (path === "/bots/create") {
        return (
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">首頁</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/bots">Bot 管理</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>創建 Bot</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        );
      }
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">首頁</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Bot 管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    } else if (path.startsWith("/tasks")) {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">首頁</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>學習任務</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    } else if (path.startsWith("/records")) {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">首頁</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>互動紀錄</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    } else if (path.startsWith("/classes")) {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">首頁</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>班級管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }
    // 預設麵包屑
    return (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">首頁</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    );
  };

  return (
    <header className="h-12 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 sticky top-0">
      <div className="flex h-full items-center px-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="flex items-center">
            <SidebarTrigger className="size-6" />
            <Separator orientation="vertical" className="h-3 mx-2" />
            <Breadcrumb className="hidden sm:flex text-xs">
              {getBreadcrumbs()}
            </Breadcrumb>
          </div>
          
          {/* <div className="flex-1 flex justify-center md:justify-start ml-0 md:ml-4">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2 top-[7px] h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜尋..."
                className="w-full pl-7 h-7 text-xs bg-muted/50"
              />
            </div>
          </div> */}
        </div>
        
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="relative size-8">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-3.5 h-3.5 text-[10px] flex items-center justify-center">
              3
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
} 