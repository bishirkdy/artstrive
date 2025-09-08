import React, { useState } from "react";
import { useAddZoneMutation } from "../../../redux/api/zoneApi";
import { toast } from "react-toastify";
import { useViewZoneQuery } from "../../../redux/api/zoneApi";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useDeleteZoneMutation } from "../../../redux/api/zoneApi";
import { Loader } from "../../../components/Loader";
import ErrorMessage from "../../../components/ErrorMessage";

const AddZone = () => {
  const [zone, setZone] = useState("");

  const [newZone , {isLoading : addZoneLoading }] = useAddZoneMutation();
  const { data, isLoading: zoneLoading, error , isError ,  refetch } = useViewZoneQuery();
  const [deletableData] = useDeleteZoneMutation();

  if (zoneLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
    );
  }
  
  if (isError) {
      const code = error?.originalStatus || "Error";
      const details = error?.error || error?.data || "Something went wrong";
      const title = error?.status ||  "Error fetching zones";
      return (
        <ErrorMessage
          code={code}
          title={title}
          details={details}
        />
      );
    }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await newZone({ zone }).unwrap();

      setZone("");
      toast.success("Zone added successfully", { position: "bottom-right" });
      refetch();
    } catch (error) {
      toast.error(`Error adding zone: ${error?.data?.message || error.message}`);
    }
  };
  const handleDelete = async (id) => {
    try {
      await deletableData(id).unwrap();
      toast.success("Zone deleted successfully", {
        autoClose: 3000,
        position: "bottom-right",
      });
      refetch();
    } catch (error) {
      toast.error(        
        `Error deleting zone: ${error.data?.message || error.message}`
      );
    }
  };
  return (
    <div className="mx-auto mt-[4rem] flex flex-col p-6 w-[90vw] md:max-w-md bg-[#121212] rounded-lg shadow-lg">
      <h1 className="text-white text-2xl font-semibold text-center mb-4">
        Add zone
      </h1>
      <form onSubmit={handleSubmit} className="flex  flex-col space-y-4">
        <div className="flex flex-col">
          <label className="text-white font-medium mb-1">Zone Name</label>
          <input
            type="text"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            placeholder="Enter zone name"
            className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[#13F287] focus:outline-none"
          />
        </div>
        <button
          className="w-full mt-2 py-2 bg-[#13F287] hover:bg-[#7dcca6] text-white font-bold rounded-lg transition duration-300"
          type="submit"
        > {addZoneLoading ? `Adding ${zone}` : "Add Zone"}
        </button>
      </form>
      <div className="mt-6">
        <h2 className="text-white text-xl font-semibold">Zones</h2>
        <ul className="mt-2 space-y-3">
          {Array.isArray(data) && data.length > 0 ? (
            data.map((zone, index) => (
              <li key={index} className="bg-black text-white p-2 rounded-lg">
                <div className="flex items-center justify-between">
                  {zone.zone}
                  <span className="flex gap-2">
                    <button onClick={() => handleDelete(zone._id)}>
                      <MdOutlineDeleteForever className="text-red-500 text-xl" />
                    </button>
                  </span>
                </div>
              </li>
            ))
          ) : (
            <p className="text-white">No zone available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AddZone;
