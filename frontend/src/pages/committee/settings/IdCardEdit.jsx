import React, { useState } from "react";
import { IoCaretBack } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import qrImg from "../../../assets/qrcode.jpg";
import { useAddIdCardUiMutation } from "../../../redux/api/customApi";
import { toast } from "react-toastify";

const portrait = "w-[53.98mm] h-[85.6mm]";
const landscape = "w-[97.86mm] h-[39.88mm]";

const IdCardEdit = ({ settingsToggle }) => {
  const initialState = {
    orientation: landscape,
    preview: null,
    previewDisplay: {
      name: null,
      id: null,
      team: null,
      zone: null,
      profileImg: null,
    },
    colorTab: {
      name: "black",
      id: "black",
      team: "black",
      zone: "black",
    },
    fontSize: {
      name: 14,
      id: 14,
      team: 14,
      zone: 14,
    },
    fontBold: {
      name: 500,
      id: 500,
      team: 500,
      zone: 500,
    },
    textAlign: {
      name: "left",
      id: "left",
      team: "left",
      zone: "left",
    },
    loaderPlacement: {
      name: { x: 0, y: 0 },
      id: { x: 0, y: 10 },
      team: { x: 0, y: 20 },
      zone: { x: 0, y: 30 },
      profileImg: { x: 10, y: 60 },
      qrCodeImg: { x: 50, y: 35 },
    },
    dropDown: {
      name: false,
      id: false,
      team: false,
      zone: false,
      profileImg: false,
      qrCodeImg: false,
    },
    imgWidth: {
      profileImg: 100,
      qrCodeImg: 50,
    },
    bgImgData: null,
    imgRadius: 10,
    imgMask: 10,
    visibleQr: null,
  };

  const [state, setState] = useState(initialState);
  const [UpdatedId, { isLoading }] = useAddIdCardUiMutation();

  const handleDropDown = (key) => {
    setState((prev) => ({
      ...prev,
      dropDown: { ...initialState.dropDown, [key]: !prev.dropDown[key] },
    }));
  };

  const handleImagePreview = (e) => {
    const img = e.target.files[0];
    if (img) {
      const imgUrl = URL.createObjectURL(img);
      setState((prev) => ({
        ...prev,
        preview: imgUrl,
        bgImgData: img,
      }));
    }
  };

  const handleProfile = (e) => {
    const img = e.target.files[0];
    if (img) {
      const imgUrl = URL.createObjectURL(img);
      setState((prev) => ({
        ...prev,
        previewDisplay: { ...prev.previewDisplay, profileImg: imgUrl },
      }));
    }
  };

  const handleChange = (section, key, value) => {
    setState((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  const handleNestedChange = (section, subSection, key, value) => {
    setState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...prev[section][subSection],
          [key]:
            typeof value === "string" && !isNaN(value)
              ? parseInt(value)
              : value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("cardBg", state.bgImgData);

      const UiSettings = {
        orientation: state.orientation === portrait ? "portrait" : "landscape",
        name: {
          color: state.colorTab.name,
          fontSize: state.fontSize.name,
          fontWeight: state.fontBold.name,
          positionX: state.loaderPlacement.name.x,
          positionY: state.loaderPlacement.name.y,
          textAlign: state.textAlign.name,
        },
        idText: {
          color: state.colorTab.id,
          fontSize: state.fontSize.id,
          fontWeight: state.fontBold.id,
          positionX: state.loaderPlacement.id.x,
          positionY: state.loaderPlacement.id.y,
          textAlign: state.textAlign.id,
        },
        team: {
          color: state.colorTab.team,
          fontSize: state.fontSize.team,
          fontWeight: state.fontBold.team,
          positionX: state.loaderPlacement.team.x,
          positionY: state.loaderPlacement.team.y,
          textAlign: state.textAlign.team,
        },
        zone: {
          color: state.colorTab.zone,
          fontSize: state.fontSize.zone,
          fontWeight: state.fontBold.zone,
          positionX: state.loaderPlacement.zone.x,
          positionY: state.loaderPlacement.zone.y,
          textAlign: state.textAlign.zone,
        },
        profileImage: {
          size: state.imgWidth.profileImg,
          borderRadius: state.imgRadius,
          zIndex: state.imgMask,
          positionX: state.loaderPlacement.profileImg.x,
          positionY: state.loaderPlacement.profileImg.y,
        },
        qrCode: {
          visible: state.visibleQr !== null,
          size: state.imgWidth.qrCodeImg,
          positionX: state.loaderPlacement.qrCodeImg.x,
          positionY: state.loaderPlacement.qrCodeImg.y,
        },
      };

      formData.append("settings", JSON.stringify(UiSettings));
      await UpdatedId(formData).unwrap();
      toast.success("Id Card Styles saved successfully");
    } catch (error) {
      toast.error(`${error.data?.message || error.message}`);
    }
  };

  const renderInputField = (
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    options = {}
  ) => {
    return (
      <div className="mt-4">
        <label className="text-white">{label}</label>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className="w-full p-1 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
          {...options}
        />
      </div>
    );
  };

  const renderSliderControl = (
    label,
    value,
    onChange,
    min,
    max,
    step = 1,
    unit = ""
  ) => {
    return (
      <div className="mt-4">
        <label className="text-white block mb-2 text-sm font-medium">
          {label}
        </label>
        <div className="flex w-full items-center gap-4">
          <input
            type="range"
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <input
            className="w-16 px-2 py-1 text-sm text-center text-white bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            type="text"
            readOnly
            value={`${value}${unit}`}
          />
        </div>
      </div>
    );
  };

  const renderPositionControls = (section) => {
    return (
      <div className="mt-4 w-full">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-white text-sm">X (left)</label>
            <input
              type="range"
              value={state.loaderPlacement[section].x}
              onChange={(e) =>
                handleNestedChange(
                  "loaderPlacement",
                  section,
                  "x",
                  e.target.value
                )
              }
              className="w-full rounded-lg bg-gray-700 h-2 appearance-none"
            />
          </div>
          <div className="flex-1">
            <label className="text-white text-sm">Y (top)</label>
            <input
              type="range"
              value={state.loaderPlacement[section].y}
              onChange={(e) =>
                handleNestedChange(
                  "loaderPlacement",
                  section,
                  "y",
                  e.target.value
                )
              }
              className="w-full rounded-lg bg-gray-700 h-2 appearance-none"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (section, title, fields) => {
    return (
      <>
        <div
          onClick={() => handleDropDown(section)}
          className="mt-4 text-white flex flex-row items-center justify-between text-base w-full"
        >
          <h1>{title}</h1>
          <IoIosArrowDown
            className={`transition-transform duration-300 ${
              state.dropDown[section] ? "rotate-180" : ""
            }`}
          />
        </div>

        {state.dropDown[section] && (
          <div>
            {fields.map((field) => {
              if (field.type === "text") {
                return renderInputField(
                  field.label,
                  state.previewDisplay[section],
                  (e) =>
                    handleChange("previewDisplay", section, e.target.value),
                  "text",
                  field.placeholder
                );
              } else if (field.type === "color") {
                return renderInputField(
                  field.label,
                  state.colorTab[section],
                  (e) => handleChange("colorTab", section, e.target.value),
                  "color"
                );
              } else if (field.type === "slider") {
                return renderSliderControl(
                  field.label,
                  state[field.section][section],
                  (e) => handleChange(field.section, section, e.target.value),
                  field.min,
                  field.max,
                  field.step,
                  field.unit
                );
              } else if (field.type === "position") {
                return renderPositionControls(section);
              } else if (field.type === "align") {
                return (
                  <div className="mt-4">
                    <label className="text-white">{field.label}</label>
                    <select
                      value={state.textAlign[section]}
                      onChange={(e) =>
                        handleChange("textAlign", section, e.target.value)
                      }
                      className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="h-[100dvh] w-screen md:w-[50vw] lg:w-[80vw] xl:w-[60vw] overflow-y-auto scrollbar-hide flex flex-col items-center inset-0 lg:border-l-2 md:border-l-2 border-black bg-[var(--color-primary)]">
      <div className="p-4 text-white flex flex-col items-center">
        <div className="flex w-full items-center md:justify-center pl-1 gap-1">
          <IoCaretBack
            onClick={settingsToggle}
            className="text-2xl md:hidden"
          />
          <h1 className="text-white text-2xl font-bold mt-1">
            Id Card Settings
          </h1>
        </div>
        <p className="leading-5 pt-3 text-center animate-pulse">
          Set id card by uploading background and sample details
        </p>
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          <div className="w-[85.6mm] lg:w-full flex flex-col lg:flex-row items-center lg:overflow-y-hidden lg:items-start">
            <div className="lg:w-1/2 lg:p-10 p-5">
              <select
                value={state.orientation}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, orientation: e.target.value }))
                }
                className="w-full mt-4 p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
                required
              >
                <option value={portrait}>Portrait</option>
                <option value={landscape}>Landscape</option>
              </select>

              <div className="mt-4">
                <label className="text-white">Choose background</label>
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png, .webp"
                  className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
                  onChange={handleImagePreview}
                />
              </div>

              <div
                className={`relative ${
                  state.orientation || "w-[85.6mm] h-[53.98mm]"
                } bg-current rounded-lg items-center z-20 m-auto mt-5`}
              >
                {state.preview && (
                  <>
                    <img
                      src={state.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />

                    {["name", "id", "team", "zone"].map(
                      (section) =>
                        state.previewDisplay[section] && (
                          <h3
                            key={section}
                            className="absolute z-10 text-black"
                            style={{
                              top: `${state.loaderPlacement[section].y}%`,
                              left: `${state.loaderPlacement[section].x}%`,
                              fontWeight: state.fontBold[section],
                              fontSize: `${state.fontSize[section]}px`,
                              color: state.colorTab[section],
                              textAlign: state.textAlign[section],
                              transform:
                                state.textAlign[section] === "center"
                                  ? "translateX(-50%)"
                                  : state.textAlign[section] === "right"
                                  ? "translateX(-100%)"
                                  : "none",
                            }}
                          >
                            {state.previewDisplay[section]}
                          </h3>
                        )
                    )}

                    {state.previewDisplay.profileImg && (
                      <img
                        src={state.previewDisplay.profileImg}
                        alt="Profile"
                        className="absolute text-black"
                        style={{
                          top: `${state.loaderPlacement.profileImg.y}%`,
                          left: `${state.loaderPlacement.profileImg.x}%`,
                          width: `${state.imgWidth.profileImg}px`,
                          height: `${state.imgWidth.profileImg}px`,
                          borderRadius: `${state.imgRadius}%`,
                          objectFit: "cover",
                          zIndex: state.imgMask,
                        }}
                      />
                    )}

                    {state.visibleQr && (
                      <img
                        src={state.visibleQr}
                        alt="QR Code"
                        className="absolute z-10"
                        style={{
                          top: `${state.loaderPlacement.qrCodeImg.y}%`,
                          left: `${state.loaderPlacement.qrCodeImg.x}%`,
                          width: `${state.imgWidth.qrCodeImg}px`,
                          height: `${state.imgWidth.qrCodeImg}px`,
                          objectFit: "contain",
                        }}
                      />
                    )}
                  </>
                )}
              </div>

              <div className="flex w-full items-center justify-center">
                <button
                  type="submit"
                  className="w-[53.98mm] mt-4 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] text-black font-bold rounded-lg transition duration-300"
                >
                  {isLoading ? "Updating Ui..." : "Update Ui"}
                </button>
              </div>
            </div>

            <div className="lg:w-1/2 lg:p-10 p-5">
              {renderSection("name", "Student Name", [
                {
                  type: "text",
                  label: "Name",
                  placeholder: "Enter Sample Name",
                },
                { type: "color", label: "Text Color" },
                {
                  type: "slider",
                  label: "Font Size",
                  section: "fontSize",
                  min: 6,
                  max: 50,
                  unit: "px",
                },
                {
                  type: "slider",
                  label: "Font Bold",
                  section: "fontBold",
                  min: 100,
                  max: 900,
                  step: 100,
                },
                { type: "align", label: "Text Alignment" },

                { type: "position" },
              ])}

              {renderSection("id", "Student Id", [
                { type: "text", label: "Id", placeholder: "Enter Sample Id" },
                { type: "color", label: "Text Color" },
                {
                  type: "slider",
                  label: "Font Size",
                  section: "fontSize",
                  min: 6,
                  max: 50,
                  unit: "px",
                },
                {
                  type: "slider",
                  label: "Font Bold",
                  section: "fontBold",
                  min: 100,
                  max: 900,
                  step: 100,
                },
                { type: "align", label: "Id Alignment" },

                { type: "position" },
              ])}

              {renderSection("team", "Student Team", [
                {
                  type: "text",
                  label: "Team",
                  placeholder: "Enter Sample Team",
                },
                { type: "color", label: "Text Color" },
                {
                  type: "slider",
                  label: "Font Size",
                  section: "fontSize",
                  min: 6,
                  max: 50,
                  unit: "px",
                },
                {
                  type: "slider",
                  label: "Font Bold",
                  section: "fontBold",
                  min: 100,
                  max: 900,
                  step: 100,
                },
                { type: "align", label: "Team Alignment" },

                { type: "position" },
              ])}

              {renderSection("zone", "Student Zone", [
                {
                  type: "text",
                  label: "Zone",
                  placeholder: "Enter Sample Zone",
                },
                { type: "color", label: "Text Color" },
                {
                  type: "slider",
                  label: "Font Size",
                  section: "fontSize",
                  min: 6,
                  max: 50,
                  unit: "px",
                },
                {
                  type: "slider",
                  label: "Font Bold",
                  section: "fontBold",
                  min: 100,
                  max: 900,
                  step: 100,
                },
                { type: "align", label: "Zone Alignment" },

                { type: "position" },
              ])}

              <div
                onClick={() => handleDropDown("profileImg")}
                className="mt-4 text-white flex flex-row items-center justify-between text-base w-full"
              >
                <h1>Student Photo</h1>
                <IoIosArrowDown
                  className={`transition-transform duration-300 ${
                    state.dropDown.profileImg ? "rotate-180" : ""
                  }`}
                />
              </div>

              {state.dropDown.profileImg && (
                <div className="w-full">
                  <div className="mt-4">
                    <label className="text-white">Photo</label>
                    <input
                      type="file"
                      accept=".jpg, .jpeg, .png, .webp"
                      placeholder="Enter Sample Photo"
                      onChange={handleProfile}
                      className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
                    />
                  </div>

                  {renderSliderControl(
                    "Size",
                    state.imgWidth.profileImg,
                    (e) =>
                      handleChange("imgWidth", "profileImg", e.target.value),
                    50,
                    150
                  )}

                  {renderSliderControl(
                    "Border Radius",
                    state.imgRadius,
                    (e) =>
                      setState((prev) => ({
                        ...prev,
                        imgRadius: Number(e.target.value),
                      })),
                    0,
                    50,
                    1,
                    "%"
                  )}

                  <div className="mt-4 flex w-full items-center justify-between">
                    <label className="text-white">Bring to back</label>
                    <input
                      type="checkbox"
                      // checked={state.imgMask === -10}
                      onChange={() =>
                        setState((prev) => ({
                          ...prev,
                          imgMask: prev.imgMask === 10 ? -10 : 10,
                        }))
                      }
                      className="w-5 h-5 accent-[var(--color-secondary)]"
                    />
                  </div>
                  {renderPositionControls("profileImg")}
                </div>
              )}

              <div
                onClick={() => handleDropDown("qrCodeImg")}
                className="mt-4 text-white flex rou flex-row items-center justify-between text-base w-full"
              >
                <h1>Student Qr Code</h1>
                <IoIosArrowDown
                  className={`transition-transform duration-300 ${
                    state.dropDown.qrCodeImg ? "rotate-180" : ""
                  }`}
                />
              </div>

              {state.dropDown.qrCodeImg && (
                <div className="w-full">
                  <div className="mt-4 flex w-full items-center justify-between">
                    <label className="text-white">QR Image</label>
                    <input
                      type="checkbox"
                      onChange={() =>
                        setState((prev) => ({
                          ...prev,
                          visibleQr: prev.visibleQr ? null : qrImg,
                        }))
                      }
                      className="w-5 h-5 accent-[var(--color-secondary)]"
                    />
                  </div>

                  {renderSliderControl(
                    "Size",
                    state.imgWidth.qrCodeImg,
                    (e) =>
                      handleChange("imgWidth", "qrCodeImg", e.target.value),
                    0,
                    200
                  )}

                  {renderPositionControls("qrCodeImg")}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IdCardEdit;
