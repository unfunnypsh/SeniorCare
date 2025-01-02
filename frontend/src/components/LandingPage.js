import React, { useState } from "react";
import "./LandingPage.css"; // Include a custom CSS file for advanced styles
import { Link } from "react-router-dom";
import Footer from "./extra/Footer";

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
<header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img
            src="https://cdn5.f-cdn.com/contestentries/1596240/28815462/5d78faa6766e4_thumb900.jpg"
            alt="SeniorCare Logo"
            className="logo"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto">
            {["Home", "Services", "About", "Contact"].map((item) => (
              <li className="nav-item" key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="nav-link text-dark font-weight-bold"
                >
                  {item}
                </a>
              </li>
            ))}
            <li className="nav-item">
              <Link to="/login" className="nav-link text-dark font-weight-bold">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

const Hero = () => (
  <section
    id="home"
    className="hero-section d-flex align-items-center justify-content-center text-center text-white"
  >
    <div className="overlay"></div>
    <div className="container position-relative">
      <h1 className="display-4 font-weight-bold">
        Empowering Seniors <br />
        <span className="text-highlight">With Innovative Care</span>
      </h1>
      <p className="lead mt-4">
        Our platform is committed to enhancing the lives of seniors by
        providing tools for activity monitoring, emergency assistance, and
        community engagement.
      </p>
      <div className="mt-4">
      <Link to="/login" className="btn btn-primary btn-lg me-3">
          Get Started
        </Link>
        <button className="btn btn-outline-light btn-lg">Learn More</button>
      </div>
    </div>
  </section>
);

const ServiceCard = ({ imgURL, label, subtext }) => (
  <div className="card text-center shadow-sm">
    <div className="card-body">
      <div className="icon-container bg-primary text-white mx-auto mb-3">
        <img src={imgURL} alt={label} className="icon-img" />
      </div>
      <h5 className="card-title font-weight-bold">{label}</h5>
      <p className="card-text">{subtext}</p>
    </div>
  </div>
);

const Services = () => {
  const serviceList = [
    {
      imgURL: "https://cdn-icons-png.flaticon.com/512/891/891462.png",
      label: "Progress Monitoring",
      subtext: "Track your activity progress with personalized tools.",
    },
    {
      imgURL: "https://cdn-icons-png.flaticon.com/512/4323/4323006.png",
      label: "Emergency Response",
      subtext: "Get fast, reliable help during critical times.",
    },
    {
      imgURL: "https://cdn-icons-png.flaticon.com/512/2140/2140467.png",
      label: "Community Engagement",
      subtext: "Stay connected with supportive community programs.",
    },
  ];

  return (
    <section id="services" className="services-section py-5 bg-light">
      <div className="container">
        <h2 className="text-center font-weight-bold mb-4">Our Services</h2>
        <p className="text-center text-muted mb-5">
          Comprehensive solutions designed to empower seniors, fostering
          independence and well-being.
        </p>
        <div className="row">
          {serviceList.map((service, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => (
  <section id="about" className="about-section py-5 text-center">
    <div className="container">
      <h2 className="font-weight-bold mb-4">About Us</h2>
      <p className="text-muted">
        At SeniorCare, we are dedicated to supporting seniors by offering
        innovative solutions that help them live independently and safely.
      </p>
      <p className="text-muted">
        From health monitoring tools to emergency services, our goal is to
        create a stronger, more connected community.
      </p>
    </div>
  </section>
);

const Reviews = () => {
  const reviews = [
    {
      imgURL:
        "https://t4.ftcdn.net/jpg/04/36/91/23/360_F_436912313_Ja4YugADW8aB6yFm48q3WrQAUhDCu333.jpg",
      customerName: "Mamatha",
      feedback:
        "SeniorCare's services have made it so much easier for me to track my health and stay engaged with the community.",
    },
    {
      imgURL:
        "https://static.vecteezy.com/system/resources/previews/017/440/271/non_2x/cute-old-woman-in-frame-circular-grandmother-in-frame-circular-on-white-background-free-vector.jpg",
      customerName: "Rajiv",
      feedback:
        "I feel more secure knowing I have instant access to emergency assistance when needed.",
    },
  ];

  return (
    <section className="reviews-section py-5 bg-light">
      <div className="container">
        <h2 className="font-weight-bold text-center mb-4">
          What Our Customers Say
        </h2>
        <div className="row">
          {reviews.map((review, index) => (
            <div className="col-md-6 mb-4" key={index}>
              <div className="card shadow-sm text-center">
                <img
                  src={review.imgURL}
                  alt={review.customerName}
                  className="rounded-circle mx-auto mt-4"
                  style={{ width: "80px", height: "80px" }}
                />
                <div className="card-body">
                  <p className="text-muted">{review.feedback}</p>
                  <h5 className="font-weight-bold">{review.customerName}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LandingPage = () => {
  return (
    <main>
      <Nav />
      <Hero />
      <Services />
      <About />
      <Reviews />
      <Footer/>
    </main>
  );
};

export default LandingPage;
