import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-white/50 backdrop-blur-md">
      <div className="site-container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-green to-brand-light flex items-center justify-center shadow-md">
            <span className="text-white font-bold">EH</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1E293B]">EduHire</p>
            <p className="text-xs text-gray-500">Connecting students with opportunity</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <a href="#" className="text-gray-600 hover:text-[#2C5F34] transition-colors"><Github /></a>
          <a href="#" className="text-gray-600 hover:text-[#2C5F34] transition-colors"><Linkedin /></a>
          <a href="mailto:hello@eduhire.example" className="text-gray-600 hover:text-[#2C5F34] transition-colors"><Mail /></a>
        </div>

        <div className="text-sm text-gray-500">© {new Date().getFullYear()} EduHire. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
