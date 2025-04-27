import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = ({ onOpenLoginModal }: { onOpenLoginModal: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
      isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl text-foreground">
                Elsewedy <span className="text-primary">Capstone</span>
              </h1>
            </div>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          {location === "/" ? (
            navLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))
          ) : (
            <Link href="/">
              <a className="font-medium text-foreground hover:text-primary transition-colors">
                Home
              </a>
            </Link>
          )}
        </div>
        
        <div>
          {isAuthenticated ? (
            <Button variant="default" onClick={logout}>
              <i className="ri-logout-box-line mr-2"></i> Sign Out
            </Button>
          ) : (
            <Button variant="default" onClick={onOpenLoginModal}>
              <i className="ri-login-box-line mr-2"></i> Sign In
            </Button>
          )}
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 mt-8">
              {location === "/" ? (
                navLinks.map((link) => (
                  <a 
                    key={link.href} 
                    href={link.href} 
                    className="font-medium text-foreground hover:text-primary transition-colors py-2"
                  >
                    {link.label}
                  </a>
                ))
              ) : (
                <Link href="/">
                  <a className="font-medium text-foreground hover:text-primary transition-colors py-2">
                    Home
                  </a>
                </Link>
              )}
              
              {isAuthenticated ? (
                <Button variant="default" onClick={logout} className="mt-4">
                  <i className="ri-logout-box-line mr-2"></i> Sign Out
                </Button>
              ) : (
                <Button variant="default" onClick={onOpenLoginModal} className="mt-4">
                  <i className="ri-login-box-line mr-2"></i> Sign In
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
