import React from "react";
import "./Footer.css"; // Add a separate CSS for footer styles if necessary

const Footer = () => (
  <footer className="footer bg-dark text-white py-5">
    <div className="container">
      <div className="row">
        <div className="col-md-4 mb-4">
          <h5 className="font-weight-bold">SeniorCare</h5>
          <p className="footer-description">
            Empowering seniors with innovative care solutions to promote independence and well-being.
          </p>
        </div>
        <div className="col-md-4 mb-4">
          <h5 className="font-weight-bold">Quick Links</h5>
          <ul className="list-unstyled">
            <li><a href="#home" className="text-white">Home</a></li>
            <li><a href="#services" className="text-white">Services</a></li>
            <li><a href="#about" className="text-white">About Us</a></li>
            <li><a href="#contact" className="text-white">Contact</a></li>
            <li><a href="/privacy-policy" className="text-white">Privacy Policy</a></li>
            <li><a href="/terms-of-service" className="text-white">Terms of Service</a></li>
          </ul>
        </div>
        <div className="col-md-4 mb-4">
          <h5 className="font-weight-bold">Contact Us</h5>
          <p>
            Email: <a href="mailto:support@seniorcare.com" className="text-white">support@seniorcare.com</a>
          </p>
          <p>Phone: +1 (800) 123-4567</p>
          <p>Address: 123 SeniorCare St., Suite 100, City, Country</p>
        </div>
      </div>

      <hr className="footer-divider" />
      
      <div className="text-center mt-4">
        <p>&copy; {new Date().getFullYear()} SeniorCare. All Rights Reserved.</p>
        <p>Follow us on <a href="https://twitter.com" className="text-primary">Twitter</a>, <a href="https://facebook.com" className="text-primary">Facebook</a>, and <a href="https://instagram.com" className="text-primary">Instagram</a>.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
