import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Profile from "./pages/Profile";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"\\"} component={Home} />
      <Route path="/browse" component={Browse} />
      <Route path="/search" component={() => <div className="container py-20"><h1>نتائج البحث</h1></div>} />
      <Route path="/categories" component={() => <div className="container py-20"><h1>التصنيفات</h1></div>} />
      <Route path="/publishers" component={() => <div className="container py-20"><h1>الناشرون</h1></div>} />
      <Route path="/dashboard" component={() => <div className="container py-20"><h1>لوحة التحكم</h1></div>} />
      <Route path="/profile" component={Profile} />
      <Route path="/publisher-signup" component={() => <div className="container py-20"><h1>تسجيل ناشر</h1></div>} />
      <Route path="/library-signup" component={() => <div className="container py-20"><h1>تسجيل مكتبة</h1></div>} />
      <Route path="/about" component={() => <div className="container py-20"><h1>عن المنصة</h1></div>} />
      <Route path="/contact" component={() => <div className="container py-20"><h1>اتصل بنا</h1></div>} />
      <Route path="/privacy" component={() => <div className="container py-20"><h1>سياسة الخصوصية</h1></div>} />
      <Route path="/terms" component={() => <div className="container py-20"><h1>شروط الاستخدام</h1></div>} />
      <Route path="/copyright" component={() => <div className="container py-20"><h1>حقوق النشر</h1></div>} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
