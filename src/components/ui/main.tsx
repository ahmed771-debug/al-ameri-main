// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import Tip from "./tip";
// import Link from "next/link";

// interface GalleryMonthsProps {
//   monthName: string[];
//   tipName: string[];

// }

// const Main: React.FC<GalleryMonthsProps> = ({ monthName, tipName }) => {
//   return (
//     <>
//       <div className="ml-4">
//         <table className="min-w-full">
//           <thead className="bg-[#F0EAEE]">
//             <tr>
//               <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Main Videos
//               </th>

//               <th className="px-6 py-3 text-center text-xs font-medium  border-l border-gray-300 text-gray-500 uppercase tracking-wider">
//                 Tip
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white ">
//             <tr>
//               <td className="px-6 ">
//                 <ul className="text-left">
//                   {Array.isArray(monthName) && monthName.length > 0 ? (
//                     monthName.map((name, index) => (
//                       <li style={{ fontSize: "13px" }} key={index}>
//                         <Link
//                           href={`/main?id=${name}`}
//                           className="text-[#89617b] hover:underline"
//                         >
//                           {name}
//                         </Link>
//                       </li>
//                     ))
//                   ) : (
//                     <>"Not Available"</>
//                   )}
//                 </ul>
//               </td>

//               <td className="px-6  tracking-wider border-l border-gray-300 ">
//                 {Array.isArray(tipName) &&
//                   tipName.length > 0 &&
//                   tipName.map((name, index) => (
//                     <Tip tipName={name} key={index} />
//                   ))}
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// };

// export default Main;
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Tip from "./tip";
import Link from "next/link";

interface GalleryMonthsProps {
  programId: number;
  monthName: string;
  message: any;
}

const Main: React.FC<GalleryMonthsProps> = ({
  programId,
  monthName,
  message,
}) => {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [filteredTrainers, setFilteredTrainers] = useState<any[]>([]);

  useEffect(() => {
    // Check if the user is authenticated by checking for a token
    const token = Cookies.get("access_token");
    if (token) {
      setIsAuthenticated(true); // Set authentication status
    }

    const fetchData = async () => {
      try {
        // Retrieve the token from local storage
        const token = localStorage.getItem("access_token");

        // If the token is available, make the API call
        const response = await axios.get(
          `https://dev.api.globalretrieversolutions.com/api/v1/program/main-video/?month=${programId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
          }
        );

        // Process the response
        const data = response?.data?.results || [];
        setTrainers(data);

        // Filter trainers based on monthName and update the state
        const filtered = data.filter(
          (item: any) => item?.month?.name === monthName
        );
        setFilteredTrainers(filtered);
      } catch (error) {
        console.error("An error occurred during the API call:", error);
      }
    };

    fetchData();
  }, [programId, monthName]); // Added monthName to dependency array

  if (!isAuthenticated) {
    return <p>Please log in to view this content.</p>;
  }

  const hasMainVideos = filteredTrainers.some((item) => item?.name);
  const hasTipVideos = filteredTrainers.length > 0;

  return (
    <>
      <div className="ml-4">
        <table className="min-w-full">
          <thead className="bg-[#F0EAEE]">
            {(hasMainVideos || hasTipVideos) && (
              <tr>
                {hasMainVideos && (
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Main Videos
                  </th>
                )}

                <th className="px-6 py-3 text-center text-xs font-medium  border-l border-gray-300 text-gray-500 uppercase tracking-wider">
                  Tip
                </th>
              </tr>
            )}
          </thead>
          <tbody className="bg-white ">
            {hasMainVideos &&
              filteredTrainers.length > 0 &&
              filteredTrainers.map((item: any, index: number) => (
                <tr key={index}>
                  {hasMainVideos && (
                    <td className="px-6 whitespace-nowrap">
                      <ul className="list-disc list-inside">
                        <li style={{ fontSize: "13px" }}>
                          <Link
                            href={`/main?id=${programId}`}
                            className="text-[#89617b] hover:underline"
                          >
                            {item?.name || "Not Available"}
                          </Link>
                        </li>
                      </ul>
                    </td>
                  )}
                  {hasTipVideos && (
                    <td className="px-6 whitespace-nowrap tracking-wider border-l border-gray-300 ">
                      <Tip programId={item?.id} tipId={programId} />
                    </td>
                  )}
                </tr>
              ))}
            {!hasMainVideos && !hasTipVideos && (
              <tr className="border-none">
                <td className="px-6  whitespace-nowrap" colSpan={2}>
                  {message("No videos available")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Main;
