import React from "react";
import { useGetScannedStudentQuery } from "../../../redux/api/scannedApi";
import { useParams } from "react-router-dom";
import { Loader } from "../../../components/Loader";

const claud_profile = import.meta.env.VITE_CLOUDINARY_PROFILE_URL;
const ProfileScanned = () => {
  const { slug } = useParams();
  const parts = slug.split("-");
  const id = parts[parts.length - 1]
  const { data, isLoading, isError } = useGetScannedStudentQuery(id);
  console.log(id);
  
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader />
      </div>
    );
  return (
    <div className="flex flex-col mt-6 lg:mt-20 mx-2 md:ml-4 lg:ml-[23vw] xl:ml-[30vw] w-[96vw] max-w-3xl bg-[var(--color-primary)] rounded-2xl shadow-2xl p-10">
      <h1 className="text-center text-3xl text-white font-extrabold mb-12 tracking-wide">
        Profile
      </h1>

      <div className="flex flex-col lg:flex-row items-center mb-8 lg:items-start text-white space-y-8 lg:space-y-0 lg:space-x-12">
        <div className="flex-shrink-0 -mt-3 m-auto">
          <img
            src={`${claud_profile}/${data.profile}`}
            alt="Profile"
            className="w-52 h-52 object-cover rounded-full border-4 shadow-lg transform hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex flex-col space-y-6 w-full md:w-[45%] max-w-lg">
          {[
            { label: "Name", value: data.name },
            { label: "ID", value: data.id },
            { label: "Team", value: data.team.teamName },
            { label: "Zone", value: data.zone.zone },
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center pb-2">
              <span className="font-semibold text-[var(--color-secondary)] text-lg">
                {item.label}
              </span>
              <span className="text-gray-300 text-lg">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileScanned;
