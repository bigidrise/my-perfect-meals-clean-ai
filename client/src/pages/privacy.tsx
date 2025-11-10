
import { Shield, Trash2, Download, Eye, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function PrivacySecurity() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-black/60 via-orange-900 to-black/80 text-white space-y-6">
      <header className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => setLocation("/profile")}
          className="text-white hover:text-white hover:bg-white/10 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
        
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-lime-400" />
          <div>
            <h1 className="text-2xl font-semibold">Privacy & Security</h1>
            <p className="text-white/80">Manage your privacy and security settings</p>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div className="bg-black/40 backdrop-blur-lg p-4 rounded-xl border border-white/10">
          <h2 className="font-semibold mb-2">Data & Storage</h2>
          <p className="text-sm text-white/80 mb-3">
            Control your stored data in My Perfect Meals.
          </p>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="justify-start border-white/20 text-white hover:bg-white/10">
              <Download className="h-4 w-4 mr-2" /> Export My Data
            </Button>
            <Button variant="outline" className="justify-start border-white/20 text-white hover:bg-white/10">
              <Trash2 className="h-4 w-4 mr-2" /> Clear Saved Macros & Meals
            </Button>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-lg p-4 rounded-xl border border-white/10">
          <h2 className="font-semibold mb-2">Account Security</h2>
          <p className="text-sm text-white/80 mb-3">
            Manage login methods and secure your account.
          </p>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="justify-start border-white/20 text-white hover:bg-white/10">
              <Lock className="h-4 w-4 mr-2" /> Change Password
            </Button>
            <Button variant="outline" className="justify-start border-white/20 text-white hover:bg-white/10">
              <Eye className="h-4 w-4 mr-2" /> Manage Linked Accounts
            </Button>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-lg p-4 rounded-xl border border-white/10">
          <h2 className="font-semibold mb-2">Privacy Policy</h2>
          <p className="text-sm text-white/80 mb-3">
            Review how My Perfect Meals handles and protects your data.
          </p>
          <a
            href="/privacy-policy"
            className="text-lime-400 underline hover:text-lime-300"
          >
            View Privacy Policy
          </a>
        </div>
      </section>
    </div>
  );
}
