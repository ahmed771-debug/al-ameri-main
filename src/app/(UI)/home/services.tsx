import { Phone, Calendar, UserCog } from "lucide-react";

export default function ServiceSteps() {
  const steps = [
    {
      icon: Phone,
      title: "Call for",
      subtitle: "appointment",
    },
    {
      icon: Calendar,
      title: "Get a",
      subtitle: "Date & Serial",
    },
    {
      icon: UserCog,
      title: "Consult",
      subtitle: "Your dentist",
    },
  ];

  return (
    <section className="bg-[#0BB6CE] py-12 ">
      <div className="px-3">
        <div
          className="lg:max-w-7xl lg:mx-auto md:flex justify-between "
          style={{ alignItems: "center" }}
        >
          <div className="text-white ">
            <h2 className="md:text-3xl lg:text-4xl font-bold mb-2 lg:text-left sm:text-center">
              How to get our service?
            </h2>
            <p className="text-lg opacity-90 lg:text-left sm:text-center">
              Just follow these simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:gap-14 md:gap-4 ">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center transform transition-transform hover:scale-105 mb-3"
              >
                <div className="flex justify-center mb-4">
                  <step.icon className="w-8 h-8 text-[#00B5D8]" />
                </div>
                <h3 className="text-[#00B5D8] font-medium">
                  {step.title}
                  <br />
                  {step.subtitle}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
