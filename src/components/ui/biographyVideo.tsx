"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import gallery from "../../../public/612.png"; // Adjust this import path
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";

interface BiographyVideoProps {
  videoUrl: string | null | undefined; // Accept video URL as a prop
  title: string;
}

const BiographyVideo: React.FC<BiographyVideoProps> = ({ videoUrl, title }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const iframeElement = document.getElementById(
      "videoIframe"
    ) as HTMLIFrameElement;
    if (iframeElement && videoUrl) {
      iframeElement.src = videoUrl;
    }
    if (videoUrl) {
      setLoading(false);
    }
  }, [videoUrl]);
  // Logic to determine what to render
  if (videoUrl === null || videoUrl === undefined) {
    return (
      <>
        <div className="md:flex items-baseline justify-center">
          <h1
            className="text-[2.2rem] font-semibold pb-5 pt-16  md:w-[57%]"
            style={{ color: "#674960" }}
          >
            {title}
          </h1>
          {/* <div className="flex w-[22%] gap-4 md:m-1 sm:m-auto sm gallery">
            <div>
              <Image src={gallery} alt="Logo" width={40} height={40} />
            </div>
            <div
              className="text-justify cursor-pointer"
              onClick={() => router.push("/gallery")}
            >
              <p
                className="text-primary"
                style={{ fontSize: ".875rem", fontWeight: "bold" }}
              >
                Gallery
              </p>
              <p style={{ fontSize: ".625rem" }}>
                Last Uploaded: <span className="text-primary">7/2/2024</span>
              </p>
            </div>
          </div> */}
        </div>
        <p>No Video Available</p>
      </>
    );
  }
  return (
    <div className="text-center mb-4">
      <div className="md:flex items-baseline justify-center">
        <h1
          className="text-[2.2rem] font-semibold pb-5 pt-16 md:ml-auto md:w-[57%]"
          style={{ color: "#674960" }}
        >
          {title}
        </h1>
        <div className="flex w-[22%] gap-4 md:m-1 sm:m-auto sm gallery">
          <div>
            {/* <Image src={gallery} alt="Logo" width={40} height={40} /> */}
          </div>
          <div
            className="text-justify cursor-pointer"
            onClick={() => router.push("/gallery")}
          >
            {/* <p
              className="text-primary"
              style={{ fontSize: ".875rem", fontWeight: "bold" }}
            >
              Gallery
            </p> */}
            {/* <p style={{ fontSize: ".625rem" }}>
              Last Uploaded: <span className="text-primary">7/2/2024</span>
            </p> */}
          </div>
        </div>
      </div>

      <div className="w-full mb-[2.9375rem]">
        {loading ? (
          <BeatLoader color="#674960" size={15} /> // Show loader while video is loading
        ) : videoUrl ? (
          <video
            className="mb-2 aspect-video w-auto px-2 md:max-w-3xl"
            controls
            style={{
              margin: "auto",
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p>No Video Available....</p> // Show "No Video Available" only if videoUrl is null, undefined, or empty
        )}
      </div>
    </div>
  );
};

export default BiographyVideo;
