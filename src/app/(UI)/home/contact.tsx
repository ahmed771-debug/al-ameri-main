"use client";

import { Button } from "@nextui-org/react";
import Image from "next/image";

export default function ContactSection() {
  return (
    <>
      {/* How To Find Us Section */}
      <section className="bg-[#00B5D8] py-16 text-white text-center ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            How To Find Us
          </h2>
          <div className="max-w-2xl mx-auto space-y-2 mb-8 text-sm md:text-base">
            <p>
              We are also happy to welcome you to our practice in our own large
              number of parking spaces.
            </p>
            <p>
              Barrier - free access to the building and a large elevator are
              also available.
            </p>
            <p>Bus stop (Line 242) directly at the practice</p>
            <p>Arrival by car (parking in front of the door)</p>
            <p>Train/S-Bahn (5 min away)</p>
            <p>Tram/U-Bahn (station at 5 min away)</p>
          </div>
          <Button
            variant="shadow"
            className="bg-transparent border-light text-white hover:bg-white hover:text-[#00B5D8] transition-colors border "
          >
            View Practice & Team
          </Button>
        </div>
      </section>

      {/* Appointment Section */}
      <div className=" mx-auto sm:px-3 lg:py-8 lg:px-[6.75rem] mb-5 p-3">
        <div className="flex justify-between items-center">
          <div className="relative md:w-[85%]">
            <h1 className="lg:text-4xl font-bold">
              <span className="text-gray-800">MAKE AN</span>{" "}
              <span className="text-cyan-500">APPOINMENT</span>
            </h1>
            <div className="absolute -bottom-4 left-0 w-full h-0.5 bg-gray-200" />
          </div>
          <div>
            <h2 className="lg:text-2xl text-gray-800 font-bold">
              Consult with our Doctor
            </h2>
          </div>
        </div>
      </div>
      <section className="lg:py-16 lg:px-[2.75rem] px-3 mb-5">
        <div className="  lg:px-4">
          <div className="lg:grid md:grid-cols-2 lg:gap-12">
            {/* Left Column */}
            <div className="relative lg:w-[28.875rem] sm:w-[18rem] sm:mx-auto  mb-3 ">
              <div className="relative aspect-[4/5] w-full sm:hidden lg:block">
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <Image
                    src="/image.svg"
                    alt="Doctor profile"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Teal accent shape */}
                <div className="absolute -left-7 -bottom-4 w-32 h-[85%] bg-cyan-500 rounded-lg -z-10"></div>
              </div>
            </div>

            {/* Right Column */}
            <div className="">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B5D8]"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B5D8]"
                      placeholder="+123 4567 890"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B5D8]"
                    placeholder="example@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Doctor</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B5D8]"
                    required
                  >
                    <option value="">Dr. Mark Davis</option>
                    <option value="">Dr. Sarah Johnson</option>
                    <option value="">Dr. Michael Brown</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Message</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B5D8] h-32"
                    placeholder="Write your message..."
                    required
                  ></textarea>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" required />
                  <label>You agree to our friendly privacy policy.</label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#00B5D8] text-white py-3 rounded-md hover:bg-[#00a0c0] transition-colors"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
