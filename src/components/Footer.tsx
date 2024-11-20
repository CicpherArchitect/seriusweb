import React from 'react';
import { Shield, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold text-white">Serius.io</span>
            </div>
            <p className="mt-2 text-sm">
              Next-generation digital forensics and incident response platform.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-100 tracking-wider uppercase">Product</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base hover:text-white">Features</a></li>
              <li><a href="#" className="text-base hover:text-white">Pricing</a></li>
              <li><a href="#" className="text-base hover:text-white">Security</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-100 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base hover:text-white">About</a></li>
              <li><a href="#" className="text-base hover:text-white">Blog</a></li>
              <li><a href="#" className="text-base hover:text-white">Careers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-100 tracking-wider uppercase">Connect</h3>
            <div className="flex space-x-6 mt-4">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-center">
            © {new Date().getFullYear()} Serious Security Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;