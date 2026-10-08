import MplLogo from "@/components/MplLogo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <MplLogo className="h-20 w-16 mb-4" />
      <h1 className="sports-heading text-5xl sm:text-7xl text-accent mb-2">404</h1>
      <p className="text-xl sm:text-2xl font-bold mb-2 text-foreground">Page Not Found</p>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button asChild className="btn-hero h-11 px-6 font-bold">
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
