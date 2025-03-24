import React from "react";
import { MenuTabs } from "@/components/menu/MenuTabs";
import { MENU_SECTION } from "@/lib/constants";

const Menu = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Menu Header */}
      <section className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4 sm:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">{MENU_SECTION.heading}</h1>
          <p className="max-w-2xl mx-auto">
            {MENU_SECTION.description}
          </p>
        </div>
      </section>

      {/* Menu Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-8">
          <MenuTabs />
        </div>
      </section>
    </div>
  );
};

export default Menu;