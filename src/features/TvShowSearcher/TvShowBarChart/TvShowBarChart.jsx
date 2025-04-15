import { useEffect, useRef } from "react";
/* d3 */
import { select, scaleLinear, scaleBand, max, format } from "d3";
/* css */
import "./TvShowBarChart.css";

const margin = {
  top: 20,
  right: 50,
  bottom: 100,
  left: 220,
};

export const TvShowBarChart = ({
  data,
  selectedOption,
  width = window.innerWidth,
  height = window.innerHeight,
  onTVShowClicked,
}) => {
  const svgRef = useRef();

  // console.log("Movie Bar Chart ===>", data);

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;
  let d3FormatK = format(".2s");

  function wrapText(text, width) {
    text.each(function () {
      const textEl = select(this);
      const words = textEl.text().split(/\s+/).reverse();
      const initY =
        textEl.text().length > 26 ? textEl.attr("y") - 10 : textEl.attr("y");
      let word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        x = textEl.attr("x"),
        y = textEl.attr("y"),
        dy = parseFloat(textEl.attr("dy")) || 0,
        tspan = textEl
          .text(null)
          .append("tspan")
          .attr("x", x)
          .attr("y", initY)
          .attr("dy", `${dy}em`);

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = textEl
            .append("tspan")
            .attr("x", x)
            .attr("y", y - 10)
            .attr("dy", `${++lineNumber * lineHeight + dy}em`)
            .text(word);
        }
      }
    });
  }

  useEffect(() => {
    if (!svgRef.current) return;

    select(svgRef.current).selectAll("*").remove();

    let xValue = (d) => d[selectedOption.value];
    let xScale = scaleLinear()
      .domain([0, max(data, xValue)])
      .range([0, innerWidth]);

    if (selectedOption.value === "rank") {
      xScale = scaleLinear()
        .domain([1, max(data, xValue)])
        .range([innerWidth, 50]);

      d3FormatK = format("");
    }

    const yValue = (d) => d.primaryTitle;
    const yScale = scaleBand()
      .domain(data.map(yValue))
      .range([0, innerHeight])
      .paddingInner(0.2);

    select(svgRef.current)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Axis Left
    select(svgRef.current)
      .select("g")
      .selectAll()
      .data(yScale.domain())
      .join("g")
      .attr("class", "tick")
      .append("text")
      .attr("style", "text-anchor: end")
      .attr("x", -3)
      .attr("y", (d) => yScale(d) + yScale.bandwidth() / 2)
      .attr("dy", ".32em")
      .text((d) => d)
      .call(wrapText, margin.left);
    // Axis Bottom
    const ticks = select(svgRef.current)
      .select("g")
      .selectAll()
      .data(xScale.ticks())
      .join("g")
      .attr("class", "tick")
      .attr("transform", (d) => `translate(${xScale(d)},0)`);
    ticks.append("line").attr("y2", innerHeight);

    ticks
      .append("text")
      .attr("style", "text-anchor: middle")
      .attr("y", innerHeight + 3)
      .attr("dy", ".71em")
      .text((d) => d3FormatK(d));

    // Rectangles
    select(svgRef.current)
      .select("g")
      .selectAll()
      .data(data)
      .join("rect")
      .attr("class", "mark")
      .attr("x", 0)
      .attr("y", (d) => yScale(yValue(d)))
      .attr("width", (d) => xScale(xValue(d)))
      .attr("height", yScale.bandwidth())
      .on("click", (e, d) => {
        console.log("e:", e);
        console.log("d:", d);
        onTVShowClicked(d);
      })
      .append("title")
      .text((d) => d3FormatK(xValue(d)));

    // Rectangle Texts
    select(svgRef.current)
      .select("g")
      .selectAll()
      .data(data)
      .join("text")
      .attr("class", "mark-text")
      .attr("x", (d) => xScale(xValue(d)) - d3FormatK(xValue(d)).length * 9.5)
      .attr("y", (d) => yScale(yValue(d)) + yScale.bandwidth() / 1.5)
      .text((d) => d3FormatK(xValue(d)));
  }, [data]);

  return (
    <>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        ref={svgRef}
        className="tvshow-bar-chart"
      ></svg>
      <h4 className="tvshow-bar-axis-label">Fig.2 - Top TV shows by genre</h4>
    </>
  );
};
