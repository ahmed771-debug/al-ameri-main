"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
export type TipVideoProps = {
  ids: any;
  token: boolean;
};
function TipVideo({ ids, token }: TipVideoProps) {
  const [path, setPath] = useState<string | undefined>();
  const [trainers, setTrainers] = useState<any[]>([]);
  const [id, setId] = useState<string | undefined>();

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

    const monthName = month ? month.replace(/-/g, " ") : "";
    setPath(monthName);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (token) {
          const response = await axios.get(
            `https://dev.api.globalretrieversolutions.com/api/v1/program/tip-video/?main_video=${ids}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setTrainers(response?.data?.results);
        } else {
          console.error("Access token is not available.");
        }
      } catch (error) {
        console.error("An error occurred during the API call:", error);
      }
    };

    fetchData();
  }, [ids]);

  if (trainers?.length === 0) {
    return null;
  }

  return (
    <div className="text-center mb-4">
      <div className="text-justify cursor-pointer flex flex-wrap gap-8 justify-center my-3 mt-[42px] max-w-[87.5rem] mx-auto">
        {trainers.map((trainer: any, index: number) => {
          const isDisabled = !token && index > 0;
          return (
            <div
              key={index}
              className={`${
                isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <video
                className="mb-2"
                controls
                width="320"
                height="140"
                style={{ objectFit: "cover", maxHeight: "11.5rem" }}
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
}

export default TipVideo;
