import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import ShopPage from "../pages/shop/page";
import AboutPage from "../pages/about/page";
import ContactPage from "../pages/contact/page";
import CustomerServicePage from "../pages/customer-service/page";
import BlogPage from "../pages/blog/page";
import ProductPage from "../pages/product/page";
import CheckoutPage from "../pages/checkout/page";
import CheckoutResultPage from "../pages/checkout/result";
import TermsPage from "../pages/legal/terms";
import PrivacyPage from "../pages/legal/privacy";
import ReturnsPage from "../pages/legal/returns";
import WarrantyActivationPage from "../pages/warranty/page";
// New pages
import AuthPage from "../pages/auth/page";
import AccountPage from "../pages/account/page";
import BusinessPage from "../pages/business/page";
import AccessibilityStatementPage from "../pages/legal/accessibility-statement";
import SeriesPage from "../pages/series/page";
import WishlistPage from "../pages/wishlist/page";
import ComparePage from "../pages/compare/page";
import AmbercomPage from "../pages/ambercom/page";

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/shop", element: <ShopPage /> },
  { path: "/shop/:category", element: <ShopPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/customer-service", element: <CustomerServicePage /> },
  { path: "/blog", element: <BlogPage /> },
  { path: "/product/:id", element: <ProductPage /> },
  { path: "/checkout", element: <CheckoutPage /> },
  { path: "/checkout/result", element: <CheckoutResultPage /> },
  { path: "/terms", element: <TermsPage /> },
  { path: "/privacy", element: <PrivacyPage /> },
  { path: "/returns", element: <ReturnsPage /> },
  { path: "/warranty-activation", element: <WarrantyActivationPage /> },
  // Auth
  { path: "/auth", element: <AuthPage /> },
  { path: "/login", element: <AuthPage /> },
  { path: "/register", element: <AuthPage /> },
  // Account
  { path: "/my-account", element: <AccountPage /> },
  // Business
  { path: "/business", element: <BusinessPage /> },
  // Legal / service
  { path: "/accessibility-statement", element: <AccessibilityStatementPage /> },
  // Collections
  { path: "/series", element: <SeriesPage /> },
  // Wishlist & Compare
  { path: "/wishlist", element: <WishlistPage /> },
  { path: "/compare", element: <ComparePage /> },
  // Brand pages
  { path: "/ambercom", element: <AmbercomPage /> },
  // 404
  { path: "*", element: <NotFound /> },
];

export default routes;
