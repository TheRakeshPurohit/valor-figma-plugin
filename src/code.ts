import drawCircle from './utils/drawCircle'
import drawRectangle from './utils/drawRectangle'

figma.showUI(__html__);
figma.ui.resize(400, 390)

figma.ui.onmessage = async msg => {
  if (msg.type === "input") {
    await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });

    const COMMENTS = /\/\*.*?\*\//g;
    const NEWLINE = /\r?\n|\r/g;
    const SPACE = /\s/g;
    const VAR_PREFIX = /^(\$|--)/;

    const variableStrings: string[] = msg.text
      .replace(NEWLINE, " ")
      .replace(COMMENTS, "")
      .split(";")
      .map((el: string) => el.replace(SPACE, "").replace(VAR_PREFIX, ""))
      .filter((el: string) => el !== "");

    const itemsPerColumn = 5;
    const nodes = [];
    const invalidStrings = [];

    for (const variableString of variableStrings) {
      const item = msg.renderChecked === "rectangle"
        ? drawRectangle(variableString)
        : drawCircle(variableString);

      if (!item) {
        invalidStrings.push(variableString);
        continue;
      }

      const column = Math.floor(nodes.length / itemsPerColumn);
      const row = nodes.length % itemsPerColumn;
      if (msg.renderChecked === "rectangle") {
        item.x = column * 250;
        item.y = row * 250;
      } else {
        item.x = column * 300;
        item.y = row * 100;
      }
      nodes.push(item);
    }

    if (nodes.length > 0) {
      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
    }
    if (invalidStrings.length > 0) {
      figma.ui.postMessage({ status: "drawError", data: invalidStrings });
    }
  }

  if (msg.type === "getVariables") {
    const items = figma.currentPage.selection;
    if (items.length === 0) {
      figma.ui.postMessage({ status: "selectionEmpty" });
      return;
    }

    const list = [];
    let hasWrongItems = false;
    for (const node of items) {
      if (node.type !== "ELLIPSE" && node.type !== "RECTANGLE") {
        hasWrongItems = true;
        continue;
      }
      const fill = Array.isArray(node.fills) ? node.fills[0] : null;
      if (!fill || fill.type !== "SOLID") {
        hasWrongItems = true;
        continue;
      }
      list.push([
        node.name,
        fill.color,
        fill.opacity !== undefined ? fill.opacity : 1,
      ]);
    }

    if (hasWrongItems) {
      figma.ui.postMessage({ status: "selectionPartiallyWrong" });
    }
    if (list.length > 0) {
      figma.ui.postMessage({ status: "selectionFilled", data: list });
    }
  }
};
