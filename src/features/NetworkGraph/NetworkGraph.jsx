import { useEffect, useRef } from "react";

/* d3 */
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
} from "d3";

/* components */
import { useData } from "./useData";
import { RADIUS, drawGraph, drawLegends } from "./drawGraph";

export const NetworkGraph = ({
  width = window.innerWidth,
  height = window.innerHeight,
}) => {
  const data = useData();
  const canvasRef = useRef();
  const links = data ? data.links.map((d) => ({ ...d })) : [];
  const nodes = data ? data.nodes.map((d) => ({ ...d })) : [];

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!context) {
      return;
    }

    forceSimulation(nodes)
      .force(
        "link",
        forceLink(links).id((d) => d.id)
      )
      .force("collide", forceCollide().radius(RADIUS))
      .force("charge", forceManyBody().strength(-400))
      .force("center", forceCenter(width / 2, height / 4))
      .on("tick", () => {
        drawGraph(context, width, height, nodes, links);
        drawLegends(context, nodes);
      });
  }, [width, height, links, nodes]);

  return (
    <div className="network-graph">
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};
