import React from 'react';

// Footer component displayed at the bottom of every page
const Footer = () => (
  <footer style={styles.footer}>
    {/* Dynamically shows the current year */}
    <p>© {new Date().getFullYear()} MyShop. All rights reserved.</p>
  </footer>
);

// Inline styles for the footer
const styles = {
  footer: {
    marginTop: '2rem',           // Adds spacing above the footer
    padding: '1rem',             // Padding inside the footer
    backgroundColor: '#f1f1f1',  // Light gray background
    textAlign: 'center'          // Center-aligns the text
  }
};

export default Footer;
