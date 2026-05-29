import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-white/5">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-6">
            <AlertCircle className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-display text-foreground mb-2">404 Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Button asChild className="w-full">
            <Link href="/">Return Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
