import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Star,
  DollarSign,
  ChefHat,
  Utensils,
  Coffee,
  Wine,
  Clock
} from "lucide-react";
import { MenuItemPopup } from "@/components/restaurant/RestaurantPopups";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image?: string;
  popular?: boolean;
  available: boolean;
  prepTime: number;
  rating: number;
  tags: string[];
}

export default function MenuManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Grilled Salmon Fillet",
      price: 28.99,
      category: "Main Courses",
      description: "Fresh Atlantic salmon grilled to perfection with herbs and lemon butter",
      popular: true,
      available: true,
      prepTime: 20,
      rating: 4.8,
      tags: ["gluten-free", "healthy", "seafood"]
    },
    {
      id: 2,
      name: "Truffle Pasta Carbonara",
      price: 24.99,
      category: "Main Courses", 
      description: "Classic Italian pasta with truffle cream sauce, pancetta, and parmesan",
      popular: false,
      available: true,
      prepTime: 15,
      rating: 4.6,
      tags: ["vegetarian-option", "italian", "creamy"]
    },
    {
      id: 3,
      name: "Caesar Salad Supreme",
      price: 16.99,
      category: "Appetizers",
      description: "Crispy romaine lettuce with house-made croutons, parmesan, and caesar dressing",
      popular: true,
      available: true,
      prepTime: 10,
      rating: 4.4,
      tags: ["vegetarian", "fresh", "classic"]
    },
    {
      id: 4,
      name: "Chocolate Lava Cake",
      price: 12.99,
      category: "Desserts",
      description: "Warm chocolate cake with molten center, served with vanilla ice cream",
      popular: true,
      available: true,
      prepTime: 12,
      rating: 4.9,
      tags: ["chocolate", "warm", "indulgent"]
    },
    {
      id: 5,
      name: "Craft Beer Selection",
      price: 8.99,
      category: "Beverages",
      description: "Local craft beer rotating selection, ask server for today's options",
      popular: false,
      available: true,
      prepTime: 2,
      rating: 4.3,
      tags: ["alcoholic", "local", "craft"]
    },
    {
      id: 6,
      name: "Wagyu Beef Burger",
      price: 32.99,
      category: "Light Meals",
      description: "Premium wagyu beef patty with aged cheddar, truffle aioli, and brioche bun",
      popular: true,
      available: false,
      prepTime: 18,
      rating: 4.7,
      tags: ["premium", "beef", "gourmet"]
    }
  ];

  const categories = ["All", "Appetizers", "Main Courses", "Light Meals", "Desserts", "Beverages", "Specials"];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Appetizers":
        return <Utensils className="w-4 h-4" />;
      case "Main Courses":
        return <ChefHat className="w-4 h-4" />;
      case "Desserts":
        return <Star className="w-4 h-4" />;
      case "Beverages":
        return <Coffee className="w-4 h-4" />;
      case "Light Meals":
        return <Wine className="w-4 h-4" />;
      default:
        return <Utensils className="w-4 h-4" />;
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalItems: menuItems.length,
    popularItems: menuItems.filter(item => item.popular).length,
    unavailableItems: menuItems.filter(item => !item.available).length,
    avgPrice: menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Menu Management
            </h1>
            <p className="text-muted-foreground mt-2">Manage your restaurant's menu items and categories</p>
          </div>
          <MenuItemPopup
            trigger={
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                <Plus className="w-4 h-4 mr-2" />
                Add New Item
              </Button>
            }
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-accent/5">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <ChefHat className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-accent/5">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-yellow-500/10 rounded-xl">
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Popular Items</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.popularItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-accent/5">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <Clock className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unavailable</p>
                  <p className="text-2xl font-bold text-red-600">{stats.unavailableItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-accent/5">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Price</p>
                  <p className="text-2xl font-bold text-green-600">${stats.avgPrice.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="flex space-x-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category !== "All" && getCategoryIcon(category)}
                    <span className={category !== "All" ? "ml-2" : ""}>{category}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {item.name}
                      </CardTitle>
                      {item.popular && (
                        <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-200">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {getCategoryIcon(item.category)}
                        <span className="ml-1">{item.category}</span>
                      </Badge>
                      <Badge 
                        variant={item.available ? "outline" : "destructive"}
                        className="text-xs"
                      >
                        {item.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</p>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{item.prepTime} min</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{item.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <MenuItemPopup
                    isEdit={true}
                    item={item}
                    trigger={
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    }
                  />
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No items found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}