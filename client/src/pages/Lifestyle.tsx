import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import { Info } from 'lucide-react';

const Lifestyle = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
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
        </div>
      </div>
    </div>
  );
};

export default Lifestyle;