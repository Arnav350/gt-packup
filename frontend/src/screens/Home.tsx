import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-black bg-clip-text text-transparent leading-tight pb-1">
          Your GT Storage Solution
        </h1>
        <p className="text-xl text-text-gray mb-8 max-w-2xl mx-auto">
          Seamlessly connect with Georgia Tech students to store your belongings during breaks. Safe, affordable, and
          hassle-free storage solutions.
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
