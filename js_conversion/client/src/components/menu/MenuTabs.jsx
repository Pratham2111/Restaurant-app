import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

/**
 * MenuTabs component for the menu page
 * Displays horizontal tab navigation for menu categories
 * @param {Object} props - Component props
 * @param {Array} props.categories - Menu categories
 * @param {number} props.activeCategory - Currently selected category ID
 * @param {Function} props.onCategoryChange - Category change handler
 */
export const MenuTabs = ({ 
  categories = [], 
  activeCategory, 
  onCategoryChange 
}) => {
  return (
    <ScrollArea className="w-full">
      <Tabs 
        defaultValue={activeCategory.toString()} 
        onValueChange={(value) => onCategoryChange(parseInt(value))}
        className="w-full"
      >
        <TabsList className="w-full justify-start md:justify-center h-auto p-1">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id.toString()}
              className="px-4 py-2 whitespace-nowrap"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <ScrollBar orientation="horizontal" className="h-2" />
    </ScrollArea>
  );
};