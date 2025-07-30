import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, MapPin, Star } from "lucide-react";
import heroImage from "@/assets/kerala-hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Headlines */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Buy & Sell Anything in
              <span className="block text-secondary animate-float">
                God's Own Country
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Kerala's most trusted marketplace. Connect with buyers and sellers across all 14 districts.
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-secondary fill-secondary" />
              <span>1M+ Happy Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>All 14 Districts</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="xl" className="min-w-[200px]">
              <Search className="h-5 w-5" />
              Browse Ads
            </Button>
            <Button variant="cta" size="xl" className="min-w-[200px]">
              Post Your Ad Free
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white max-w-md mx-auto">
              <div className="p-6 text-center">
                <h3 className="font-semibold mb-2">🔒 Safe & Secure</h3>
                <p className="text-sm text-white/80">
                  Verified listings • Secure messaging • Local community trust
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;