import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/home.css";


// Import feature images (replace with actual paths)
import messagingImage from '../assets/messaging-feature-svg.svg';
import videoConsultImage from '../assets/video-consult-feature-svg.svg';
import medicalRecordsImage from '../assets/medical-records-feature-svg.svg';
import largecoverImage from '../assets/virtual-doctor-platform.svg';
import TeamImage from '../assets/ckc.jpg';

function Home() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Text-Based Consultations",
      description: "Connect with healthcare professionals through secure, real-time messaging. Get medical advice without leaving your home.",
      image: messagingImage
    },
    {
      title: "Video Consultations",
      description: "Face-to-face virtual appointments with certified doctors. Comprehensive healthcare at your fingertips.",
      image: videoConsultImage
    },
    {
      title: "Secure Medical Records",
      description: "Your health information is private and protected. Easily access and manage your medical history online.",
      image: medicalRecordsImage
    }
  ];

  const teamMembers = [
    {
      name: "Christian Chesire",
      role: "Lead Developer",
      linkedin: "https://www.linkedin.com/in/christian-chesire-6326b719a/",
      github: "https://github.com/ckchesire/virtual_doctor",
      twitter: "https://x.com/christian_40378"
    },
  ];

  return (
    <div className="home-page">
      {/* Navigation Header */}
      <header className="navigation-header">
        <div className="logo"></div>
        <nav>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#team">Team</a></li>
          </ul>
        </nav>
      </header>

      {/* Intro Section */}
      <section className="intro-section">
        <div className="intro-content">
          <h1>Virtual Doctor</h1>
          <p>Revolutionizing Healthcare Through Seamless Virtual Consultations</p>
          <a 
            href="/register" 
            target="/register" 
            rel="noopener noreferrer" 
            className="cta-button"
          >
            Get Started
          </a>
        </div>
        <div className="intro-image">
          {/* Large cover image */}
          <img src={largecoverImage} alt="Virtual Doctor Platform" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2>Our Key Features</h2>
        <div className="features-container">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className={`feature-card ${activeFeature === index ? 'active' : ''}`}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <img src={feature.image} alt={feature.title} />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <h2>Our Journey</h2>
        <div className="about-content">
          <p>
            The idea for Virtual Doctor was born during a challenging period in my life when accessing 
            healthcare became increasingly difficult. As someone living in a remote area, I experienced 
            firsthand the struggles of getting timely medical consultations.
          </p>
          <p>
            In 2023, after witnessing the limitations of traditional healthcare delivery, I embarked on 
            a mission to create a platform that would bridge the gap between patients and healthcare 
            professionals. This project, developed as part of my Portfolio Project for the 
            <a href="https://www.alxafrica.com/" target="_blank" rel="noopener noreferrer"> ALX Software Engineering Program</a>, 
            represents my commitment to making healthcare more accessible and convenient.
          </p>
          <a 
            href="https://github.com/ckchesire/virtual_doctor" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="github-link"
          >
            View Project Repository
          </a>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="team-section">
        <h2>Meet the Team</h2>
        <div className="team-members">
          {teamMembers.map((member) => (
            <div key={member.name} className="team-member">
              <img src={TeamImage} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <div className="social-links">
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href={member.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href={member.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2024 Virtual Doctor. All rights reserved.</p>
        <p>A Portfolio Project for ALX Software Engineering Program</p>
      </footer>
    </div>
  );
}

export default Home;