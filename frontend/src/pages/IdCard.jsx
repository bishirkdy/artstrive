import React, { useRef } from "react";
import { useAllStudentQuery } from "../redux/api/studentApi";
import { useGetIdCardUiQuery } from "../redux/api/customApi";
import { useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import printJS from "print-js";

const portrait = "w-[53.98mm] h-[85.6mm]";
const landscape = "w-[85.6mm] h-[53.98mm]";
const claud_profile = import.meta.env.VITE_CLOUDINARY_PROFILE_URL;
const printWidth = window.innerWidth > 769;
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
  const {
    data,
    isLoading,
    isError,
    error: studentError,
  } = useAllStudentQuery();
  const {
    data: idCardUi,
    isLoading: idCardUiLoading,
    error: idCardUiError,
    isError: idCardUiIsError,
  } = useGetIdCardUiQuery();
  const isAdmin = useSelector((s) => s.auth.user.user.isAdmin);
  const sameTeam = useSelector((s) => s.auth.user.user.teamName);

  const printRef = useRef(null);

  if (isLoading || idCardUiLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  const wOfIdCard = idCardUi?.orientation === "landscape";
  console.log(wOfIdCard);
  
  const error = studentError || idCardUiError;
  if (isError || idCardUiIsError) {
    const code = error?.originalStatus || "Error";
    const details = error?.error || error?.data || "Something went wrong";
    const title = error?.status || "Error fetching data";
    return <ErrorMessage code={code} title={title} details={details} />;
  }

  if (!data?.length) return <h1 className="p-4">No student data found</h1>;
  if (!idCardUi) return <h1 className="p-4">No ID card UI settings</h1>;

  const filteredData = isAdmin
    ? data
    : data.filter((s) => s.team.teamName === sameTeam);
  const formatData = (name) => name.charAt(0).toUpperCase() + name.slice(1);
  const SecondProfile =
    "https://www.pngmart.com/files/23/Profile-PNG-Photo.png";

  const handlePrint = () => {
    if (!printRef.current) return;
    printJS({
      printable: printRef.current,
      type: "html",
      targetStyles: ["*"],
      style: `
       @media print {
  #print-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(85.6mm , 1fr));
    gap: 1rem;
  }

  #print-cards > div {
    break-inside: avoid !important;       /* Avoid breaking inside card */
    page-break-inside: avoid !important;  /* Avoid breaking inside card */
    margin: 0.5rem;
    box-shadow: none;                     /* Remove shadow for print */
    border: 1px solid #ccc;               /* Optional: border */
    width: 53.98mm;                        /* Portrait default */
    height: 85.6mm;                        /* Portrait default */
  }

  /* Landscape card override */
  #print-cards > div.landscape {
    width: 85.6mm;
    height: 53.98mm;
  }
}
      `,
    });
  };

  return (
    <div className="mt-[6rem] lg:mt-2 flex flex-col mx-4 p-4 w-[90vw] lg:max-w-[75vw] lg:ml-[23vw] xl:ml-[20vw] bg-[var(--color-primary)] rounded-lg shadow-lg">
      <div className="flex justify-between items-center px-4 mb-6">
        <h2 className="text-white font-bold text-2xl">ID Cards</h2>
        <button
          onClick={handlePrint}
          className={`${!printWidth ? "hidden" : ""} px-4 py-2 bg-yellow-600 text-white rounded shadow hover:bg-yellow-700 transition`}
        >
          Print A3
        </button>
      </div>

      <div
        ref={printRef}
        id="print-cards"
        className={`${
          wOfIdCard 
            ? "grid gap-6 print:gap-0 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 lg:grid-cols-2"
            : "grid gap-6 print:gap-0 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 lg:grid-cols-3"
        }`}
        style={{ justifyItems: "center" }}
      >
        {filteredData.map((student) => (
          <div
            key={student._id}
            className={`relative bg-current rounded-xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden
              ${
                idCardUi.orientation === "landscape"
                  ? `landscape ${landscape}`
                  : `portrait ${portrait}`
              }`}
          >
            {idCardUi.cardImg && (
              <img
                src={idCardUi.cardImg}
                alt="card background"
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

            <img
              src={
                student.profile
                  ? `${claud_profile}/${student.profile}`
                  : SecondProfile
              }
              alt="profile"
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

            {idCardUi.qrCode?.visible !== false && (
              <img
                src={student.qrCode}
                alt="qr code"
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
