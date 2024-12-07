"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MessageSquare, Calendar } from "lucide-react";

export default function AnimatedHeroImage() {
  return (
    <div className="relative md:w-full h-[500px] md:h-[600px]">
      {/* Background circle */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Doctor image */}
      <div className="relative z-10 h-full">
        <Image
          src="/Illustration.svg"
          alt="Doctor"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Animated chat bubble */}
      <motion.div
        className="absolute top-4 right-4 z-20"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="bg-[#00B5D8] p-3 rounded-lg">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
      </motion.div>

      {/* Animated calendar */}
      <motion.div
        className="absolute bottom-12 right-4 z-20"
        animate={{
          x: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="bg-white p-3 rounded-lg shadow-lg">
          <Calendar className="w-6 h-6 text-gray-600" />
        </div>
      </motion.div>

      {/* Animated yellow decorative elements */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-8 h-8 border-4 border-yellow-400 rounded-full z-20"
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute top-1/3 left-1/4 w-6 h-6 border-4 border-yellow-400 z-20"
        animate={{
          rotate: -360,
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Animated customer count badge */}
      <motion.div
        className="absolute left-4 bottom-20 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: [0, -5, 0],
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
          opacity: {
            duration: 0.5,
          },
        }}
      ></motion.div>
    </div>
  );
}
