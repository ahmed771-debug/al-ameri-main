"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchTrainerPrograms } from "@/redux/slice/programs";
import GalleryMonths from "./months";

interface GalleryProgramsProps {
  programName: any;
  trainerId: number;
  firstName: string;
  lastName: string;
}

const GalleryPrograms: React.FC<GalleryProgramsProps> = ({
  programName,
  trainerId,
}) => {
  const dispatch = useAppDispatch();
  const [message, setMessge] = useState<any>();

  // Access Trainer Program Redux state
  const {
    data: programsByTrainerId,
    isLoading,
    isError,
    errorMessage,
  } = useAppSelector((state) => state.Programs);

  useEffect(() => {
    dispatch(fetchTrainerPrograms(trainerId)); // Fetch programs data for the specific trainerId
  }, [dispatch, trainerId]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading programs: </p>;

  const trainerPrograms = programsByTrainerId[trainerId] || [];
  // Gruping the program id and name
  const trainerDetails = Array.isArray(programsByTrainerId)
    ? programsByTrainerId.map((trainer: any) => ({
        id: trainer.id,
      }))
    : [];

  return (
    <>
      {
        trainerPrograms.length > 0 ? (
          trainerPrograms.map((program: any, index: number) => (
            <div key={index} className="mb-5 border-b">
              <h2
                className="text-medium text-primary font-bold py-4 mb-1 bg-[#F0EAEE]"
                style={{ borderRadius: "5.51px 5.51px 0px 0px" }}
              >
                {program.name}
              </h2>

              <GalleryMonths programId={program.id} monthName={setMessge} />
            </div>
          ))
        ) : (
          <p></p>
        ) // ""
      }
    </>
  );
};

export default GalleryPrograms;
