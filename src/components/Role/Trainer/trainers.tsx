"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import BiographyVideo from "@/components/ui/biographyVideo";
import { getApi, getApiWithoutAuth } from "@/utils/apis";
import { URLS } from "@/utils/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchSubscription } from "@/redux/slice/subscription";
import { BeatLoader } from "react-spinners";

const Page = () => {
  const [path, setPath] = useState<any>();
  const [id, setId] = useState<any>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [trainers, setTrainers] = useState<any>([]);
  const [biographyVideo, setBiographyVideo] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // State for authentication
  const router = useRouter();
  const dispatch = useAppDispatch();
  // Access Redux state
  const token = Cookies.get("access_token");

  const { subscription, accountType } = useAppSelector((state) => ({
    subscription: state.getSubscription.data, // Adjust this path based on your state structure
    accountType: state.AccountType.data, // Adjust this path based on your state structure
  }));

  useEffect(() => {
    // Extract token from URL
    const url = new URL(window.location.href);
    const month = url.searchParams.get("name");
    const last = url.searchParams.get("last");
    const id = url.searchParams.get("id");
    const monthName = typeof month === "string" ? month.replace(/-/g, " ") : "";
    if (monthName && last) {
      setPath({ monthName, last });
      setIsLoaded(true);
    }
    setId(id);

    if (token) {
      setIsAuthenticated(true); // Set authentication status
    }
  }, []);

  const handleTrainerClick = (id: any, name: string, video: any) => {
    router.push(`/programs/?program=${id}&name=${name}`);
  };

  // Trainer API to get ID
  const fetchTrainer = async () => {
    try {
      const response = await getApi(URLS.TRAINERS);
      const trainersData = response?.data?.results;
      if (trainersData && id) {
        const matchedTrainer = trainersData.find(
          (trainer: any) => trainer.id.toString() === id
        );
        if (matchedTrainer) {
          setBiographyVideo(matchedTrainer?.biography_video?.file);
        }
      }
    } catch (error) {
      console.error("An error occurred during the API call:", error);
    }
  };

  const fetchData = async () => {
    try {
      if (token) {
        const response = await getApi(
          `${URLS.PROGRAMS}/?owner=${id}&ordering=date_added`,
          {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          }
        );
        setTrainers(response?.data?.results);
      } else {
        const response = await getApi(
          `${URLS.PROGRAMS}/?owner=${id}&ordering=date_added`
        );
        setTrainers(response?.data?.results);
      }
    } catch (error) {
      console.error("An error occurred during the Programs API call :", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTrainer();
      fetchData();
    }
  }, [id]);
  useEffect(() => {
    dispatch(fetchSubscription());
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="text-center mb-4">
      {isLoaded ? (
        <BiographyVideo
          videoUrl={biographyVideo}
          title={`${path?.monthName} `}
        />
      ) : (
        <BeatLoader color="#674960" size={15} className="mt-3 mb-3" />
      )}

      <h1 className="text-[2.2rem] font-semibold" style={{ color: "#674960" }}>
        Programs Offer
      </h1>
      <h1>
        You’ll enjoy knowing our dedicated team will do whatever is needed to
        keep your pets happy, healthy and safe when you’re away from home.
      </h1>
      <div className="text-justify flex flex-wrap gap-8 justify-center my-3 mt-[42px] max-w-[87.5rem] mx-auto">
        {trainers?.map((trainer: any, index: number) => {
          const isDisabled =
            subscription && subscription.length === 0 && index > 0;
          return (
            <div
              key={index}
              onClick={() =>
                handleTrainerClick(
                  trainer?.id,
                  trainer?.name,
                  trainer?.video?.file
                )
              }
              className="cursor-pointer max-w-[20rem] break-words" // Disable click and change appearance
            >
              <video
                className="mb-2"
                controls
                width="320"
                height="140"
                controlsList="nodownload"
                style={{ objectFit: "cover", maxHeight: "9.5rem" }}
              >
                <source src={trainer?.video?.file} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="font-bold mb-1">{trainer?.name || "Program"}</p>
              <div className="flex items-center gap-1">
                <svg
                  className="h-4 w-4"
                  style={{ color: "#674960" }}
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15 15" />
                </svg>
                <p
                  style={{
                    color: "#674960",
                    fontSize: ".875rem",
                    fontWeight: "bold",
                  }}
                >
                  {formatDate(trainer.date_added) || "July 8, 2022"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
