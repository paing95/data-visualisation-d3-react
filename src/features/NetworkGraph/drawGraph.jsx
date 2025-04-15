export const RADIUS = 10;

export const drawGraph = (context, width, height, nodes, links) => {
  context.clearRect(0, 0, width, height);

  // Draw the links first
  links.forEach((link) => {
    context.beginPath();
    context.moveTo(link.source.x, link.source.y);
    context.lineTo(link.target.x, link.target.y);
    context.stroke();
  });

  // Draw the nodes
  nodes.forEach((node) => {
    if (!node.x || !node.y) {
      return;
    }

    // the circle node
    context.beginPath();
    context.moveTo(node.x + RADIUS, node.y);
    context.arc(node.x, node.y, RADIUS, 0, 2 * Math.PI);
    context.fillStyle = "#cb1dd1";
    context.fill();

    // the circle text
    context.font = "12px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#FFFFFF";
    context.fillText(node.name, node.x, node.y);
  });
};

export const drawLegends = (context, nodes) => {
  const legendX = 30;
  const legendY = 20;
  const legendPadding = 10;

  context.font = "12px Arial";
  context.fillStyle = "#000000";
  context.fillText("Legends", legendX, legendY);

  nodes.forEach((item, index) => {
    const itemY = legendY + (index + 1) * (legendPadding + 20);

    const x = legendX + 10;
    const y = itemY;

    context.beginPath();
    context.arc(x, y, 8, 0, 2 * Math.PI);
    context.fillStyle = "#cb1dd1";
    context.fill();

    context.font = "12px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#FFFFFF";
    context.fillText(item.name, x, y);

    // Draw the label
    context.fillStyle = "#000000"; // Text color
    context.font = "12px Arial";
    context.fillText(item.desc, x + 40, y + 2);
  });
};
