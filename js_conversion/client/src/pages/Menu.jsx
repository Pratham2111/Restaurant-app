import { useQuery } from "@tanstack/react-query";
import { MenuTabs } from "../components/menu/MenuTabs";
import { MENU_SECTION } from "../lib/constants";

const Menu = () => {
  // Fetch all categories
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Fetch all menu items
  const { data: menuItems = [] } = useQuery({
    queryKey: ["/api/menu-items"],
  });

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      {/* Menu header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{MENU_SECTION.title}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {MENU_SECTION.description}
        </p>
      </div>

      {/* Menu items organized by category */}
      <MenuTabs categories={categories} menuItems={menuItems} />
    </div>
  );
};

export default Menu;