import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Home, Car, Briefcase, Heart, Wrench, ShoppingBag, 
  GraduationCap, Smartphone, ArrowRight 
} from "lucide-react";

const categories = [
  {
    icon: Home,
    name: "Real Estate",
    count: "2,847",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Car,
    name: "Automobiles",
    count: "1,923",
    color: "text-accent",
    bgColor: "bg-accent/10"
  },
  {
    icon: Briefcase,
    name: "Jobs",
    count: "4,156",
    color: "text-secondary",
    bgColor: "bg-secondary/10"
  },
  {
    icon: Heart,
    name: "Matrimonial",
    count: "892",
    color: "text-destructive",
    bgColor: "bg-destructive/10"
  },
  {
    icon: Smartphone,
    name: "Electronics",
    count: "3,421",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Wrench,
    name: "Services",
    count: "1,567",
    color: "text-accent",
    bgColor: "bg-accent/10"
  },
  {
    icon: ShoppingBag,
    name: "For Sale",
    count: "2,890",
    color: "text-secondary",
    bgColor: "bg-secondary/10"
  },
  {
    icon: GraduationCap,
    name: "Education",
    count: "743",
    color: "text-kerala-gold",
    bgColor: "bg-kerala-gold/10"
  }
];

const Categories = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Browse by <span className="text-primary">Categories</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find exactly what you're looking for in our organized categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.name}
                className="group cursor-pointer hover:scale-105 transition-spring"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full ${category.bgColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-spring`}>
                    <IconComponent className={`h-8 w-8 ${category.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {category.count} ads
                  </p>
                  <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;