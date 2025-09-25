import * as React from "react";
import { ChartContainer } from "@mui/x-charts/ChartContainer";
import { LinePlot, MarkPlot } from "@mui/x-charts/LineChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";

import { ChartsLegend, ChartsTooltip } from "@mui/x-charts";

const teamColors = ["#FF5733", "#33C1FF", "#9D33FF"];
export default function LineChartWithReferenceLines({ data }) {
  const isMobile = window.innerWidth < 768;

  let series = [];

  if (data && typeof data === "object") {
    const teamNames = Object.keys(data);

    if (
      teamNames.length > 0 &&
      Array.isArray(data[teamNames[0]]) &&
      data[teamNames[0]].length > 0
    ) {
      series = teamNames.map((teamName, index) => ({
        data: Array.isArray(data[teamName]) ? data[teamName].slice(0, 8) : [],
        label: teamName,
        type: "line",
        color: teamColors[index % teamColors.length],
      }));
    } else {
      series = [{ data: [], label: "No Data", type: "line" }];
    }
  } else {
    series = [{ data: [], label: "No Data", type: "line" }];
  }

  const xLabels = [
    "0",
    "After 10 %",
    "After 30 %",
    "After 50 %",
    "After 60 %",
    "After 75 %",
    "After 90 %",
    "Final",
  ];
  return (
    <div
      className={`rounded-2xl mt-4 bg-[#111111] w-full overflow-x-auto shadow-lg flex items-center justify-center transition-transform duration-300 p-2 text-white ${
        !isMobile ? "scrollbar-hide" : ""
      }`}
    >
      <div className="w-full">
        <h2 className="text-lg md:text-2xl font-semibold md:mb-2 text-center">
          Performance Over Time
        </h2>
        <ChartContainer
          width={800}
          height={300}
          series={series}
          xAxis={[
            {
              scaleType: "point",
              data: xLabels,
              tickLabelStyle: { fill: "white", fontSize: "0.75rem" },
            },
          ]}
          yAxis={[{ tickLabelStyle: { fill: "white", fontSize: "0.75rem" } }]}
        >
          <LinePlot />
          <MarkPlot />
          {/* <ChartsReferenceLine x="After 50 %" lineStyle={{ stroke: "red" }} /> */}
          <ChartsTooltip trigger="axis" />
          <ChartsLegend
            labelStyle={{
              fill: "white",
              fontSize: "0.95rem",
              paddingBottom: "1rem",
            }}
          />

          <ChartsXAxis label="Results" labelStyle={{ fill: "white" }} />
          <ChartsYAxis label="Scores" labelStyle={{ fill: "white" }} />
        </ChartContainer>
      </div>
    </div>
  );
}
