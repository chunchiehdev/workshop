import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { BotsPage } from "@/pages/bots/BotsPage";
import { CreateBotPage } from "@/pages/bots/CreateBotPage";
import { TasksPage } from "@/pages/tasks/TasksPage";
import { RecordsPage } from "@/pages/records/RecordsPage";
import { ClassesPage } from "@/pages/classes/ClassesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bots" element={<BotsPage />} />
          <Route path="bots/create" element={<CreateBotPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="records" element={<RecordsPage />} />
          <Route path="classes" element={<ClassesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;