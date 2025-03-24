import { Layout } from "../components/layout/Layout";
import { MenuTabs } from "../components/menu/MenuTabs";

/**
 * Menu page component
 * Displays the restaurant's menu items organized by categories
 */
function Menu() {
  return (
    <Layout>
      {/* Page header */}
      <div className="bg-muted/50 py-10 lg:py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our exquisite selection of dishes crafted with fresh, locally
            sourced ingredients. Each item represents our chef's passion for
            culinary excellence.
          </p>
        </div>
      </div>
      
      {/* Menu items by category */}
      <MenuTabs />
      
      {/* Additional info */}
      <div className="container py-8 mb-10">
        <div className="bg-muted/30 rounded-xl p-6 lg:p-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="font-semibold text-lg mb-2">Dietary Requirements</h3>
              <p className="text-muted-foreground text-sm">
                Please inform your server of any dietary restrictions or allergies.
                Many dishes can be modified to accommodate your needs.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Locally Sourced</h3>
              <p className="text-muted-foreground text-sm">
                We partner with local farmers and suppliers to ensure the freshest,
                highest quality ingredients in all our dishes.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Chef's Recommendations</h3>
              <p className="text-muted-foreground text-sm">
                Items marked as "Featured" are our chef's special recommendations and
                seasonal specialties you won't want to miss.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Menu;