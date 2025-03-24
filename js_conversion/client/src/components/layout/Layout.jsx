import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * Layout component for consistent page structure
 * Wraps all pages with header and footer
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 */
export const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />
      
      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};