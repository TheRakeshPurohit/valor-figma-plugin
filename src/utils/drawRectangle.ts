import { processInputValue } from './processInputValue';
import { rgb2hsl } from './colorConverter'

const drawRectangle = (parsedString: string) => {
    const [variableName, variableValue] = parsedString.split(":");
    if (!variableValue) {
      return null;
    }

    const color = processInputValue(variableValue);
    if (!color) {
      return null;
    }

    const alpha = color[3] !== undefined ? color[3] : 1;
    const blackColor = { r: 0.06, g: 0.06, b: 0.06 };
    const rectangleSize = 100;

    const rectangle = figma.createRectangle();
    rectangle.y = 0;
    rectangle.x = 0;
    rectangle.name = variableName;
    rectangle.resize(rectangleSize, rectangleSize);
    rectangle.fills = [
      {
        type: "SOLID",
        color: {
          r: color[0],
          g: color[1],
          b: color[2]
        },
        opacity: alpha
      }
    ];

    const labelName = figma.createText();
    labelName.x = 0;
    labelName.y = 115;
    labelName.fontSize = 18;
    labelName.characters = variableName;
    labelName.fills = [
      {
        type: "SOLID",
        color: blackColor
      }
    ];

    const [h, s, l] = rgb2hsl(color[0], color[1], color[2]);
    const labelHSLA = figma.createText();
    labelHSLA.x = 0;
    labelHSLA.y = 146;
    labelHSLA.fontSize = 14;
    labelHSLA.characters = `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
    labelHSLA.fills = [
      {
        type: "SOLID",
        color: blackColor
      }
    ];

    const labelHEX = figma.createText();
    labelHEX.x = 0;
    labelHEX.y = 170;
    labelHEX.fontSize = 14;
    labelHEX.characters = variableValue;
    labelHEX.fills = [
      {
        type: "SOLID",
        color: blackColor
      }
    ];

    const nodesGroup = figma.group(
      [rectangle, labelName, labelHSLA, labelHEX],
      figma.currentPage
    );
    nodesGroup.name = variableName;

    return nodesGroup;
};

export default drawRectangle;
