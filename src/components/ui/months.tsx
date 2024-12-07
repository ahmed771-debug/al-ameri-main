"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Main from "./main";

interface GalleryMonthsProps {
  monthName: any;
  programId: number;
}

const GalleryMonths: React.FC<GalleryMonthsProps> = ({
  monthName,
  programId,
}) => {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [message, setMessage] = useState<any>();

  const fetchData = async () => {
    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem("access_token");

      // If the token is available, make the API call
      if (token) {
        const response = await axios.get(
          `https://dev.api.globalretrieversolutions.com/api/v1/program/month/?program=${programId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
          }
        );

        // Process the response
        setTrainers(response?.data?.results || []);
      } else {
        console.error("Access token is not available.");
      }
    } catch (error) {
      console.error("An error occurred during the API call:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [programId]);

  if (trainers.length === 0) {
    return monthName("No months available");
  }
  return (
    // <div className="overflow-x-auto">
    //   <table
    //     className="min-w-full bg-white border border-gray-300 border-r"
    //     style={{
    //       borderSpacing: "0 10px",
    //       tableLayout: "fixed",
    //       border: "0",
    //     }}
    //   >
    //     <thead>
    //       <tr>
    //         <th
    //           className="py-3 px-4 text-sm border-r"
    //           style={{ fontSize: "10px" }}
    //         >
    //           {monthName}
    //         </th>

    //       </tr>
    //     </thead>

    //     <tbody>
    //       <tr>
    //         <td className="py-3 px-4 border-r text-left">
    //           Render Main component for each month */}
    //            <Main programId={month?.id} monthName={month?.name} />
    //         </td>
    //       </tr>
    //     </tbody>
    //   </table>
    // </div>
    <div className="overflow-x-auto">
      <table
        className="min-w-full bg-white border border-gray-300 border-r"
        style={{
          borderSpacing: "0 10px",
          tableLayout: "fixed",
          border: "0",
        }}
      >
        <thead>
          {!message && (
            <tr>
              {trainers.map((month: any, monthIndex: number) => (
                <th
                  key={monthIndex}
                  className="py-3 px-4 text-sm border-r"
                  style={{ fontSize: "10px" }}
                >
                  {month?.name}
                </th>
              ))}
            </tr>
          )}
        </thead>

        <tbody>
          {/* Render rows for trainers */}
          <tr>
            {/* <td
            rowSpan={trainers.length}
            className="py-3 px-4 text-primary bg-[#F0EAEE]"
            style={{ width: "13rem", fontSize: "16px" }}
          >
            Dog
          </td> */}
            {trainers.map((month: any, monthIndex: number) => (
              <td key={monthIndex} className="py-3 px-4 border-r text-left">
                {/* Render Main component for each month */}
                <Main
                  programId={month?.id}
                  monthName={month?.name}
                  message={setMessage}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GalleryMonths;
