import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMenuItemSchema } from "@shared/schema";
import { PageSection } from "@/components/ui/page-section";
import { usePagination } from "@/hooks/use-pagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import type { Category, MenuItem } from "@shared/schema";
import { Switch } from "@/components/ui/switch";

export default function MenuManagement() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertMenuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      categoryId: 0,
      imageUrl: "",
      isSpecial: false,
      nutritionInfo: [],
      ingredients: [],
      chefsStory: "",
      preparationTime: "",
      spicyLevel: "",
      allergens: [],
      servingSize: ""
    }
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!dialogOpen) {
      form.reset({
        name: "",
        description: "",
        price: "",
        categoryId: 0,
        imageUrl: "",
        isSpecial: false,
        nutritionInfo: [],
        ingredients: [],
        chefsStory: "",
        preparationTime: "",
        spicyLevel: "",
        allergens: [],
        servingSize: ""
      });
      setEditingItem(null);
    }
  }, [dialogOpen, form]);

  const { data: categories, isLoading: loadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"]
  });

  const { data: menuItems, isLoading: loadingItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"]
  });

  const addItemMutation = useMutation({
    mutationFn: async (data: any) => {
      const menuItemData = {
        ...data,
        categoryId: Number(data.categoryId),
        price: data.price.toString(),
        nutritionInfo: data.nutritionInfo.filter(Boolean),
        ingredients: data.ingredients.filter(Boolean),
        allergens: data.allergens.filter(Boolean)
      };

      const res = await apiRequest("POST", "/api/menu-items", menuItemData);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to add menu item');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({
        title: "Success",
        description: "Menu item has been added successfully."
      });
      setDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add menu item. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const menuItemData = {
        ...data,
        categoryId: Number(data.categoryId),
        price: data.price.toString(),
        nutritionInfo: data.nutritionInfo.filter(Boolean),
        ingredients: data.ingredients.filter(Boolean),
        allergens: data.allergens.filter(Boolean)
      };

      const res = await apiRequest("PATCH", `/api/menu-items/${id}`, menuItemData);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update menu item');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({
        title: "Success",
        description: "Menu item has been updated successfully."
      });
      setDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update menu item. Please try again.",
        variant: "destructive"
      });
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/menu-items/${id}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete menu item');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({
        title: "Success",
        description: "Menu item has been deleted successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete menu item. Please try again.",
        variant: "destructive"
      });
    }
  });

  function onSubmit(data: any) {
    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem.id, data });
    } else {
      addItemMutation.mutate(data);
    }
  }

  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    form.reset({
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.categoryId,
      imageUrl: item.imageUrl,
      isSpecial: item.isSpecial,
      nutritionInfo: item.nutritionInfo || [],
      ingredients: item.ingredients || [],
      chefsStory: item.chefsStory || "",
      preparationTime: item.preparationTime || "",
      spicyLevel: item.spicyLevel || "",
      allergens: item.allergens || [],
      servingSize: item.servingSize || ""
    });
    setDialogOpen(true);
  };

  if (loadingCategories || loadingItems) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-restaurant-yellow" />
      </div>
    );
  }

  const filteredItems = menuItems?.filter(
    item => selectedCategory === "all" || item.categoryId === parseInt(selectedCategory)
  );

  const pagination = usePagination({
    totalItems: filteredItems?.length || 0,
    itemsPerPage: 8
  });

  const paginatedItems = filteredItems?.slice(
    pagination.startIndex,
    pagination.endIndex
  );

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: any, index: number) => {
    const newValue = e.target.value;
    const currentArray = field.value || [];
    const newArray = [...currentArray];
    newArray[index] = newValue;
    field.onChange(newArray);
  };

  const addArrayItem = (field: any) => {
    const currentArray = field.value || [];
    field.onChange([...currentArray, ""]);
  };

  const removeArrayItem = (field: any, index: number) => {
    const currentArray = field.value || [];
    const newArray = currentArray.filter((_: any, i: number) => i !== index);
    field.onChange(newArray);
  };

  return (
    <div className="w-full">
      <PageSection className="bg-background py-8">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(Number(value))}
                            value={field.value ? field.value.toString() : ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories?.map(category => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isSpecial"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Special Dish</FormLabel>
                            <FormDescription>
                              Mark this item as a special dish to feature it on the home page
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="chefsStory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chef's Story</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share the story behind this dish..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preparationTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preparation Time</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 25-30 minutes"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="spicyLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spicy Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select spiciness level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Not Spicy">Not Spicy</SelectItem>
                              <SelectItem value="Mild">Mild</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Hot">Hot</SelectItem>
                              <SelectItem value="Extra Hot">Extra Hot</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="servingSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Serving Size</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 1 person"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ingredients"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ingredients</FormLabel>
                          <div className="space-y-2">
                            {(field.value || []).map((ingredient: string, index: number) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  value={ingredient}
                                  onChange={(e) => handleArrayInputChange(e, field, index)}
                                  placeholder={`Ingredient ${index + 1}`}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => removeArrayItem(field, index)}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => addArrayItem(field)}
                              className="w-full"
                            >
                              Add Ingredient
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nutritionInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nutrition Information</FormLabel>
                          <div className="space-y-2">
                            {(field.value || []).map((info: string, index: number) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  value={info}
                                  onChange={(e) => handleArrayInputChange(e, field, index)}
                                  placeholder={`Nutrition info ${index + 1}`}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => removeArrayItem(field, index)}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => addArrayItem(field)}
                              className="w-full"
                            >
                              Add Nutrition Info
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allergens"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allergens</FormLabel>
                          <div className="space-y-2">
                            {(field.value || []).map((allergen: string, index: number) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  value={allergen}
                                  onChange={(e) => handleArrayInputChange(e, field, index)}
                                  placeholder={`Allergen ${index + 1}`}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => removeArrayItem(field, index)}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => addArrayItem(field)}
                              className="w-full"
                            >
                              Add Allergen
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={addItemMutation.isPending || updateItemMutation.isPending}
                    >
                      {(addItemMutation.isPending || updateItemMutation.isPending) ? (
                        <span className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {editingItem ? "Updating..." : "Adding..."}
                        </span>
                      ) : (
                        editingItem ? "Update Menu Item" : "Add Menu Item"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Menu Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories?.map(category => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    {paginatedItems?.map(item => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{item.name}</h3>
                                {item.isSpecial && (
                                  <span className="text-xs bg-restaurant-yellow/20 text-restaurant-yellow px-2 py-1 rounded">
                                    Special
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {item.description}
                              </p>
                              <p className="text-sm font-medium mt-1">
                                ${Number(item.price).toFixed(2)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditClick(item)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the menu item.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteItemMutation.mutate(item.id)}
                                      disabled={deleteItemMutation.isPending}
                                    >
                                      {deleteItemMutation.isPending ? (
                                        <span className="flex items-center">
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Deleting...
                                        </span>
                                      ) : (
                                        "Delete"
                                      )}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {filteredItems && filteredItems.length > 0 && (
                    <div className="mt-6">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={pagination.prevPage}
                              className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => pagination.goToPage(page)}
                                isActive={pagination.currentPage === page}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={pagination.nextPage}
                              className={
                                pagination.currentPage === pagination.totalPages
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageSection>
    </div>
  );
}