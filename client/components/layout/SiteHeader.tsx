import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Leaf, Activity, LineChart } from "lucide-react";

export function SiteHeader() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <header className={cn("sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60")}> 
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative grid size-8 place-items-center rounded-md bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground shadow-sm">
            <Leaf className="size-4" />
          </div>
          <span className="font-extrabold tracking-tight text-lg">AgriSpectra</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/" className={({ isActive }) => cn("hover:text-primary transition-colors", isActive && "text-primary font-semibold")}>Home</NavLink>
          <NavLink to="/insights" className={({ isActive }) => cn("hover:text-primary transition-colors", isActive && "text-primary font-semibold")}>Insights</NavLink>
          <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          {!isHome && (
            <Link to="/" className="hidden sm:block">
              <Button variant="ghost" className="gap-2"><Waves className="size-4" />Live Demo</Button>
            </Link>
          )}
          <a href="#contact">
            <Button className="gap-2"><Activity className="size-4" /> Request Demo</Button>
          </a>
        </div>
      </div>
    </header>
  );
}
