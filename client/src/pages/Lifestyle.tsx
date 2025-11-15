import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import { Info, Activity, Users } from 'lucide-react';
import LifestyleGuidedTour from '@/components/guided/LifestyleGuidedTour';

const Lifestyle = ({ user }) => { // Assuming 'user' is passed as a prop to check role
  const setLocation = (path) => {
    // This function needs to be defined or imported if it's used elsewhere.
    // For this example, we'll assume it's a placeholder for navigation.
    console.log("Navigating to:", path);
    // In a real app, you'd use history.push(path) or navigate(path)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <LifestyleGuidedTour />
      {/* Main Content */}
      <div className="flex-1 px-4 py-8 pt-20">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Info Banner */}
          <div className="rounded-2xl p-[1px] bg-gradient-to-r from-orange-500/50 via-orange-500/40 to-orange-500/50 animate-pulse">
            <div className="rounded-2xl bg-orange-900/20 backdrop-blur-lg px-4 py-3 border border-orange-500/30">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-orange-300 font-semibold text-sm mb-1">Explore Your Lifestyle Tools</div>
                  <div className="text-white/80 text-sm">
                    Each section below contains specialized meal planning and nutrition tools. Click any card to explore, and look for the orange info button inside each feature to learn how to use it.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supplement Hub Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b-0">
              <CardTitle tag="h5" className="text-white">Supplement Hub</CardTitle>
            </CardHeader>
            <CardBody>
              <CardText className="text-white/70 mb-4">
                Optimize your nutrition with personalized supplement recommendations.
              </CardText>
              <Link to="/supplement-hub">
                <Button color="primary" className="bg-blue-600 hover:bg-blue-700">
                  Go to Supplement Hub
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* Kids Meals Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b-0">
              <CardTitle tag="h5" className="text-white">Kids Meals</CardTitle>
            </CardHeader>
            <CardBody>
              <CardText className="text-white/70 mb-4">
                Nutritious and fun meal ideas for your children.
              </CardText>
              <Link to="/kids-meals">
                <Button color="primary" className="bg-green-600 hover:bg-green-700">
                  Go to Kids Meals
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* The Hub Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b-0">
              <CardTitle tag="h5" className="text-white">The Hub</CardTitle>
            </CardHeader>
            <CardBody>
              <CardText className="text-white/70 mb-4">
                Your central place for all things health and wellness.
              </CardText>
              <Link to="/the-hub">
                <Button color="primary" className="bg-purple-600 hover:bg-purple-700">
                  Go to The Hub
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* Toddlers and Kids Meals Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b-0">
              <CardTitle tag="h5" className="text-white">Toddlers and Kids Meals</CardTitle>
            </CardHeader>
            <CardBody>
              <CardText className="text-white/70 mb-4">
                Specially curated meal plans for toddlers and growing kids.
              </CardText>
              <Link to="/toddlers-and-kids-meals">
                <Button color="primary" className="bg-pink-600 hover:bg-pink-700">
                  Go to Toddlers and Kids Meals
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* Diabetic Nutrition Hub Card (Existing) */}
          <button
            onClick={() => setLocation("/diabetic-hub")}
            className="bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 hover:bg-black/40 transition-all relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 pointer-events-none" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-medium text-white">Diabetic Nutrition Hub</h3>
                <p className="text-white/80 text-sm">Track blood sugar & diabetic meals</p>
              </div>
            </div>
          </button>

          {(user?.role === 'doctor' || user?.role === 'coach' || user?.role === 'trainer') && (
            <button
              onClick={() => setLocation("/procare/patient-assignment")}
              className="bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 hover:bg-black/40 transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-medium text-white">Patient Assignment Dashboard</h3>
                  <p className="text-white/80 text-sm">Manage patient guardrails & monitoring</p>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lifestyle;