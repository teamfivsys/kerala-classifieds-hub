import { Card, CardContent } from "@/components/ui/card";
import { Search, FileText, MessageCircle, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Listings",
    description: "Search through thousands of verified ads across Kerala",
    step: "01"
  },
  {
    icon: FileText,
    title: "Post Your Ad",
    description: "Create your listing with photos and details in minutes",
    step: "02"
  },
  {
    icon: MessageCircle,
    title: "Connect Safely",
    description: "Chat with buyers/sellers through our secure messaging",
    step: "03"
  },
  {
    icon: CheckCircle,
    title: "Complete Deal",
    description: "Meet locally and complete your transaction safely",
    step: "04"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting started is simple. Follow these easy steps to buy or sell anything in Kerala.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className="relative overflow-hidden group hover:shadow-elevated transition-all duration-300">
                <CardContent className="p-6 text-center">
                  {/* Step Number */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">{step.step}</span>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-xl mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>

                {/* Connector Line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary/50 to-primary/20 z-10" />
                )}
              </Card>
            );
          })}
        </div>

        {/* Trust Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-card max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Why Choose Kerala Classifieds?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">1M+</div>
                <div className="text-sm text-muted-foreground">Happy Users</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-secondary">50K+</div>
                <div className="text-sm text-muted-foreground">Monthly Listings</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-accent">24/7</div>
                <div className="text-sm text-muted-foreground">Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;