"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import CustomVideoPlayer from "@/components/ui/video";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchSubscription } from "@/redux/slice/subscription";
import { BeatLoader } from "react-spinners";
import { getApi } from "@/utils/apis";

const TrainerPrograms = () => {
  const router = useRouter();
  const ref = useRef<any>();
  const [trainers, setTrainers] = useState<any>([]);
  const [program, setProgram] = useState<any>("");
  const [video, setVideo] = useState<any>("");
  const [videoURL, setVideoURL] = useState<any>("");
  const [commercial, setCommercial] = useState<string>(""); // Holds the commercial video URL
  const [showCommercial, setShowCommercial] = useState<boolean>(true); // To toggle between videos
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [programName, setProgramName] = useState<any>("");
  const dispatch = useAppDispatch();
  // Access Redux state

  const { subscription } = useAppSelector((state) => ({
    subscription: state.getSubscription.data, // Adjust this path based on your state structure
  }));
  useEffect(() => {
    const url = new URL(window.location.href);
    const program = url.searchParams.get("program");
    setProgram(program);
    const name = url.searchParams.get("name");
    setProgramName(name);
    const video_name = url.searchParams.get("video");
    setVideoURL(video_name);

    const token = Cookies.get("access_token");
    if (token) {
      setIsAuthenticated(true);
    }

    const fetchData = async () => {
      try {
        const response = await getApi(
          `https://dev.api.globalretrieversolutions.com/api/v1/program/month/?program=${program}`
        );
        setTrainers(response?.data?.results);
      } catch (error) {
        console.error("Error during API call:", error);
      }
    };

    const fetchCommercial = async () => {
      try {
        const response = await getApi(
          `https://dev.api.globalretrieversolutions.com/api/v1/commercials/?program=${program}`
        );
        setCommercial(response?.data?.results?.[0]?.video.file);
      } catch (error) {
        console.error("Error fetching commercial video:", error);
      }
    };

    const fetchVideo = async () => {
      try {
        if (token) {
          const response = await getApi(
            `https://dev.api.globalretrieversolutions.com/api/v1/program/${program}/`,
            {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            }
          );
          setVideo(response?.data?.video?.file);
        } else {
          const response = await getApi(
            `https://dev.api.globalretrieversolutions.com/api/v1/program/${program}/`
          );
          setVideo(response?.data?.video?.file);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchData();
    fetchCommercial();
    fetchVideo();
  }, []);
  useEffect(() => {
    dispatch(fetchSubscription());
  }, []);
  // Handle commercial video end
  const handleCommercialEnd = () => {
    setShowCommercial(false);
    setCommercial("");
  };

  // Memoized video rendering
  const videoContent = useMemo(() => {
    if (subscription.length === 0) {
      if (commercial === undefined && !trainers[0]?.program?.video?.file) {
        return <p>No videos available.</p>; // Show a message if both videos are unavailable
      }
    } else {
      if (commercial === undefined && !video) {
        return <p>No videos available.</p>; // Show a message if both videos are unavailable
      }
    }

    if (
      commercial &&
      typeof commercial === "string" &&
      commercial.trim() !== ""
    ) {
      return (
        <CustomVideoPlayer
          videoSrc={commercial}
          adText="Commercial GR"
          // ref={ref}
          onEnd={handleCommercialEnd}
        />
      );
    }

    if (subscription.length === 0) {
      if (trainers[0]?.program?.video?.file) {
        return (
          <video
            className="mb-2"
            controls
            ref={ref}
            onLoadedData={() => console.log("Main video loaded")}
            height="640"
            style={{ height: "28rem", margin: "auto" }}
            autoPlay
          >
            <source src={trainers[0]?.program?.video?.file} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      }
    } else {
      if (video && typeof video === "string" && video.trim() !== "") {
        return (
          <video
            className="mb-2"
            controls
            ref={ref}
            onLoadedData={() => console.log("Main video loaded")}
            height="640"
            style={{ height: "28rem", margin: "auto" }}
            autoPlay
          >
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      }
    }

    return <BeatLoader color="#674960" size={15} />; // Loading indicator when both videos are loading
  }, [showCommercial, commercial, video]);
  //Main Videos
  const handleMonthClick = (month: string, id: any) => {
    const formattedMonth =
      month?.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    // Convert the formatted month name to slug format
    const slug = formattedMonth.replace(/ /g, "-");

    // Navigate to the new URL with the month query parameter
    router.push(`/main/?id=${id}&month=${month}&src=${commercial}&name=sss
  }`);
  };

  //Tip Videos
  const handleTIPClick = (month: string, id: any) => {
    // Capitalize only the first word and make the rest lowercase
    const formattedMonth =
      month?.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    // Convert the formatted month name to slug format
    const slug = formattedMonth.replace(/ /g, "-");

    // Navigate to the new URL with the month query parameter
    router.push(`/tip/?id=${id}&month=${month}&src=${commercial}&name=sss
  }`);
  };
  return (
    <div className="text-center mb-4">
      <div className="md:flex items-baseline justify-center">
        <h1
          className="text-[2.2rem] font-semibold pb-5 pt-16 m-auto md:w-[57%] text-center"
          style={{ color: "#674960" }}
        >
          {programName}
        </h1>
      </div>

      <div className="w-full mb-[2.9375rem]">{videoContent}</div>

      <h1 className="text-[2.2rem] font-semibold" style={{ color: "#674960" }}>
        Months
      </h1>
      <h1 className="mb-4">
        You’ll enjoy knowing our dedicated team will do whatever is needed to
        keep your pets happy, healthy, and safe when you’re away from home.
      </h1>
      <div className="border-spacing-0 mx-auto max-w-[80rem] sss box-border">
        {trainers.map((item: any, index: any) => {
          return (
            <div
              className="cursor-pointer flex justify-between p-4 md:px-16 sm:px-0 border border-gray-200 mb-2 rounded-lg transition-colors duration-300 ease-in-out  hover:bg-gray-200"
              key={index}
            >
              <div
                onClick={() => {
                  handleMonthClick(item.name, item.id);
                }}
                className="flex items-center text-base font-medium "
              >
                <span
                  role="img"
                  aria-label="calendar"
                  color="grey"
                  className="mr-2"
                ></span>
                <span className=" mr-2 ">
                  {item?.results?.map((result: any, resultIndex: any) => (
                    <span key={resultIndex}>Month 1 </span>
                  ))}
                </span>
                {item.name}({item.videos}
                {item?.main_videos})
              </div>
              <div
                onClick={() => {
                  handleTIPClick(item.name, item.id);
                }}
                className="flex items-center font-medium "
              >
                Tip Video ({item.tip_videos})
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrainerPrograms;
