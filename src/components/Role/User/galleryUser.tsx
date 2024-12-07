"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchGallery } from "@/redux/slice/gallery";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { BeatLoader } from "react-spinners";
import { fetchSubscription } from "@/redux/slice/subscription";

const UserGallery = () => {
  const dispatch = useAppDispatch();
  const { ref, inView } = useInView();
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const { data: galleryData, next } = useAppSelector((state) => state.Gallery);

  // Access Redux state
  const { data: subscription } = useAppSelector(
    (state) => state.getSubscription
  );

  const fetchData = (page: number) => {
    setLoading(true);
    dispatch(
      fetchGallery({
        page,
        limit: 20,
        url: undefined,
      })
    )
      .unwrap()
      .then((newData: any) => {
        if (newData.results.length === 0) {
          setHasMore(false); // No more data to load
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching gallery data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(0);
  }, [dispatch]);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage); // Increment the current page
    fetchData(nextPage); // Fetch the next page of data
  };

  useEffect(() => {
    if (inView && next) {
      loadMore();
    }
  }, [inView]);

  const groupedResults = useMemo(() => {
    let _groupedResults: {
      user_id: number;
      first_name: string;
      last_name: string;
      items: {
        program_id: number;
        program_name: string;
        months: {
          month_id: number;
          month_name: string;
          main_videos: any[];
          tip_videos: any[];
        }[];
      }[];
    }[] = [];

    galleryData?.forEach(
      (item: {
        main_video_id: any;
        tip_video_id: any;
        user_id: number;
        first_name: string;
        last_name: string;
        program_id: number;
        program_name: string;
        month_id: number;
        month_name: string;
        main_video_name: string;
        tip_video_name: string;
      }) => {
        if (item.user_id) {
          let userGroup = _groupedResults.find(
            (group) => group.user_id === item.user_id
          );

          if (!userGroup) {
            // Create a new user group if it doesn't exist yet
            userGroup = {
              user_id: item.user_id,
              first_name: item.first_name,
              last_name: item.last_name,
              items: [],
            };
            _groupedResults.push(userGroup); // Add new user group to groupedResults
          }

          let programGroup = userGroup.items.find(
            (program) => program.program_id === item.program_id
          );

          if (!programGroup) {
            // Create a new program group if it doesn't exist yet
            programGroup = {
              program_id: item.program_id,
              program_name: item.program_name,
              months: [],
            };
            userGroup.items.push(programGroup); // Add new program group to the user's items
          }

          let monthGroup = programGroup.months.find(
            (month) => month.month_id === item.month_id
          );

          if (!monthGroup) {
            // Create a new month group if it doesn't exist yet
            monthGroup = {
              month_id: item.month_id,
              month_name: item.month_name,
              main_videos: [],
              tip_videos: [],
            };
            programGroup.months.push(monthGroup); // Add new month group to the program
          }

          // Prevent duplicates for main videos based on id
          if (
            item.main_video_name &&
            !monthGroup.main_videos.find(
              (video) => video.main_video_id === item.main_video_id
            )
          ) {
            monthGroup.main_videos.push({
              main_video_id: item.main_video_id,
              main_video_name: item.main_video_name,
            });
          }

          // Prevent duplicates for tip videos based on id
          if (
            item.tip_video_name &&
            !monthGroup.tip_videos.find(
              (video) => video.tip_video_id === item.tip_video_id
            )
          ) {
            monthGroup.tip_videos.push({
              tip_video_id: item.tip_video_id,
              tip_video_name: item.tip_video_name,
            });
          }
        }
      }
    );
    return _groupedResults;
  }, [galleryData]);
  useEffect(() => {
    dispatch(fetchSubscription());
  }, []);
  return (
    <div className="text-center p-4">
      <h1
        className="text-[2.2rem] font-semibold pb-5 pt-3"
        style={{ color: "#674960" }}
      >
        Gallery
      </h1>

      <div>
        {groupedResults?.map((trainer, trainerIndex) =>
          trainer.first_name && trainer.last_name ? (
            <React.Fragment key={trainerIndex}>
              <h2 className="text-medium text-white font-bold py-4 mb-1 bg-[#958090] text-center rounded-md">
                {trainer.first_name} {trainer.last_name}
              </h2>
              <div>
                {trainer?.items?.map((item, itemIndex: number) => (
                  <React.Fragment key={itemIndex}>
                    <div className="text-medium text-primary font-bold my-1 bg-[#F0EAEE] text-center py-3">
                      {item?.program_name}
                    </div>

                    <div className="flex overflow-x-auto">
                      {item?.months?.map((month, monthIndex: number) => (
                        <React.Fragment key={monthIndex}>
                          <div
                            className="md:w-full border mx-2" // Added margin for spacing between month boxes
                            style={{
                              minWidth: "300px",
                              maxHeight: "400px",
                              overflowY: "auto",
                              backgroundColor: "#e9e7e7", // Set a background color for the month box
                            }}
                          >
                            <div className="bg-[#d3d3d3] text-lg font-bold text-center py-2">
                              {month?.month_name}
                            </div>

                            <div className="flex flex-col border-t-2">
                              <div className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                                <div className="mb-5 font-bold">
                                  {" "}
                                  Main Videos
                                </div>
                                <div className="px-6 whitespace-normal">
                                  <ul className="list-disc list-inside">
                                    {month?.main_videos &&
                                    month.main_videos.length > 0 ? (
                                      month.main_videos.map(
                                        (
                                          mainVideo: any,
                                          videoIndex: number
                                        ) => (
                                          <li
                                            key={videoIndex}
                                            className="text-start"
                                            style={{
                                              fontSize: "13px",
                                            }}
                                          >
                                            {subscription.length !== 0 ? (
                                              <Link
                                                href={`/main?id=${month?.month_id}`}
                                                className="text-[#89617b] hover:underline cursor-pointer"
                                              >
                                                {mainVideo.main_video_name}
                                              </Link>
                                            ) : (
                                              <span className="text-[#89617b] cursor-default">
                                                {mainVideo.main_video_name}
                                              </span>
                                            )}
                                            {/* <Link
                                              // href={`/main?id=${month?.month_id}`}
                                              className="text-[#89617b] hover:underline"
                                            >
                                              {mainVideo.main_video_name}
                                            </Link> */}
                                          </li>
                                        )
                                      )
                                    ) : (
                                      <p
                                        className="text-center"
                                        style={{ fontSize: "13px" }}
                                      >
                                        No videos available
                                      </p>
                                    )}
                                  </ul>
                                </div>
                              </div>
                              <div className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                                <div className="mb-5 font-bold">
                                  {" "}
                                  Tip Videos
                                </div>
                                <div className="px-6 whitespace-normal">
                                  <ul className="list-disc list-inside">
                                    {month?.tip_videos &&
                                    month.tip_videos.length > 0 ? (
                                      month.tip_videos.map(
                                        (tipVideo: any, videoIndex: number) => (
                                          <li
                                            key={videoIndex}
                                            className="break-words text-justify"
                                            style={{
                                              fontSize: "13px",
                                            }}
                                          >
                                            {subscription.length !== 0 ? (
                                              <Link
                                                href={`/tip?id=${month?.month_id}`}
                                                className="text-[#89617b] hover:underline"
                                              >
                                                {tipVideo.tip_video_name}
                                              </Link>
                                            ) : (
                                              <span className="text-[#89617b] cursor-default">
                                                {tipVideo.tip_video_name}
                                              </span>
                                            )}
                                          </li>
                                        )
                                      )
                                    ) : (
                                      <p
                                        className="text-center"
                                        style={{ fontSize: "13px" }}
                                      >
                                        No tip videos available
                                      </p>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </React.Fragment>
          ) : null
        )}
      </div>
      {loading && (
        <div className="flex justify-center mt-4">
          <BeatLoader color="#674960" size={15} />
        </div>
      )}
      {hasMore && !loading && <div ref={ref} />}
      {!next && <p className="mb-3 mt-3">No more data to load.</p>}
    </div>
  );
};

export default UserGallery;
