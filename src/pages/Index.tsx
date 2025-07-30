import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Hero from "@/components/Home/Hero";
import Categories from "@/components/Home/Categories";
import RecentListings from "@/components/Home/RecentListings";
import HowItWorks from "@/components/Home/HowItWorks";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Categories />
        <RecentListings />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;