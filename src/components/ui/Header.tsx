"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@nextui-org/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full px-4 sm:px-6">
      <div className="lg:mx-auto lg:max-w-7xl py-5">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center text-xl font-semibold text-gray-900"
            >
              <Image src="/Frame.png" alt="Logo" width={35} height={35} />
              <span className="font-bold ml-2 lg:text-2xl md:text-xl">
                Al-Ameri GmbH
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center lg:w-[60%] sm:w-full justify-evenly">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Start
            </Link>
            <Link
              href="/al-ameri"
              className="text-gray-600 hover:text-gray-900"
            >
              M.Al-Ameri
            </Link>
            <Link
              href="/services"
              className="text-gray-600 hover:text-gray-900"
            >
              Services
            </Link>
            <Link
              href="/directions"
              className="text-gray-600 hover:text-gray-900"
            >
              Directions
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About Us
            </Link>
            <Link
              href="/appointment"
              className="rounded-md bg-[#0BB6CE] px-4 py-2 text-sm font-medium text-white hover:bg-[#00a69b] focus:outline-none focus:ring-2 focus:ring-[#00BFB3] focus:ring-offset-2"
            >
              Appointment
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00BFB3]"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <hr className="bg-[#0BB6CE]" />

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="space-y-1 px-4 pb-3 pt-2">
          <Link
            href="/"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            Start
          </Link>
          <Link
            href="/al-ameri"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            M.Al-Ameri
          </Link>
          <Link
            href="/services"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            Services
          </Link>
          <Link
            href="/directions"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            Directions
          </Link>
          <Link
            href="/contact"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            Contact
          </Link>
          <Link
            href="/about"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            About Us
          </Link>
          <Button
            href="/appointment"
            className="mt-4 block rounded-md bg-[#0BB6CE] px-4 py-2 text-center text-base font-medium text-white hover:bg-[#00a69b]"
          >
            Appointment
          </Button>
        </div>
      </div>
    </nav>
  );
}
