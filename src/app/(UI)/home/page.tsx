import Image from "next/image";
import ServiceSteps from "./services";
import AboutSection from "./about";
import ContactSection from "./contact";
import Footer from "./footer";
import AnimatedHeroImage from "./image";
import WhoWeAre from "./about";

export default function HeroSection() {
  return (
    <>
      <div className="lg:text-left sm:text-center lg:mx-[6.75rem] ">
        <div className="grid md:grid-cols-2 gap-8 items-center  sm:px-[0px]">
          <div className="space-y-6">
            <p className="text-[#00B5D8] uppercase tracking-wider text-sm font-medium">
              Welcome to the Al-Ameri General Practice
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              General <span className="text-[#00B5D8]">Practice</span> In
              <br />
              Rorschacherberg
            </h1>
            <p className="text-gray-600 text-lg ">
              We are a family-run practice in Rorschacherberg and value
              professionalism, reliability and empathy.
            </p>
            <button className="bg-[#00B5D8] text-white px-8 py-3 rounded-md hover:bg-[#00a0c0] transition-colors">
              Get Started
            </button>
          </div>
          <div className="relative">
            {/* Main image container with background decoration */}
            <AnimatedHeroImage />
            {/* Chat bubble decoration */}
            <div className="absolute top-4 right-4 bg-[#00B5D8] p-3 rounded-lg">
              <div className="w-8 h-8 bg-white rounded-md"></div>
            </div>
            {/* Calendar decoration */}
            <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg">
              <div className="w-8 h-8 bg-gray-100 rounded-md"></div>
            </div>
            {/* Customer count badge */}
          </div>
        </div>
      </div>
      <ServiceSteps />
      <div>
        <WhoWeAre />
        <ContactSection />
      </div>

      <Footer />
    </>
  );
}
