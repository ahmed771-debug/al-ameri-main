"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getApi } from "@/utils/apis";
import { URLS } from "@/utils/constants";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Tooltip,
  Input,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { debounce } from "lodash";
import Cookies from "js-cookie";
import { fetchSubscription } from "@/redux/slice/subscription";

export default function SearchUser() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<any>({ results: [], next: null }); // Initialize with empty results and null for next
  const [loadingMore, setLoadingMore] = useState(false); // To track when more data is loading
  const scrollRef = useRef<HTMLUListElement>(null); // Reference to the scrollable container

  const { subscription, accountType } = useAppSelector((state) => ({
    subscription: state.getSubscription.data,
    accountType: state.AccountType.data,
  }));
  const token = Cookies.get("access_token");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const fetchData = async (query: string, url?: string) => {
    if (!query) {
      setData({ results: [], next: null }); // Clear data if there's no query
      return;
    }

    try {
      // if (!token) {
      //   console.error("Access token is not available.");
      //   return;
      // }

      const apiUrl =
        url || `${URLS.GET_Search}?search=${encodeURIComponent(query)}`; // Use `url` for pagination or new search
      const response = await getApi(apiUrl);

      if (response) {
        if (url) {
          // Infinite scroll (append new data)
          setData((prevData: any) => ({
            results: [...prevData.results, ...response.data.results], // Append new results
            next: response.data.next, // Update the next URL
          }));
        } else {
          // New search (replace previous data)
          setData({
            results: response.data.results,
            next: response.data.next,
          });
        }
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("error:", error);
    }
  };
  useEffect(() => {
    dispatch(fetchSubscription());
  }, []);
  const debouncedFetchData = debounce(fetchData, 500);

  useEffect(() => {
    debouncedFetchData(searchTerm);
    return () => {
      debouncedFetchData.cancel();
    };
  }, [searchTerm]);

  // Detect when user scrolls to the bottom of the modal body
  const handleScroll = () => {
    const container = scrollRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        // User reached the bottom
        if (data.next && !loadingMore) {
          setLoadingMore(true);
          fetchData(searchTerm, data.next); // Fetch the next page of data
          setLoadingMore(false);
        }
      }
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [data, searchTerm]);

  const filteredData = data?.results
    ?.map((item: any) => ({
      id: item?.user_id,
      program_id: item?.program_id,
      month_id: item?.month_id,
      name: `${item?.first_name} ${item?.last_name}`,
      programs: item?.program_name || "",
      main: item?.main_video_name || "",
      tip: item?.tip_video_name || "",
    }))
    .filter((item: any) => {
      const term = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(term) ||
        item.programs.toLowerCase().includes(term) ||
        item.main.toLowerCase().includes(term) ||
        item.tip.toLowerCase().includes(term)
      );
    });

  const highlightText = (text: string) => {
    const term = searchTerm.toLowerCase();
    const index = text?.toLowerCase()?.indexOf(term);

    if (index === -1) return text;

    const beforeMatch = text?.substring(0, index);
    const match = text?.substring(index, index + term.length);
    const afterMatch = text?.substring(index + term.length);

    return (
      <>
        {beforeMatch}
        <span className="font-bold text-yellow-400">{match}</span>
        {afterMatch}
      </>
    );
  };

  const renderSearchResults = () => {
    if (filteredData?.length === 0) {
      return <li className="text-black rounded-2xl p-4">No results found</li>;
    }

    return filteredData?.map((result: any, index: any) => (
      <li
        key={index}
        className="overflow-x-auto text-black rounded-2xl p-5 pr-7 mb-2 border-b-3 hover:bg-primary hover:text-white text-balance"
      >
        {/* Render name first */}
        <div
          onClick={() => {
            if (subscription.length !== 0) {
              window.location.href = `${window.location.protocol}//${window.location.host}/trainer?id=${result.id}&name=${result.name}`;
            }
            // router.push(`trainer?id=${result.id}&name=${result.name}`)
          }}
          className="flex gap-2 items-center"
        >
          <Link
            className="flex hover:text-yellow-200 p-3 rounded transition-colors duration-200 closemodal"
            href={""}
            prefetch
          >
            <span className="text-small flex gap-1 items-baseline cursor-pointer text-balance">
              <span className="font-bold">Name: </span>

              <div>{highlightText(result.name)}</div>
            </span>
          </Link>
        </div>

        {/* Render other details if they match */}
        {result.programs && highlightText(result.programs) && (
          <div
            onClick={() => {
              if (subscription.length !== 0) {
                window.location.href = `${window.location.protocol}//${window.location.host}/programs?program=${result.program_id}&name=${result.programs}`;
              }
            }}
            className="flex gap-2 items-center"
          >
            <Link
              className="flex hover:text-yellow-200 p-3 rounded transition-colors duration-200 closemodal"
              href={``}
            >
              <span className="text-small flex gap-1 items-baseline cursor-pointer text-balance">
                <span className="font-bold">Programs: </span>
                <div>{highlightText(result.programs)}</div>
              </span>
            </Link>
          </div>
        )}

        {result.main && highlightText(result.main) && (
          <div
            onClick={() => {
              if (subscription.length !== 0) {
                window.location.href = `${window.location.protocol}//${window.location.host}/main?id=${result.month_id}&name=${result.main}`;
              }
            }}
            className="flex gap-2 items-center"
          >
            <Link
              className="flex hover:text-yellow-200 p-3 rounded transition-colors duration-200 closemodal"
              id="closemodal"
              href={``}
            >
              <span className="text-small flex gap-1 items-baseline cursor-pointer text-balance">
                <span className="font-bold text">Main Video: </span>{" "}
                <div>{highlightText(result.main)} </div>
              </span>
            </Link>
          </div>
        )}

        {result.tip && highlightText(result.tip) && (
          <div
            // onClick={() =>
            //   router.push(`tip?id=${result.month_id}&name=${result.tip}`)
            // }
            onClick={() => {
              if (subscription.length !== 0) {
                window.location.href = `${window.location.protocol}//${window.location.host}/tip?id=${result.month_id}&name=${result.tip}`;
              }
            }}
            className="flex gap-2 items-center"
          >
            <Link
              className="flex hover:text-yellow-200 p-3 rounded transition-colors duration-200 closemodal"
              id="closemodal"
              href={``}
            >
              <span className="text-small flex gap-1 items-baseline cursor-pointer text-balance">
                <span className="font-bold">Tip Video: </span>{" "}
                <div>{highlightText(result.tip)}</div>
              </span>
            </Link>
          </div>
        )}
      </li>
    ));
  };

  return (
    <Tooltip showArrow content="Search" closeDelay={5}>
      <div
        onClick={onOpen}
        className="border border-[#674960] p-3 rounded-3xl cursor-pointer"
      >
        <FaMagnifyingGlass className="text-[#674960]" size={13} />
        <Modal
          size="lg"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          style={{ maxHeight: "30rem", overflow: "hidden" }}
          backdrop="opaque"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h2>Search...</h2>
                </ModalHeader>
                <ModalBody style={{ overflow: "hidden" }}>
                  <Input
                    classNames={{
                      base: "max-w-full sm:w-auto",
                      mainWrapper: "h-full",
                      input: "text-small",
                      inputWrapper:
                        "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                    }}
                    size="md"
                    placeholder="Search here....."
                    startContent={
                      <FaMagnifyingGlass className="text-[#674960]" size={17} />
                    }
                    type="search"
                    radius="full"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <ul
                    className="mt-2 text-balance overflow-auto"
                    style={{ maxHeight: "400px" }}
                    ref={scrollRef}
                  >
                    {searchTerm ? renderSearchResults() : null}
                  </ul>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </Tooltip>
  );
}
