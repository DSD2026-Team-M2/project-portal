import { createHashRouter, Outlet } from "react-router-dom";

import { RouterEffects } from "./RouterEffects";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ArchitecturePage } from "../pages/ArchitecturePage";
import { CalendarPage } from "../pages/CalendarPage";
import { DocDetailPage } from "../pages/DocDetailPage";
import { DocsPage } from "../pages/DocsPage";
import { ExamplesPage } from "../pages/ExamplesPage";
import { HomePage } from "../pages/HomePage";
import { LogDetailPage } from "../pages/LogDetailPage";
import { LogsPage } from "../pages/LogsPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProgressPage } from "../pages/ProgressPage";
import { TeamPage } from "../pages/TeamPage";

function RootLayout() {
  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <Header />
      <RouterEffects />
      <Outlet />
      <Footer />
    </div>
  );
}

export const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "progress", element: <ProgressPage /> },
      { path: "logs", element: <LogsPage /> },
      { path: "logs/:slug", element: <LogDetailPage /> },
      { path: "docs", element: <DocsPage /> },
      { path: "docs/:slug", element: <DocDetailPage /> },
      { path: "architecture", element: <ArchitecturePage /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "team", element: <TeamPage /> },
      { path: "examples", element: <ExamplesPage /> },
      { path: "*", element: <NotFoundPage /> }
    ]
  }
]);
