"use client";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchSubscription } from "@/redux/slice/subscription";
import { getApi, patchApi, postAuth } from "@/utils/apis";
import { URLS } from "@/utils/constants";

function TrainerTipVideos() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [id, setId] = useState<number[]>([]);
  const [main_id, setMainId] = useState<any>();
  const [playbackTimes, setPlaybackTimes] = useState<{ [key: number]: number }>(
    {}
  );
  const [getWatch, setGetWatch] = useState<any>();
  const [watchStatus, setWatchStatus] = useState<{ [key: number]: string }>({});

  const dispatch = useAppDispatch();
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const token = Cookies.get("access_token");

  // Access Redux state
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
    const main_id = url.searchParams.get("id");
    setMainId(main_id);
  }, []);

  const fetchMainVideos = async () => {
    try {
      if (main_id) {
        if (token) {
          const response = await getApi(
            `https://dev.api.globalretrieversolutions.com/api/v1/program/main-video/?month=${main_id}&ordering=date_added`,
            {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            }
          );

          const tip_id = response?.data?.results.map(
            (item: { id: number }) => item.id
          );
          setId(tip_id);
        } else {
          const response = await getApi(
            `https://dev.api.globalretrieversolutions.com/api/v1/program/main-video/?month=${main_id}&ordering=date_added`
          );

          const tip_id = response?.data?.results.map(
            (item: { id: number }) => item.id
          );
          setId(tip_id);
        }
      } else {
        console.error("Access token is not available.");
      }
    } catch (error) {
      console.error("An error occurred during the API call:", error);
    }
  };

  const fetchTipVideos = async () => {
    try {
      if (token) {
        if (id.length > 0) {
          const promises = id.map((ids: number) =>
            getApi(
              `https://dev.api.globalretrieversolutions.com/api/v1/program/tip-video/?main_video=${ids}&ordering=date_added`,
              {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              }
            )
          );

          const responses = await Promise.all(promises);
          const allTrainers = responses.flatMap(
            (response) => response?.data.results
          );
          setTrainers(allTrainers);
        }
      } else {
        if (id.length > 0) {
          const promises = id.map((ids: number) =>
            getApi(
              `https://dev.api.globalretrieversolutions.com/api/v1/program/tip-video/?main_video=${ids}&ordering=date_added`
            )
          );

          const responses = await Promise.all(promises);
          const allTrainers = responses.flatMap(
            (response) => response?.data.results
          );
          setTrainers(allTrainers);
        }
      }
    } catch (error) {
      console.error("An error occurred while fetching tip videos:", error);
    }
  };

  useEffect(() => {
    fetchMainVideos();
  }, [main_id]);

  useEffect(() => {
    if (id.length > 0) {
      fetchTipVideos();
    }
  }, [id]);

  useEffect(() => {
    dispatch(fetchSubscription());

    // Load watched status from localStorage
    const storedWatchStatus = JSON.parse(
      localStorage.getItem("watchStatus") || "{}"
    );
    setWatchStatus(storedWatchStatus);
  }, []);

  const postInitialProgress = async (
    trainerId: number,
    timeInSeconds: number
  ) => {
    try {
      await postAuth(
        URLS.UPDATE_WATCHING_TIP,
        {
          tip_video: trainerId,
          seconds: timeInSeconds,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      await fetchTipVideos();
    } catch (error) {
      console.error(
        `Failed to post initial progress for trainer ${trainerId}:`,
        error
      );
    }
  };

  const updateProgress = async (trainerId: number, timeInSeconds: number) => {
    try {
      await patchApi(
        `${URLS.UPDATE_WATCHING_TIP}${trainerId}`,
        { seconds: timeInSeconds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchTipVideos();
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
    const progress =
      trainers.find((trainer) => trainer.id === trainerId)?.progress[0] ?? null;
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
    setWatchStatus((prevStatus) => ({
      ...prevStatus,
      [trainerId]: "watched",
    }));

    // Store watched status in localStorage
    localStorage.setItem(
      "watchStatus",
      JSON.stringify({
        ...watchStatus,
        [trainerId]: "watched",
      })
    );
  };

  const GetProgress = async () => {
    try {
      const response = await getApi(URLS.GET_WATCHING_TIP, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGetWatch(response);
    } catch (error) {
      console.error(`Failed to post initial progress for trainer `, error);
    }
  };

  return (
    <div className="text-center mb-4 h-full">
      <h1
        className="text-[2.2rem] font-bold pb-5 pt-16"
        style={{ color: "#674960" }}
      >
        {`TIP Videos`}
      </h1>
      <div className="text-justify cursor-pointer flex flex-wrap gap-8 justify-center max-w-[90.5rem] mx-auto">
        {trainers.map((trainer: any, index: number) => {
          return (
            <div key={index} className="cursor-pointer max-w-[20rem]">
              <video
                ref={(el) => {
                  videoRefs.current[trainer.id] = el;
                }}
                className="mb-2"
                controlsList="nodownload"
                controls
                width="320"
                height="140"
                style={{ objectFit: "cover", maxHeight: "11.5rem" }}
                onPause={(event) => {
                  if (token) {
                    handleTimeUpdate(
                      trainer.id,
                      trainer.progress[0]?.id || 0,
                      Math.floor(event.currentTarget.currentTime)
                    );
                  }
                }}
                onLoadedMetadata={() => {
                  if (token) {
                    handleVideoLoaded(
                      trainer.id,
                      videoRefs.current[trainer.id]!
                    );
                  }
                }}
                onEnded={() => {
                  if (token) {
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
                  {token ? (
                    <span
                      style={{
                        color:
                          watchStatus[trainer.id] === "watched"
                            ? "green"
                            : "red",
                        marginLeft: "5px",
                      }}
                    >
                      {/* {watchStatus[trainer.id] || "not watched"} */}
                    </span>
                  ) : (
                    ""
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TrainerTipVideos;
