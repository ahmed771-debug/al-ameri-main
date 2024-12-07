// "use client";

// import React, { useEffect, useState } from "react";

// import Link from "next/link";

// interface GalleryMonthsProps {
//   tipName: string;
// }

// const Tip: React.FC<GalleryMonthsProps> = ({ tipName }) => {
//   return (
//     <div className="ml-4">
//       <ol className=" ml-3  text-center">
//         <li style={{ fontSize: "13px" }}>
//           <Link
//             href={`/tip?id=${tipName}`}
//             className="text-[#89617b] hover:underline"
//           >
//             {tipName || "Not Available"}
//           </Link>
//         </li>
//       </ol>
//     </div>
//   );
// };

// export default Tip;
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";

interface GalleryMonthsProps {
  programId: number;
  tipId: number;
}

const Tip: React.FC<GalleryMonthsProps> = ({ programId, tipId }) => {
  const [trainers, setTrainers] = useState<any>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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
          `https://dev.api.globalretrieversolutions.com/api/v1/program/tip-video/?main_video=${programId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
          }
        );

        // Process the response
        setTrainers(response?.data?.results || []);
      } catch (error) {
        console.error("An error occurred during the API call:", error);
      }
    };

    fetchData();
  }, [programId]);

  if (!isAuthenticated) {
    return <p>Please log in to view this content.</p>;
  }

  return (
    <div className="ml-4">
      <ol className="list-disc ml-3  text-left ">
        {trainers.map((item: any, itemIndex: any) => (
          <li style={{ fontSize: "13px" }} key={itemIndex}>
            <Link
              href={`/tip?id=${tipId}`}
              className="text-[#89617b] hover:underline"
            >
              {item?.name || "Not Available"}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Tip;
