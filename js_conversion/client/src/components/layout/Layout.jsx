import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * Layout component for all pages
 * Provides consistent header and footer
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
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