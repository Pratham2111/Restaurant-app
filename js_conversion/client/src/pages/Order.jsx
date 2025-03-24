import React from "react";
import { MenuTabs } from "@/components/menu/MenuTabs";
import { Cart } from "@/components/order/Cart";
import { ORDER_SECTION } from "@/lib/constants";

const Order = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Order Header */}
      <section className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4 sm:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">{ORDER_SECTION.heading}</h1>
          <p className="max-w-2xl mx-auto">
            {ORDER_SECTION.description}
          </p>
        </div>
      </section>

      {/* Order Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Menu Items (2/3 of page) */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Our Menu</h2>
                <p className="text-gray-700">
                  Select items to add to your order
                </p>
              </div>
              <MenuTabs />
            </div>

            {/* Cart (1/3 of page) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Cart />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Order;