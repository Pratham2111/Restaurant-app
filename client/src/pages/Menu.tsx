import { MenuTabs } from "@/components/menu/MenuTabs";
import { MENU_SECTION } from "@/lib/constants";

const Menu = () => {
  return (
    <div className="bg-light-cream min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral mb-4">
            Our Menu
          </h1>
          <p className="max-w-2xl mx-auto text-lg">{MENU_SECTION.subheading}</p>
        </div>
        
        <MenuTabs />
      </div>
    </div>
  );
};

export default Menu;
