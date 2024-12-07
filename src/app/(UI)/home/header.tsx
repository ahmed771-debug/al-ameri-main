export default function Hedaer() {
  return (
    <header className=" mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <div className="relative md:w-[83%] ">
          <h1 className="lg:text-[3.375rem] font-bold">
            <span className="text-gray-800">WHO</span>{" "}
            <span className="text-cyan-500">WE ARE</span>
          </h1>
          <div className="absolute -bottom-4 left-0 w-full h-0.5 bg-gray-200" />
        </div>
        <div>
          <h2 className="lg:text-[2rem] text-gray-800 font-semibold">
            Our Glorious{" "}
            <span className="block text-end font-bold lg:text-3xl italic">
              History
            </span>
          </h2>
        </div>
      </div>
    </header>
  );
}
