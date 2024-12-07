"use client";
import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import CustomVideoPlayer from "@/components/ui/video";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchSubscription } from "@/redux/slice/subscription";
import { getApi, patchApi, postAuth } from "@/utils/apis";
import { URLS } from "@/utils/constants";

const UserMainVideos = () => {
  const [path, setPath] = useState<any>();
  const [playbackTimes, setPlaybackTimes] = useState<{ [key: number]: number }>(
    {}
  );
  const [getWatch, setGetWatch] = useState<any>();
  const [watchStatus, setWatchStatus] = useState<{ [key: number]: string }>({});
  const [trainers, setTrainers] = useState<any[]>([]);
  const [id, setId] = useState<any>();
  const [commercial, setCommercial] = useState<any>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [playMappedVideos, setPlayMappedVideos] = useState<boolean>(false);
  const tokens =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : "";
  const dispatch = useAppDispatch();
  const token = Cookies.get("access_token");
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const { data: subscription } = useAppSelector(
    (state) => state.getSubscription
  );

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const month = url.searchParams.get("month");
    let id = url.searchParams.get("id");

    if (id) {
      id = id.split("%20")[0];
      setId(id);
    }

    const monthName = typeof month === "string" ? month.replace(/-/g, " ") : "";
    setPath(monthName);
  }, []);

  const fetchData = async () => {
    try {
      if (id) {
        if (token) {
          const response = await getApi(
            `https://dev.api.globalretrieversolutions.com/api/v1/program/main-video/?month=${id}&ordering=date_added`,
            {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            }
          );
          // console.log("token");

          setTrainers(response?.data?.results);
        } else {
          console.log("not");
          const response = await getApi(
            `https://dev.api.globalretrieversolutions.com/api/v1/program/main-video/?month=${id}&ordering=date_added`
          );

          setTrainers(response?.data?.results);
        }
      } else {
        console.error("Access token is not available.");
      }
    } catch (error) {
      console.error("An error occurred during the API call:", error);
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const commer = url.searchParams.get("src");
    setCommercial(commer);

    if (token) {
      setIsAuthenticated(true);
    }

    fetchData();
    GetProgress();
  }, [id]);

  const handleCommercialEnd = () => {
    setPlayMappedVideos(true);
  };

  useEffect(() => {
    dispatch(fetchSubscription());

    // Load watch status from localStorage on UserMainVideos load
    if (typeof window !== "undefined") {
      const savedWatchStatus = JSON.parse(
        localStorage.getItem("watchStatus") || "{}"
      );
      setWatchStatus(savedWatchStatus);
    }
  }, [dispatch]);

  const GetProgress = async () => {
    try {
      const response = await getApi(URLS.GET_WATCHING);
      setGetWatch(response);
    } catch (error) {
      console.error(`Failed to post initial progress for trainer `, error);
    }
  };
  const postInitialProgress = async (
    trainerId: number,
    timeInSeconds: number
  ) => {
    try {
      const response = await postAuth(
        URLS.POST_WATCHING,
        {
          main_video: trainerId,
          seconds: timeInSeconds,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      setWatchStatus((prevStatus) => ({
        ...prevStatus,
        [trainerId]: "watching",
      }));

      // Persist status in localStorage
      const updatedWatchStatus = {
        ...watchStatus,
        [trainerId]: "watching",
      };
      // typeof window !== "undefined" &&
      //   localStorage.setItem("watchStatus", JSON.stringify(updatedWatchStatus));

      await fetchData();
    } catch (error) {
      console.error(
        `Failed to post initial progress for trainer ${trainerId}:`,
        error
      );
    }
  };

  const updateProgress = async (trainerId: number, timeInSeconds: number) => {
    try {
      const response = await patchApi(
        `${URLS.UPDATE_WATCHING}${trainerId}`,
        { seconds: timeInSeconds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchData();
    } catch (error) {
      console.error(
        `Failed to update progress for trainer ${trainerId}:`,
        error
      );
    }
  };

  const handleVideoLoaded = (
    trainerId: number,
    videoElement: HTMLVideoElement
  ) => {
    const progress = trainers.find((trainer) => trainer.id === trainerId)
      ?.progress[0];
    if (progress) {
      videoElement.currentTime = progress.seconds;
    }
  };

  const handleTimeUpdate = (
    trainerId: number,
    progressId: number,
    currentTime: number
  ) => {
    if (!trainerId) return;

    if (progressId === 0) {
      postInitialProgress(trainerId, currentTime);
    } else {
      updateProgress(progressId, currentTime);
      setPlaybackTimes((prevTimes) => ({
        ...prevTimes,
        [trainerId]: currentTime,
      }));
    }
  };

  const handleVideoComplete = (trainerId: number) => {
    // Update local state to mark as watched
    setWatchStatus((prevStatus) => ({
      ...prevStatus,
      [trainerId]: "watched",
    }));

    // Store watch status in localStorage
    const updatedWatchStatus = {
      ...watchStatus,
      [trainerId]: "watched",
    };
  };

  return (
    <div className="text-center mb-4 h-full">
      <h1
        className="text-[2.2rem] font-bold pb-5 pt-16"
        style={{ color: "#674960" }}
      >
        Main Videos
      </h1>

      {commercial && commercial !== "undefined" && !playMappedVideos ? (
        <CustomVideoPlayer
          videoSrc={commercial}
          adText="Commercial GR"
          onEnd={handleCommercialEnd}
        />
      ) : trainers.length === 0 ? (
        <p className="text-lg font-bold" style={{ color: "#674960" }}>
          There is no main video available.
        </p>
      ) : (
        <div className="text-justify cursor-pointer flex flex-wrap gap-8 justify-center my-3 mt-[42px] max-w-[87.5rem] mx-auto">
          {trainers.map((trainer: any, index: number) => {
            const isDisabled = subscription.length === 0 && index > 0;
            // const watchState = watchStatus[trainer.id] || "not watched";

            const totalTime = videoRefs.current[trainer.id]?.duration;

            let currentTime = trainer?.progress?.[0]?.seconds ?? null;
            console.log(totalTime, currentTime, "totalTime");
            if (videoRefs.current[trainer.id]?.played) {
              currentTime = videoRefs.current[trainer.id]?.currentTime;
            }
            const watchState =
              totalTime === currentTime ? "watched" : "not watched";
            return (
              <div
                key={index}
                className={`${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                } max-w-[20rem]`}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[trainer.id] = el;
                  }}
                  className="mb-2"
                  controlsList="nodownload"
                  controls={!isDisabled}
                  width="320"
                  height="140"
                  style={{ objectFit: "cover", maxHeight: "11.5rem" }}
                  onPause={(event) => {
                    if (isAuthenticated) {
                      handleTimeUpdate(
                        trainer.id,
                        trainer.progress[0]?.id || 0,
                        event.currentTarget.currentTime
                      );
                    }
                  }}
                  onLoadedMetadata={() => {
                    if (isAuthenticated) {
                      handleVideoLoaded(
                        trainer.id,
                        videoRefs.current[trainer.id]!
                      );
                    }
                  }}
                  onEnded={() => {
                    if (isAuthenticated) {
                      handleVideoComplete(trainer.id);
                    }
                  }}
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
                    {formatDate(trainer.date_added) || "July 8, 2022"}{" "}
                    {subscription && subscription.length === 0 ? (
                      ""
                    ) : (
                      <span
                        style={{
                          color: watchState === "watched" ? "green" : "red",
                        }}
                      >
                        {watchState}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserMainVideos;
