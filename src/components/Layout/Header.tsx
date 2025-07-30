import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Heart, Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/Auth/AuthModal";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-primary">Kerala</div>
          <div className="text-2xl font-bold text-secondary">Classifieds</div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for cars, mobile phones, real estate, jobs..."
              className="pl-10 h-10"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/dashboard')}
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/dashboard')}
              >
                <User className="h-5 w-5" />
              </Button>
              <Button 
                variant="cta" 
                className="hidden sm:flex"
                onClick={() => navigate('/post-ad')}
              >
                <Plus className="h-4 w-4" />
                Post Ad
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setAuthModalTab('signin');
                  setIsAuthModalOpen(true);
                }}
              >
                <User className="h-5 w-5" />
              </Button>
              <Button 
                variant="cta" 
                className="hidden sm:flex"
                onClick={() => {
                  setAuthModalTab('signup');
                  setIsAuthModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                Post Ad
              </Button>
            </>
          )}
        </div>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </header>
  );
};

export default Header;