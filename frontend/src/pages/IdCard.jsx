import React from "react";
import { useAllStudentQuery } from "../redux/api/studentApi";
import { useGetIdCardUiQuery } from "../redux/api/customApi";
import { useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const portrait = "w-[53.98mm] h-[85.6mm]";
const landscape = "w-[85.6mm] h-[53.98mm]";
const claud_profile = import.meta.env.VITE_CLOUDINARY_PROFILE_URL;

const xShiftForAlign = (align) =>
  align === "center"
    ? "translateX(-50%)"
    : align === "right"
    ? "translateX(-100%)"
    : "translateX(0)";

const CardText = ({ text, cfg }) => {
  const align = cfg?.textAlign || "left";
  return (
    <h3
      className="absolute z-10"
      style={{
        top: `${cfg?.positionY ?? 0}%`,
        left: `${cfg?.positionX ?? 0}%`,
        transform: xShiftForAlign(align),
        fontWeight: cfg?.fontWeight ?? 500,
        fontSize: `${cfg?.fontSize ?? 14}px`,
        color: cfg?.color ?? "#000",
        whiteSpace: "nowrap",
        lineHeight: 1.1,
      }}
    >
      {text}
    </h3>
  );
};

const IdCard = () => {
  const { data, isLoading, error: studentError } = useAllStudentQuery();
  const {
    data: idCardUi,
    isLoading: idCardUiLoading,
    error: idCardUiError,
  } = useGetIdCardUiQuery();
  const isAdmin = useSelector((s) => s.auth.user.user.isAdmin);
  const sameTeam = useSelector((s) => s.auth.user.user.teamName);

  if (isLoading || idCardUiLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );

  const error = studentError || idCardUiError;
  if (error) {
    const code = error.originalStatus || "Error";
    const details = error.error || error.data || "Something went wrong";
    const title = error.status || "Error fetching zones";
    return <ErrorMessage code={code} title={title} details={details} />;
  }
  if (!data?.length) return <h1 className="p-4">No student data found</h1>;
  if (!idCardUi) return <h1 className="p-4">No ID card UI settings</h1>;

  const filteredData = isAdmin
    ? data
    : data.filter((s) => s.team.teamName === sameTeam);

  const formatData = (name) => name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div className="mt-[6rem] lg:mt-2 flex flex-col mx-4 p-4 w-[90vw] lg:max-w-[75vw] lg:ml-[23vw] xl:ml-[20vw] bg-[var(--color-primary)] rounded-lg shadow-lg">
      <h2 className="text-white font-bold text-2xl text-center mb-4">
        ID Cards
      </h2>
      <div className="flex flex-wrap mx-auto items-center gap-4 justify-center overflow-auto">
        {filteredData.map((student) => (
          <div
            key={student._id}
            className={`relative bg-current shadow rounded-xl hover:shadow-md transition-shadow ${
              idCardUi.orientation === "landscape" ? landscape : portrait
            }`}
          >
            {idCardUi.cardImg && (
              <img
                src={idCardUi.cardImg}
                alt=""
                className="object-cover w-full h-full"
              />
            )}

            <CardText text={formatData(student.name)} cfg={idCardUi.name} />
            <CardText text={student.id} cfg={idCardUi.idText} />
            <CardText
              text={formatData(student.team.teamName)}
              cfg={idCardUi.team}
            />
            <CardText text={student.zone.zone} cfg={idCardUi.zone} />

            {student.profile && (
              <img
                src={`${claud_profile}/${student.profile}`}
                alt=""
                className="absolute"
                style={{
                  top: `${idCardUi.profileImage?.positionY ?? 0}%`,
                  left: `${idCardUi.profileImage?.positionX ?? 0}%`,
                  width: `${idCardUi.profileImage?.size ?? 100}px`,
                  height: `${idCardUi.profileImage?.size ?? 100}px`,
                  borderRadius: `${idCardUi.profileImage?.borderRadius ?? 10}%`,
                  objectFit: "cover",
                  zIndex: idCardUi.profileImage?.zIndex ?? 10,
                }}
              />
            )}

            {idCardUi.qrCode?.visible !== false && (
              <img
                src={student.qrCode}
                alt=""
                className="absolute z-10"
                style={{
                  top: `${idCardUi.qrCode?.positionY ?? 0}%`,
                  left: `${idCardUi.qrCode?.positionX ?? 0}%`,
                  width: `${idCardUi.qrCode?.size ?? 60}px`,
                  height: `${idCardUi.qrCode?.size ?? 60}px`,
                  objectFit: "contain",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdCard;
