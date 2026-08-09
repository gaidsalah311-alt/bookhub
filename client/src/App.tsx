import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Browse from "@/pages/Browse";
import Profile from "@/pages/Profile";
import BookDetail from "@/pages/BookDetail";
import SearchBooks from "@/pages/SearchBooks";
import AuthorProfile from "@/pages/AuthorProfile";
import PublisherProfile from "@/pages/PublisherProfile";
import BookstoreProfile from "@/pages/BookstoreProfile";
import AdminDashboard from "@/pages/AdminDashboard";
import Reviews from "@/pages/Reviews";
import Orders from "@/pages/Orders";
import AdvertisementManagement from "@/pages/AdvertisementManagement";
import FeaturedListingManagement from "@/pages/FeaturedListingManagement";
import Subscriptions from "@/pages/Subscriptions";
import PaymentManagement from "@/pages/PaymentManagement";
import PaymentTest from "@/pages/PaymentTest";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function StaticPage({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <main className="container py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      {children ?? <p className="text-muted-foreground">هذه الصفحة قيد الإعداد.</p>}
    </main>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/browse" component={Browse} />
      <Route path="/search" component={SearchBooks} />
      <Route path="/books/:slug" component={BookDetail} />
      <Route path="/books/:bookId/reviews" component={Reviews} />
      <Route path="/authors/:userId" component={AuthorProfile} />
      <Route path="/publishers/:publisherId" component={PublisherProfile} />
      <Route path="/bookstores/:bookstoreId" component={BookstoreProfile} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/dashboard" component={AdminDashboard} />
      <Route path="/orders" component={Orders} />
      <Route path="/advertisements" component={AdvertisementManagement} />
      <Route path="/featured-listings" component={FeaturedListingManagement} />
      <Route path="/subscriptions" component={Subscriptions} />
      <Route path="/payments" component={PaymentManagement} />
      <Route path="/payment-test" component={PaymentTest} />
      <Route path="/categories" component={Browse} />
      <Route path="/publishers" component={() => <StaticPage title="الناشرون" />} />
      <Route path="/publisher-signup" component={() => <StaticPage title="تسجيل ناشر" />} />
      <Route path="/library-signup" component={() => <StaticPage title="تسجيل مكتبة" />} />
      <Route path="/about" component={() => <StaticPage title="عن BookHub" />} />
      <Route path="/contact" component={() => <StaticPage title="اتصل بنا" />} />
      <Route path="/privacy" component={() => <StaticPage title="سياسة الخصوصية" />} />
      <Route path="/terms" component={() => <StaticPage title="شروط الاستخدام" />} />
      <Route path="/copyright" component={() => <StaticPage title="حقوق النشر" />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
