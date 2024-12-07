import { Facebook, Twitter, Linkedin, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#00B5D8] text-white py-3">
      <div className="mx-auto lg:px-[6.75rem] ">
        {/* Main Footer Content */}
        {/* Separator Line */}
        <div className="border-t border-white my-6"></div>
        <div className="grid md:grid-cols-2 gap-8 mb-8 md:py-7">
          {/* Logo Section */}
          <div className="text-center">
            <div className="flex justify-center mt-8">
              <Image
                src="/Logo.svg"
                alt="Doctor profile"
                width={70}
                height={70}
              />
            </div>

            <h2 className="lg:text-2xl font-bold">Al-Ameri GmbH</h2>
          </div>

          {/* Contact Info */}
          <div className="px-3 mb-3">
            <div className="flex items-center mb-3">
              <MapPin className="w-5 h-5 mr-3" />
              <span>
                Arztpraxis Al-Ameri GmbH Seebleichestrasse 60 9404
                Rorschacherberg
              </span>
            </div>

            <div className="md:flex gap-6 mb-3">
              <div className="flex items-center space-x-2 mb-3">
                <Phone className="w-5 h-5 mr-3" />
                <span>+49 40 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 mr-3" />
                <span>info@al-ameri.com</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-4">
              <p>Social Media:</p>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        {/* Separator Line */}
        <div className="border-t border-white/20 my-6"></div>
        <div className="flex flex-col md:flex-row justify-between items-center text-sm px-3">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="hover:underline">
              CONTACT
            </a>
            <a href="#" className="hover:underline">
              TERMS & CONDITIONS
            </a>
            <a href="#" className="hover:underline">
              DATA PROTECTION
            </a>
          </div>
          <div>© 2024 Al-Ameri GmbH</div>
        </div>
      </div>
    </footer>
  );
}
