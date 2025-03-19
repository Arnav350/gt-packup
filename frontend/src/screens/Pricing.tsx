import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

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
      setShowAuthModal(true);
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
    <div className="pricing-container">
      <h1>Storage Solutions</h1>
      <p className="pricing-subtitle">Choose the service that fits your needs</p>
      <div className="pricing-grid">
        {plans.map((plan) => (
          <div key={plan.name} className={`pricing-card ${plan.recommended ? "recommended" : ""}`}>
            {plan.recommended && <div className="recommended-badge">Most Popular</div>}
            <h2>{plan.name}</h2>
            <div className="price">
              ~{plan.price}
              {!plan.isCustom && <span className="price-period">/year</span>}
            </div>
            <p className="plan-description">{plan.description}</p>
            <ul className="feature-list">
              {plan.features.map((feature) => (
                <li key={feature}>
                  <span className="check-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`btn ${plan.isCustom ? "btn-secondary" : "btn-primary"}`}
              onClick={() => handlePlanSelect(plan)}
            >
              {plan.isCustom ? "Contact Us" : "Select Plan"}
            </button>
          </div>
        ))}
      </div>

      {showAuthModal && (
        <AuthModal type="login" onClose={() => setShowAuthModal(false)} onSuccess={() => navigate("/booking")} />
      )}
    </div>
  );
};

export default Pricing;
