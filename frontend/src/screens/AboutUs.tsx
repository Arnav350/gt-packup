const AboutUs = () => {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>About GT PackUp</h1>
        <p className="about-subtitle">Making student storage simple, affordable, and hassle-free</p>
      </section>

      <section className="about-content">
        <div className="about-section">
          <h2>Our Story</h2>
          <p>
            GT PackUp was founded by Georgia Tech students who experienced firsthand the challenges of storing
            belongings during semester breaks. We understand the unique needs of college students and have created a
            solution that makes the moving and storage process seamless.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            We aim to provide Georgia Tech students with convenient, reliable, and affordable storage solutions while
            fostering a supportive community of students helping students.
          </p>
        </div>
        <div className="about-grid">
          <div className="about-stat">
            <h3>100+</h3>
            <p>Students Served</p>
          </div>
          <div className="about-stat">
            <h3>100%</h3>
            <p>GT Students</p>
          </div>
          <div className="about-stat">
            <h3>24/7</h3>
            <p>Support</p>
          </div>
        </div>
        <div className="about-section">
          <h2>Contact</h2>
          <p>Phone Number: 407-574-7000</p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
