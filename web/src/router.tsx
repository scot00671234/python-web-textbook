import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./layouts/AppShell";
import { LearnLayout } from "./layouts/LearnLayout";
import { HomePage } from "./pages/HomePage";
import { LearnIndexPage } from "./pages/LearnIndexPage";
import { FlashcardsPage } from "./pages/FlashcardsPage";
import { PythonInPlainEnglishPage } from "./pages/PythonInPlainEnglishPage";
import { LessonPage } from "./pages/LessonPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SearchPage } from "./pages/SearchPage";
import { BlogIndexPage } from "./pages/BlogIndexPage";
import { BlogArticlePage } from "./pages/BlogArticlePage";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/blog", element: <BlogIndexPage /> },
      { path: "/blog/:slug", element: <BlogArticlePage /> },
      { path: "/search", element: <SearchPage /> },
      {
        path: "/learn",
        element: <LearnLayout />,
        children: [
          { index: true, element: <LearnIndexPage /> },
          { path: "flashcards", element: <FlashcardsPage /> },
          { path: "python-in-plain-english", element: <PythonInPlainEnglishPage /> },
          { path: ":slug", element: <LessonPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
