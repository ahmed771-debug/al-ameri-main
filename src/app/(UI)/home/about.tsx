import { Button } from "@nextui-org/react";
import Image from "next/image";
import Hedaer from "./header";

export default function AboutSection() {
  const services = [
    {
      title: "preventive consulting",
      description:
        "With our advanced fresh tech, your treatment experience will be smooth and comfortable.",
      icon: "/01.svg",
    },
    {
      title: "Check up blood and urine analysis",
      description:
        "Our advanced check up like blood test, DNA analysis, food intolerance test and many more will be analyzed",
      icon: "/02.svg",
    },
    {
      title: "ECG",
      description:
        "30+ years of experience in dental implant with specialist care. You will be able to smile with confidence again.",
      icon: "/03.svg",
    },
    {
      title: "24-hour blood pressure measurement",
      description:
        "We help to re-design your smile and shape your teeth to create a customised smile for your face!",
      icon: "/04.svg",
    },
    {
      title: <div className="mt-7">pulmonary function test</div>,
      description: (
        <div className="mt-4">
          We help is to charge your smile and make it last with a trusted
          commitment that you can rely on.
        </div>
      ),

      icon: "/05.svg",
    },
    {
      title: "wound care",
      description:
        "Transform you beautiful spine to publish online with painless, single appointment treatment.",
      icon: "/06.svg",
    },
  ];

  return (
    <div className="mx-auto  lg:py-16">
      {/* Who We Are Section */}
      <div className=" mx-auto px-4 lg:px-[6.75rem]">
        {/* Header Section */}
        <Hedaer />

        {/* Content Section */}
        <section className="lg:grid md:grid-cols-2 md:gap-12 justify-between items-center">
          <div className="relative md:w-full flex-shrink-0">
            <div className="relative aspect-[4/5] w-full sm:hidden lg:block">
              <div className="absolute inset-0 rounded-lg overflow-hidden max-h-[33.375rem] m-auto">
                <Image
                  src="/Image.png"
                  alt="Muwafaq Al-Ameri, General Practitioner"
                  fill
                />
              </div>
            </div>
          </div>

          <div className=" justify-between sm:h-auto  bg-[#E4FCFF] rounded-lg p-6 md:p-8">
            <h4 className="text-xl font-semibold mb-4">Muwafaq Al-Ameri</h4>
            <div className="space-y-4 text-gray-600">
              Welcome to our website! My name is Muwafaq Al-Ameri, and from
              September 2024 my wife and I will be taking over the general
              practice at Seebleichestrasse 60.
              <br />
                As a specialist in internal medicine, trained at the Martin
              Luther University and with experience in an anthroposophical
              hospital in Berlin, I bring with me comprehensive medical
              knowledge and a great passion for patient care.
              <br />
              ​ In our practice, the focus is on people. I place particular
              value on a trusting doctor-patient relationship and take the time
              to fully understand your concerns and find the best possible
              treatment together.
              <br />
              ​ I look forward to getting to know you personally and welcoming
              you to our practice. Together we will work for your health
              <br />
              <br />– with commitment, care and heart
            </div>
          </div>
        </section>
      </div>

      {/* Key Features Section */}
      <div className="space-y-12 lg:px-[6.75rem]">
        <header className=" mx-auto px-4 py-8">
          <div className="flex justify-between items-end">
            <div className="relative md:w-[80%] ">
              <h1 className="lg:text-[3.375rem] font-bold">
                <span className="text-gray-800">What Makes Us More</span>{" "}
                <span className="text-gray-800 block ">Special</span>
              </h1>
              <div className="absolute -bottom-4 left-0 w-full h-0.5 bg-gray-200" />
            </div>
            <div>
              <h2 className="lg:text-[2.5rem] text-gray-800 font-semibold">
                KEY &nbsp;
                <span className=" font-bold lg:text-4xl  text-cyan-500">
                  FEATURE
                </span>
              </h2>
            </div>
          </div>
        </header>

        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:px-[6.75rem]">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-[#E4FCFF] rounded-xl p-6 transition-transform hover:scale-105 mx-auto text-center max-h-[18rem]"
            >
              <div className="flex justify-center">
                <Image
                  src={service.icon}
                  alt=""
                  width={108}
                  height={108}
                  className="mb-4"
                />
              </div>

              <h4 className="text-lg font-semibold mb-2 capitalize">
                {service.title}
              </h4>

              <div className="text-gray-600 lg:text-[.75rem]">
                {service.description}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button className="bg-[#00B5D8] hover:bg-[#00a0c0] text-white px-8">
            See All
          </Button>
        </div>
      </div>
    </div>
  );
}

// import Image from "next/image";

// export default function WhoWeAre() {
//   return (
//     <div className="container mx-auto px-4 py-12 md:py-16">
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row justify-between items-start mb-12">
//         <h2 className="text-3xl md:text-4xl font-semibold">
//           <span className="text-gray-800">WHO</span>{" "}
//           <span className="text-cyan-500">WE ARE</span>
//         </h2>
//         <h3 className="text-2xl md:text-3xl text-gray-800 mt-4 md:mt-0">
//           Our Glorious <span className="block md:inline">History</span>
//         </h3>
//       </div>

//       {/* Content Section */}
//       <div className="flex flex-col md:flex-row gap-8 md:gap-12">
//         {/* Image Container */}
//         <div className="relative w-full md:w-1/3">
//           <div className="relative aspect-[4/5] w-full">
//             <div className="absolute inset-0 bg-gray-200 rounded-lg overflow-hidden">
//               <Image
//                 src="/placeholder.svg"
//                 alt="Doctor profile"
//                 fill
//                 className="object-cover"
//                 sizes="(max-width: 768px) 100vw, 33vw"
//               />
//             </div>
//             {/* Teal accent shape */}
//             <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-cyan-500 rounded-lg -z-10"></div>
//           </div>
//         </div>

//         {/* Text Content */}
//         <div className="w-full md:w-2/3">
//           <div className="bg-sky-50 rounded-lg p-6 md:p-8">
//             <h4 className="text-xl font-semibold mb-4">Muwafaq Al-Ameri</h4>
//             <div className="<space-y-4 text-gray-600">
//               <p>
//                 Welcome to our website! My name is Muwafaq Al-Ameri, and from
//                 September 2023 my wife and I will be taking over the general
//                 practice at SeeDocNow.
//               </p>
//               <p>
//                 As a specialist in internal medicine, trainee at the Martin
//                 Luther University and with experience in an orthopaedical
//                 hospital in Berlin, I bring with me comprehensive medical
//                 knowledge and a great passion for patient care.
//               </p>
//               <p>
//                 In our practice, the focus is on people. I place particular
//                 value on a trusting doctor-patient relationship and take the
//                 time to fully understand your concerns and find the best
//                 possible treatment together.
//               </p>
//               <p>
//                 I look forward to getting to know you personally and welcoming
//                 you to our practice. Together we will work for your health –
//                 with commitment, care and expertise.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
