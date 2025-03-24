import React from "react";

/**
 * Page header component for consistent page headings
 * @param {Object} props - Component props
 * @param {string} props.title - The page title
 * @param {string} props.subtitle - The page subtitle
 */
function PageHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default PageHeader;