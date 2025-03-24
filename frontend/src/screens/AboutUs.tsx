import React from "react";

const AboutUs = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-black bg-clip-text text-transparent">
          About GT PackUp
        </h1>
        <p className="text-xl text-text-gray max-w-2xl mx-auto">
          Making student storage simple, affordable, and hassle-free
        </p>
      </section>

      <section className="space-y-12">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
          <p>
            GT PackUp was founded by Georgia Tech students who experienced firsthand the challenges of storing
            belongings during semester breaks. We understand the unique needs of college students and have created a
            solution that makes the moving and storage process seamless.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
          <p>
            We aim to provide Georgia Tech students with convenient, reliable, and affordable storage solutions while
            fostering a supportive community of students helping students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <h3 className="text-4xl text-primary font-bold mb-2">100+</h3>
            <p className="text-lg">Students Served</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <h3 className="text-4xl text-primary font-bold mb-2">100%</h3>
            <p className="text-lg">GT Students</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <h3 className="text-4xl text-primary font-bold mb-2">24/7</h3>
            <p className="text-lg">Support</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Contact</h2>
          <p>Phone Number: 407-574-7000</p>
          <p>Email: apatel3018@gatech.edu</p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
