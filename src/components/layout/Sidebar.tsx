import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Bot, 
  FileText, 
  BarChart2, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isCollapsed: boolean;
}

function SidebarItem({ icon, label, href, isCollapsed }: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(href);

  return (
    <Link to={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 px-3 h-12",
          isActive && "bg-accent text-accent-foreground",
          isCollapsed && "justify-center px-2"
        )}
      >
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </Button>
    </Link>
  );
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "h-screen border-r flex flex-col transition-all duration-300 sticky top-0",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between h-16 border-b">
        {!isCollapsed && (
          <span className="font-bold text-lg truncate">教師學習平台</span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(isCollapsed && "mx-auto")}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex-1 py-6 flex flex-col gap-2 overflow-y-auto">
        <SidebarItem
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="儀表板"
          href="/dashboard"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={<Bot className="h-5 w-5" />}
          label="Bot 管理"
          href="/bots"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={<FileText className="h-5 w-5" />}
          label="學習任務"
          href="/tasks"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={<BarChart2 className="h-5 w-5" />}
          label="互動紀錄"
          href="/records"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={<Users className="h-5 w-5" />}
          label="班級管理"
          href="/classes"
          isCollapsed={isCollapsed}
        />
      </div>
      
      <div className="p-4 border-t">
        <SidebarItem
          icon={<Settings className="h-5 w-5" />}
          label="設定"
          href="/settings"
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  );
} 