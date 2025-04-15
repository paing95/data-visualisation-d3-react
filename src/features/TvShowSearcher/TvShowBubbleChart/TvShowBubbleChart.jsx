import { useEffect, useRef, useState } from "react";

/* d3 */
import { format, hierarchy, pack, select, scaleOrdinal, max } from "d3";

/* css */
import "./TvShowBubbleChart.css";

const margin = 1;
const d3format = format(",d");
const color = scaleOrdinal([
  "#5E81AC",
  "#88C0D0",
  "#81A1C1",
  "#A3BE8C",
  "#EBCB8B",
  "#D08770",
  "#B48EAD",
  "#E5E9F0",
  "#D8DEE9",
  "#8FBCBB",

  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#CDB4DB",
  "#FFC6FF",
  "#A0C4FF",
  "#CAFFBF",
  "#FDFFB6",
  "#FFADAD",

  "#C9ADA7",
  "#FFE5B4",
  "#B8B8FF",
  "#9EADC8",
  "#CED4DA",
  "#E2CFC3",
  "#A1C181",
  "#DAB894",
  "#C3B091",
  "#8C7853",

  "#1ABC9C",
  "#3498DB",
  "#9B59B6",
  "#E67E22",
  "#E74C3C",
  "#2ECC71",
  "#34495E",
  "#F39C12",
]);
const group = (d) => d.name;
const names = (d) => d.name;
const xAxisOffsetValue = 140;
const tickSpacing = 30;
const tickSize = 10;
const tickTextOffset = 20;
const fadeOpacity = 0.2;

export const TvShowBubbleChart = ({
  data,
  width = window.innerWidth,
  height = window.innerHeight,
}) => {
  const svgRef = useRef();
  const [hoveredGenre, setHoveredGenre] = useState(null);
  const [maxRadius, setMaxRadius] = useState();

  useEffect(() => {
    if (!svgRef.current) return;

    select(svgRef.current).selectAll("*").remove();

    const gpack = pack()
      .size([width - margin * 2, height - margin * 2])
      .padding(3);

    const root = gpack(hierarchy({ children: data }).sum((d) => d.value));
    setMaxRadius(max(root.leaves().map((n) => n.r)));

    const node = select(svgRef.current)
      .append("g")
      .selectAll()
      .data(root.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    // Add a title.
    node.append("title").text((d) => `${d.data.name}\n${d3format(d.value)}`);

    // Add a filled circle.
    node
      .append("circle")
      .attr("class", "main-circle")
      .attr("fill-opacity", 0.7)
      .attr("fill", (d) => color(group(d.data)))
      .attr("r", (d) => d.r);

    // Add text to circles
    const text = node.append("text").attr("class", "circle-text");

    text
      .append("tspan")
      .attr("font-size", (d) => d.r / 7)
      .text((d) => names(d.data));

    text
      .append("tspan")
      .attr("x", 0)
      .attr("y", (d) => d.r / 7)
      .attr("font-size", (d) => d.r / 7)
      .attr("fill-opacity", 0.7)
      .text((d) => d3format(d.value));

    // Add legends
    const legendNode = select(svgRef.current)
      .select("g")
      .append("g")
      .attr("class", "legends")
      .attr(
        "transform",
        `translate(${innerWidth - innerWidth * 0.42}, ${100})`
      );

    legendNode
      .append("text")
      .attr("x", 120)
      .attr("y", -40)
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")
      .text("Genres");

    legendNode
      .selectAll()
      .data(data.slice(0, data.length / 2))
      .join("g")
      .attr("class", "legend-tick")
      .attr("transform", (d, i) => `translate(0, ${i * tickSpacing})`)

      .each((d, i, elements) => {
        const g = select(elements[i]);
        g.on("mouseenter", () => setHoveredGenre(d)).on("mouseout", () =>
          setHoveredGenre(null)
        );
        g.attr(
          "opacity",
          hoveredGenre && group(d) !== hoveredGenre.name ? fadeOpacity : 1.0
        );
        g.append("circle")
          .attr("fill", (d) => color(group(d)))
          .attr("r", tickSize);
        g.append("text")
          .attr("dy", ".32em")
          .attr("x", tickTextOffset)
          .text(group(d));
      });
    legendNode
      .selectAll()
      .data(data.slice(data.length / 2))
      .join("g")
      .attr("class", "legend-tick")
      .attr("transform", (d, i) => `translate(180, ${i * tickSpacing})`)
      .each((d, i, elements) => {
        const g = select(elements[i]);
        g.on("mouseenter", () => setHoveredGenre(d)).on("mouseout", () =>
          setHoveredGenre(null)
        );
        g.attr(
          "opacity",
          hoveredGenre && group(d) !== hoveredGenre.name ? fadeOpacity : 1.0
        );
        g.append("circle")
          .attr("fill", (d) => color(group(d)))
          .attr("r", tickSize);
        g.append("text")
          .attr("dy", ".32em")
          .attr("x", tickTextOffset)
          .text(group(d));
      });
  }, [data]);

  useEffect(() => {
    select(svgRef.current)
      .selectAll("g.legend-tick")
      .attr("opacity", (d) => {
        if (!hoveredGenre) return 1.0;
        return group(d) === hoveredGenre.name ? 1.0 : fadeOpacity;
      });
    select(svgRef.current)
      .selectAll("circle.main-circle")
      .transition()
      .duration(300)
      .attr("fill-opacity", (d) => {
        if (!hoveredGenre) return 0.7;
        return group(d.data) === hoveredGenre.name ? 0.7 : 0.05;
      })
      .attr("fill", (d) => color(group(d.data)))
      .attr("r", (d) => {
        if (!hoveredGenre) return d.r;
        return group(d.data) === hoveredGenre.name ? d.r * 1.2 : d.r;
      });
  }, [hoveredGenre]);

  return (
    <>
      <svg
        viewBox={`180 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        ref={svgRef}
        className="tvshow-bubble-chart"
      ></svg>
      <h4 className="tvshow-axis-label">Fig.1 - TV shows grouped by genre</h4>
    </>
  );
};
