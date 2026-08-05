import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
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
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return (
    <Switch>
      <Route path={"\u002f"} component={Home} />
      <Route path={"\u002fsearch"} component={SearchBooks} />
      <Route path={"\u002fbooks\u002f:slug"} component={BookDetail} />
      <Route path={"\u002fbooks\u002f:bookId\u002freviews"} component={Reviews} />
      <Route path={"\u002fauthors\u002f:userId"} component={AuthorProfile} />
      <Route path={"\u002fpublishers\u002f:publisherId"} component={PublisherProfile} />
      <Route path={"\u002fbookstores\u002f:bookstoreId"} component={BookstoreProfile} />
      <Route path={"\u002fadmin"} component={AdminDashboard} />
      <Route path={"\u002forders"} component={Orders} />
      <Route path={"\u002fadvertisements"} component={AdvertisementManagement} />
      <Route path={"\u002ffeatured-listings"} component={FeaturedListingManagement} />
      <Route path={"\u002fsubscriptions"} component={Subscriptions} />
      <Route path={"\u002fpayments"} component={PaymentManagement} />
      <Route path={"\u002fadmin"} component={AdminDashboard} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
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
