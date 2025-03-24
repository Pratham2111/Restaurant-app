import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * Layout component that wraps all pages
 * Provides consistent header and footer across the site
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 */
export const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};