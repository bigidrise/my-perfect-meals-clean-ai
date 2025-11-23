import { Shield, Trash2, Download, Eye, Lock, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import SafePageContainer from "@/components/SafePageContainer";

export default function PrivacySecurity() {
  const [, setLocation] = useLocation();

  return (
        <SafePageContainer className="px-6 pt-8 pb-32 bg-gradient-to-br from-black/60 via-orange-900 to-black/80 text-white space-y-8">

        {/* Back Button */}
        <header className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/profile-sheet")}
            className="text-white bg-white/10 active:bg-white/20 -ml-2 py-3 px-4"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5 mr-3" />
            Back
          </Button>

        <div className="flex items-center gap-4">
          <Shield className="h-7 w-7 text-lime-400" />
          <div>
            <h1 className="text-3xl font-semibold">Privacy & Security</h1>
            <p className="text-white/80 text-base">Manage your privacy and security settings</p>
          </div>
        </div>
      </header>

      <section className="space-y-6">
        <div className="bg-black/40 backdrop-blur-lg p-6 rounded-xl border border-white/10">
          <h2 className="font-semibold mb-2">Data & Storage</h2>
          <p className="text-sm text-white/80 mb-3">
            Control your stored data in My Perfect Meals.
          </p>
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="justify-start border-white/20 bg-white/10 text-white hover:bg-gradient-to-r hover:from-black/60 hover:via-orange-500/30 hover:to-black/60 active:bg-orange-500/40 py-5 px-6 h-auto text-base"
              data-testid="button-export-data"
            >
              <Download className="h-5 w-5 mr-4" /> Export My Data
            </Button>
            <Button
              variant="outline"
              className="justify-start border-white/20 bg-white/10 text-white hover:bg-gradient-to-r hover:from-black/60 hover:via-orange-500/30 hover:to-black/60 active:bg-orange-500/40 py-5 px-6 h-auto text-base"
              data-testid="button-clear-data"
            >
              <Trash2 className="h-5 w-5 mr-4" /> Clear Saved Macros & Meals
            </Button>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-lg p-6 rounded-xl border border-white/10">
          <h2 className="font-semibold mb-2 text-lg">Account Security</h2>
          <p className="text-sm text-white/80 mb-4">
            Manage login methods and secure your account.
          </p>
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="justify-start border-white/20 bg-white/10 text-white hover:bg-gradient-to-r hover:from-black/60 hover:via-orange-500/30 hover:to-black/60 active:bg-orange-500/40 py-5 px-6 h-auto text-base"
              data-testid="button-change-password"
            >
              <Lock className="h-5 w-5 mr-4" /> Change Password
            </Button>
            <Button
              variant="outline"
              className="justify-start border-white/20 bg-white/10 text-white hover:bg-gradient-to-r hover:from-black/60 hover:via-orange-500/30 hover:to-black/60 active:bg-orange-500/40 py-5 px-6 h-auto text-base"
              data-testid="button-manage-accounts"
            >
              <Eye className="h-5 w-5 mr-4" /> Manage Linked Accounts
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
    </SafePageContainer>
  );
}