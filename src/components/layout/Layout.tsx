import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full max-w-full overflow-hidden">
        <Header />
        <main className="flex-1 w-full overflow-y-auto">
          <Outlet />
        </main>
        <footer className="border-t py-4">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} 教師與學生學習平台
          </div>
        </footer>
      </div>
    </div>
  );
} 