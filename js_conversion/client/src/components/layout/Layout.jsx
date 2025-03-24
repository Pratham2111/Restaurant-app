import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * Main layout component that wraps all pages
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render within the layout
 */
export const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};