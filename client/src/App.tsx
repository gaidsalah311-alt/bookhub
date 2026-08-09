import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Browse from "@/pages/Browse";
import Profile from "@/pages/Profile";
import BookDetail from "@/pages/BookDetail";
import SearchBooks from "@/pages/SearchBooks";
import AddBook from "@/pages/AddBook";
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
import ReportsManagement from "@/pages/ReportsManagement";
import { InfoPage, FaqPage } from "@/pages/InfoPages";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() { return <Switch>
  <Route path="/" component={Home} /><Route path="/browse" component={Browse} /><Route path="/search" component={SearchBooks} /><Route path="/books/:slug" component={BookDetail} /><Route path="/books/:bookId/reviews" component={Reviews} /><Route path="/add-book" component={AddBook} />
  <Route path="/authors/:userId" component={AuthorProfile} /><Route path="/publishers/:publisherId" component={PublisherProfile} /><Route path="/bookstores/:bookstoreId" component={BookstoreProfile} /><Route path="/profile" component={Profile} />
  <Route path="/admin" component={AdminDashboard} /><Route path="/admin/reports" component={ReportsManagement} /><Route path="/dashboard" component={AdminDashboard} /><Route path="/orders" component={Orders} /><Route path="/advertisements" component={AdvertisementManagement} /><Route path="/featured-listings" component={FeaturedListingManagement} /><Route path="/subscriptions" component={Subscriptions} /><Route path="/payments" component={PaymentManagement} /><Route path="/payment-test" component={PaymentTest} /><Route path="/categories" component={Browse} /><Route path="/publishers" component={() => <Browse />} />
  <Route path="/about" component={() => <InfoPage type="about" />} /><Route path="/contact" component={() => <InfoPage type="contact" />} /><Route path="/privacy" component={() => <InfoPage type="privacy" />} /><Route path="/terms" component={() => <InfoPage type="terms" />} /><Route path="/copyright" component={() => <InfoPage type="copyright" />} /><Route path="/faq" component={FaqPage} /><Route path="/publisher-signup" component={() => <InfoPage type="about" />} /><Route path="/library-signup" component={() => <InfoPage type="about" />} /><Route component={NotFound} />
</Switch>; }

export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
