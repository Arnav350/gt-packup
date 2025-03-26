import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-4">
      <section className="text-center py-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-black bg-clip-text text-transparent leading-tight pb-2">
          Your GT Storage Solution
        </h1>
        <p className="text-xl text-text-gray mb-8 max-w-2xl mx-auto">
          Affordable and reliable storage for Georgia Tech students — transport, store, and move your belongings with
          ease over summer break.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/pricing" className="btn btn-primary inline-flex items-center justify-center px-8">
            Find Storage Space
          </Link>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-secondary inline-flex items-center justify-center px-8">
              Register
            </Link>
          )}
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-medium text-center mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-8">
          {[
            {
              step: "1",
              title: "Plan",
              description: "Select a storage plan and schedule a free room inspection.",
            },
            {
              step: "2",
              title: "Inspection",
              description: "We will check your items, provide a final price, and confirm your plan.",
            },
            {
              step: "3",
              title: "Confirm",
              description: "Choose a convenient move-out date and make your payment.",
            },
            {
              step: "4",
              title: "GT PackUp",
              description: "We will pack, transport, store, and return your items to your new room.",
            },
          ].map((step, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm border border-border-gray hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl">{step.title}</h3>
              </div>
              <p className="text-text-gray">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 bg-gray-50 rounded-2xl">
        <h2 className="text-3xl font-medium text-center mb-6">Price Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 md:px-8 max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-border-gray">
            <h3 className="text-2xl font-medium mb-6 text-center">Do It Yourself</h3>
            <ul className="space-y-4 text-text-gray">
              <li className="flex items-center">
                <span className="text-red-500 mr-2">✕</span>
                Moving supplies: $40-100
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-2">✕</span>
                Truck Rental: $100-140 * 2
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-2">✕</span>
                Storage: $50-150/month
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-2">✕</span>
                Hidden Fees: $60-400
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-2">✕</span>
                Time and effort: Priceless
              </li>
            </ul>
            <div className="mt-8 text-center">
              <p className="text-2xl font-bold text-red-500">$500-1380+</p>
              <p className="text-sm text-text-gray">Total estimated cost</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-primary">
            <h3 className="text-2xl font-medium mb-6 text-center">GT PackUp</h3>
            <ul className="space-y-4 text-text-gray">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                All-inclusive service
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Professional packing
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Secure storage
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Insurance provided
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                No effort needed
              </li>
            </ul>
            <div className="mt-8 text-center">
              <p className="text-2xl font-bold text-primary">Avg. cost $438</p>
              <p className="text-sm text-text-gray">All-inclusive</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl py-16 my-8">
        <h2 className="text-3xl font-medium text-center mb-12">Why Choose GT PackUp?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-8">
          {[
            {
              icon: "💰",
              title: "Student Prices",
              description: "Affordable rates designed for student budgets with discounts and group packages",
            },
            {
              icon: "🤝",
              title: "GT Community",
              description: "Tailored for Georgia Tech students by Georgia Tech students",
            },
            {
              icon: "✅",
              title: "All Inclusive",
              description: "Will take care of the entire process from packing to storage to signing out your room",
            },
            {
              icon: "⚡",
              title: "Flexible Options",
              description: "Choose from various service levels to match your specific wants and needs",
            },
            {
              icon: "📱",
              title: "Easy Booking",
              description: "Simple booking process and flexible schedule options",
            },
            {
              icon: "🏠",
              title: "Local Storage",
              description: "Nearby storage in case of any last-minute plans or changes",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm border border-border-gray hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-4xl mb-6 block">{feature.icon}</span>
              <h3 className="text-xl mb-4">{feature.title}</h3>
              <p className="text-text-gray">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
