import React from "react";

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Your GT Storage Solution</h1>
        <p className="hero-subtitle">
          Seamlessly connect with Georgia Tech students to store your belongings during breaks. Safe, affordable, and
          hassle-free storage solutions.
        </p>
        <button className="btn btn-primary hero-cta">Find Storage Space</button>
      </section>

      <section className="features">
        <h2>Why Choose GT PackUp?</h2>
        <div className="features-grid">
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
            <div key={index} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
