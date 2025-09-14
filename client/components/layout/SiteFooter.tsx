import { Leaf } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-md bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground">
              <Leaf className="size-4" />
            </div>
            <span className="font-extrabold tracking-tight text-lg">AgriSpectra</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">AI-powered monitoring of crop health, soil condition, and pest risks using multispectral and hyperspectral imaging with in-field sensors.</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold mb-3">Product</p>
          <ul className="space-y-2 text-muted-foreground">
            <li><a className="hover:text-foreground" href="/">Home</a></li>
            <li><a className="hover:text-foreground" href="/insights">Insights</a></li>
          </ul>
        </div>
        <div className="text-sm" id="contact">
          <p className="font-semibold mb-3">Contact</p>
          <p className="text-muted-foreground">hello@agrispectra.ai</p>
          <p className="text-muted-foreground">+1 (555) 0199-274</p>
        </div>
      </div>
      <div className="border-t py-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} AgriSpectra. All rights reserved.</div>
    </footer>
  );
}
