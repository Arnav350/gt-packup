import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const plans = [
    {
      name: "PackUp",
      price: "$80",
      description: "Perfect for students who need help packing and unpacking",
      features: [
        "Professional packing assistance",
        "Unpacking service at destination",
        "Packing materials provided",
        "Loading/unloading assistance",
        "2-hour service window",
      ],
      recommended: false,
      isCustom: false,
    },
    {
      name: "Secure Store",
      price: "$325",
      description: "Ideal for pre-packed items needing storage over break",
      features: [
        "Pickup from your location",
        "Secure storage facility",
        "Climate-controlled storage",
        "Return delivery after break",
        "Basic insurance coverage",
        "Online storage tracking",
      ],
      recommended: true,
      isCustom: false,
    },
    {
      name: "Full Move",
      price: "$425",
      description: "Complete end-to-end solution",
      features: [
        "Professional packing service",
        "All packing materials included",
        "Transportation to storage",
        "Secure storage during break",
        "Return delivery",
        "Complete unpacking service",
        "Premium insurance coverage",
      ],
      recommended: false,
      isCustom: false,
    },
    {
      name: "Custom Plan",
      price: "Variable",
      description: "Build your perfect storage solution",
      features: [
        "Choose your services",
        "Flexible scheduling",
        "Pay only for what you need",
        "Custom insurance options",
        "Personalized service plan",
      ],
      recommended: false,
      isCustom: true,
    },
  ];

  const handlePlanSelect = (plan: any) => {
    if (!user) {
      navigate("/login");
      return;
    }

    navigate("/booking", {
      state: {
        planName: plan.name,
        price: plan.price,
      },
    });
  };

  return (
    <div className="py-16 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-semibold mb-4">Storage Solutions</h1>
      <p className="text-xl text-text-gray mb-12 max-w-2xl mx-auto">Choose the service that fits your needs</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-xl border ${
              plan.recommended ? "border-primary border-2 shadow-lg transform md:scale-105" : "border-border-gray"
            } 
                       flex flex-col p-6 relative transition-all duration-300 hover:border-primary`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                Most Popular
              </div>
            )}

            <h2 className="text-2xl font-medium mb-4">{plan.name}</h2>

            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-lg">~{plan.price}</span>
              {!plan.isCustom && <span className="text-text-gray">/year</span>}
            </div>

            <p className="text-text-gray mb-6 text-sm">{plan.description}</p>

            <ul className="text-left text-sm mb-8 flex-grow">
              {plan.features.map((feature) => (
                <li key={feature} className="mb-3 flex items-start">
                  <span className="text-primary font-bold mr-2">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`btn ${plan.isCustom ? "btn-secondary" : "btn-primary"} mt-auto`}
              onClick={() => handlePlanSelect(plan)}
            >
              {plan.isCustom ? "Contact Us" : "Select Plan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
