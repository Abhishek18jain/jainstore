import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you have react-router-dom installed

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Section 1: Company Info / Branding */}
        <div className="md:col-span-1">
          <h3 className="text-2xl font-bold text-white mb-4">मेरी दुकान</h3>
          <p className="text-sm">
            Your trusted partner in managing your Kirana business efficiently.
            Simplify operations, track stock, and grow your shop.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white transition-colors">Dashboard</Link></li>
            <li><Link to="/inventory" className="hover:text-white transition-colors">Inventory</Link></li>
            <li><Link to="/reports" className="hover:text-white transition-colors">Reports</Link></li>
            <li><Link to="/settings" className="hover:text-white transition-colors">Settings</Link></li>
          </ul>
        </div>

        {/* Section 3: Connect With Us */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
          <ul className="space-y-2">
            <li><a href="/" className="flex items-center hover:text-white transition-colors"><span className="mr-2">📧</span> Email Us</a></li>
            <li><a href="/" className="flex items-center hover:text-white transition-colors"><span className="mr-2">📞</span> Call Us</a></li>
            <li><a href="/" className="flex items-center hover:text-white transition-colors"><span className="mr-2">📍</span> Find Us</a></li>
          </ul>
          {/* Social Media Icons - Placeholder SVGs */}
          <div className="flex space-x-4 mt-4">
            <a href="/" className="text-gray-400 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
            <a href="/" className="text-gray-400 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.064 10.158c.18 1.936-1.574 5.376-4.992 5.376-2.31 0-4.14-.972-4.97-2.333-.403-1.096-.242-2.8.599-3.92.502-.68.868-1.53.868-2.618 0-.964-.303-1.636-.831-2.073.743-.13 1.488.083 1.967.246.33-.872.936-1.558 1.624-2.083-.759.043-1.536.012-2.239.124-.956.148-1.734.567-2.345 1.258-.291-.044-.582-.093-.865-.138-.431-.07-.797-.03-1.07.113-.745.385-1.121 1.25-.929 2.059.274 1.139.782 1.343 1.328 1.383-.346.065-.679.083-1.02.049-1.066-.109-1.85-.758-2.05-1.921-.194-1.144.175-2.062.659-2.585-.05-.008-.098-.018-.147-.027-.899-.174-1.644-.067-2.204.383-.324.258-.567.653-.701 1.098-.109.35-.157.73-.178 1.12-.03.58.07 1.157.309 1.673.684 1.48 2.066 2.404 3.731 2.651 1.189.178 2.378-.052 3.528-.152.05.008.098.019.146.028 1.139.197 2.09-.434 2.454-1.652.279-.938.077-1.847-.19-2.639.467.065.882.02 1.229-.089z"/></svg></a>
            <a href="/" className="text-gray-400 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-2v-3.337c0-.534-.011-1.222-.749-1.222-.747 0-1.293.585-1.293 1.185v3.374h-2v-6h2v1.166h.031c.441-.749 1.542-1.549 3.065-1.549 3.271 0 3.873 2.153 3.873 4.968v3.408z"/></svg></a>
          </div>
        </div>

        {/* Section 4: Contact Info */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
          <p className="text-sm">
            123 Kirana Marg, <br />
            Shopkeeper Nagar, <br />
            Pin Code - 123456 <br />
            India
          </p>
          <p className="mt-2">Phone: +91 98765 43210</p>
          <p>Email: info@meridukaan.com</p>
        </div>
      </div>

      {/* Bottom Bar: Copyright */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} मेरी दुकान. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;