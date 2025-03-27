import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to Our Platform</h1>

      {/* Who We Are Section */}
      <section style={{ marginBottom: '30px' }}>
        <h2>Who We Are</h2>
        <p>
          We are a dedicated team focused on providing the best services for our users. Our platform
          offers a seamless experience for all your needs. Join us and be part of our community!
        </p>
      </section>

      {/* Links to Login and Register */}
      <section>
        <h3>Already have an account?</h3>
        <Link to="/login" style={{ marginRight: '15px', textDecoration: 'none', color: 'blue' }}>
          Login
        </Link>
        <h3>Don't have an account?</h3>
        <Link to="/register" style={{ textDecoration: 'none', color: 'blue' }}>
          Register
        </Link>
      </section>
    </div>
  );
}

export default Home;

