import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set the end date to 7 days from now
    const endDate = new Date(2025, 3, 2);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const plans = [
    {
      name: "PackUp",
      price: "$90",
      originalPrice: "$100",
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
      price: "$425",
      originalPrice: "$475",
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
      price: "$525",
      originalPrice: "$580",
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
      originalPrice: null,
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
      navigate("/register", {
        state: {
          fromPricing: true,
          planName: plan.name,
          price: plan.price,
        },
      });
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
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold">🎉 Limited Time Offer!</span>
            <span className="text-text-gray">Get 10% off all plans</span>
          </div>
          <div className="text-sm text-text-gray">
            Time remaining: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </div>
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-semibold mb-4">Storage Solutions</h1>
      <p className="text-xl text-text-gray mb-4 max-w-2xl mx-auto">Choose the service that fits your needs</p>
      <div className="space-y-2 text-text-gray mb-12 max-w-2xl mx-auto">
        <p className="text-sm">Don't worry - you can change you plan later</p>
        <p className="text-sm">These prices are estimates - we'll provide a final cost after the free inspection</p>
        <p className="text-sm">No payment required now - you'll only pay after confirming the final cost</p>
      </div>

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
              {plan.originalPrice ? (
                <>
                  <span className="text-lg text-primary">~{plan.price}</span>
                  <span className="text-text-gray line-through">{plan.originalPrice}</span>
                  {!plan.isCustom && <span className="text-text-gray">/year</span>}
                </>
              ) : (
                <span className="text-lg">{plan.price}</span>
              )}
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
              {plan.isCustom ? "Contact Us" : "Continue"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
