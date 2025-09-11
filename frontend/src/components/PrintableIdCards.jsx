import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import IdCard from "../pages/IdCard";

const PrintableIdCards = () => {
  const printRef = useRef();

  return (
    <div className="mt-[6rem] lg:mt-2 flex flex-col mx-4 p-4 w-[90vw] lg:max-w-[75vw] lg:ml-[23vw] xl:ml-[20vw] bg-[var(--color-primary)] rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center px-4 mb-4">
        <h2 className="text-white font-bold text-2xl">ID Cards</h2>
        <ReactToPrint
          trigger={() => (
            <button className="px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg shadow hover:bg-[var(--color-tertiary)] hover:text-black transition">
              Print A3
            </button>
          )}
          content={() => printRef.current}
          pageStyle={`
            @page { size: A3 landscape; margin: 5mm; }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            #print-cards {
              display: grid !important;
              grid-template-columns: repeat(auto-fit, minmax(85.6mm, 1fr)) !important;
              gap: 6mm !important;
              justify-content: center !important;
              align-items: start !important;
            }
            #print-cards > div {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .portrait { width: 53.98mm !important; height: 85.6mm !important; }
            .landscape { width: 85.6mm !important; height: 53.98mm !important; }
          `}
        />
      </div>

      {/* Printable content */}
      <div ref={printRef}>
        <IdCard />
      </div>
    </div>
  );
};

export default PrintableIdCards;
