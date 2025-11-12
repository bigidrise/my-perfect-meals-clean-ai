
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProPortal() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen p-4 text-white bg-gradient-to-br from-black/60 via-indigo-600 to-black/80">
      <div className="max-w-5xl mx-auto space-y-6 pt-2">
        <button
          onClick={() => setLocation("/dashboard")}
          className="mb-4 w-12 h-12 rounded-2xl bg-black/10 hover:bg-black/20 active:bg-black/20 flex items-center justify-center transition-colors shrink-0 overflow-hidden"
        >
          <ArrowLeft className="h-4 w-4 text-white shrink-0" />
        </button>

        <Card className="bg-black/20 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Pro Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-white/80">Professional features coming soon.</p>
              <Button
                onClick={() => setLocation("/pro/clients")}
                className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20"
              >
                View Clients
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
