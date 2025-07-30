import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Calendar, Phone } from "lucide-react";

// Mock data for recent listings
const recentListings = [
  {
    id: 1,
    title: "2BHK Apartment in Marine Drive",
    price: "₹75,00,000",
    location: "Kochi, Ernakulam",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400",
    category: "Real Estate",
    postedAt: "2 days ago",
    featured: true
  },
  {
    id: 2,
    title: "Maruti Swift VDI 2019",
    price: "₹6,50,000",
    location: "Thiruvananthapuram",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400",
    category: "Automobiles",
    postedAt: "1 day ago",
    featured: false
  },
  {
    id: 3,
    title: "Software Developer Position",
    price: "₹8,00,000/year",
    location: "Technopark, TVM",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4c543ada9?w=400",
    category: "Jobs",
    postedAt: "3 hours ago",
    featured: true
  },
  {
    id: 4,
    title: "iPhone 14 Pro Max 128GB",
    price: "₹1,15,000",
    location: "Kozhikode",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    category: "Electronics",
    postedAt: "5 hours ago",
    featured: false
  },
  {
    id: 5,
    title: "Wedding Photography Services",
    price: "₹50,000",
    location: "Kottayam",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400",
    category: "Services",
    postedAt: "1 day ago",
    featured: false
  },
  {
    id: 6,
    title: "2-Acre Rubber Plantation",
    price: "₹45,00,000",
    location: "Wayanad",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400",
    category: "Real Estate",
    postedAt: "4 days ago",
    featured: true
  }
];

const RecentListings = () => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Recent <span className="text-primary">Listings</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Fresh ads from verified sellers across Kerala
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            View All Listings
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentListings.map((listing) => (
            <Card key={listing.id} className="group overflow-hidden">
              <div className="relative">
                <img 
                  src={listing.image} 
                  alt={listing.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {listing.featured && (
                  <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                    Featured
                  </Badge>
                )}
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="absolute top-3 right-3 bg-white/80 hover:bg-white hover:text-destructive"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <Badge variant="secondary" className="text-xs mb-2">
                      {listing.category}
                    </Badge>
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {listing.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {listing.price}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{listing.postedAt}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button className="flex-1" size="sm">
                      <Phone className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button variant="outline">View All Listings</Button>
        </div>
      </div>
    </section>
  );
};

export default RecentListings;