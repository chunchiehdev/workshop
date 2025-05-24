import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Bot, 
  FileText, 
  BarChart2, 
  Users, 
  Settings,
  ChevronsUpDown,
  User,
  Brain
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 菜單數據
const mainMenuItems = [
  {
    title: "儀表板",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Bot 管理",
    url: "/bots",
    icon: Bot,
  },
  {
    title: "AI 科學問答",
    url: "/science-qa",
    icon: Brain,
  },
  {
    title: "學習任務",
    url: "/tasks",
    icon: FileText,
  },
  {
    title: "互動紀錄",
    url: "/records",
    icon: BarChart2,
  },
  {
    title: "班級管理",
    url: "/classes",
    icon: Users,
  },
];

const systemItems = [
  {
    title: "設定",
    url: "/settings",
    icon: Settings,
  },
];

// 用戶數據
const userData = {
  name: "王小明",
  email: "teacher@example.com",
  avatar: "https://github.com/chunchiehdev.png"
};

export function AppSidebar() {
  const location = useLocation();
  
  const isItemActive = (url: string) => location.pathname.startsWith(url);

  return (
    <Sidebar 
      className="bg-[#f2f7fc]/95 dark:bg-[#0f172a]/95 border-r border-border/40 shadow-sm" 
      collapsible="icon"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton 
                  size="lg" 
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Bot className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">教師學習平台</span>
                    <span className="truncate text-xs">AI 教學助手</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  教育平台
                </DropdownMenuLabel>
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Bot className="size-4 shrink-0" />
                  </div>
                  教師學習平台
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2 opacity-50" disabled>
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Users className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    學生學習平台 (即將推出)
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary/70 dark:text-primary/80 font-medium">主選單</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isItemActive(item.url)}
                    tooltip={item.title}
                    className={isItemActive(item.url) ? "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground" : "hover:bg-sidebar-accent/30"}
                  >
                    <Link to={item.url}>
                      <item.icon className={`size-5 ${isItemActive(item.url) ? "text-primary" : "text-foreground/70"}`} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="bg-[#f2f7fc]/90 dark:bg-[#0f172a]/90 border-t border-border/10">
        <SidebarMenu className="mt-auto">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent/50 data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/30"
                >
                  <Avatar className="h-8 w-8 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                    <AvatarImage
                      src={userData.avatar}
                      alt={userData.name}
                    />
                    <AvatarFallback className="rounded-lg bg-white text-primary font-medium">
                      {userData.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {userData.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {userData.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                      <AvatarImage
                        src={userData.avatar}
                        alt={userData.name}
                      />
                      <AvatarFallback className="rounded-lg bg-white text-primary font-medium">
                        {userData.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userData.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {userData.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="hover:bg-sidebar-accent/30">
                    <User className="mr-2 size-4 text-primary" />
                    個人資料
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-sidebar-accent/30">
                    <Settings className="mr-2 size-4 text-primary" />
                    帳號設定
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-red-500/10 text-red-500">
                  登出
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
} 