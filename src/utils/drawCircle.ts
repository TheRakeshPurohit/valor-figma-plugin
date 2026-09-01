import { processInputValue } from './processInputValue';
import { rgb2hsl } from './colorConverter'

const drawCircle = (parsedString: string) => {
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
  const ellipseSize: number = 60;
  const textPosX: number = ellipseSize * 1.25

  const ellipse = figma.createEllipse();
  ellipse.y = 3;
  ellipse.x = 0;
  ellipse.name = variableName;
  ellipse.resize(ellipseSize, ellipseSize);
  ellipse.fills = [
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
  labelName.x = textPosX;
  labelName.y = 0;
  labelName.fontSize = 18;
  labelName.characters = variableName;
  labelName.fills = [
    {
      type: "SOLID",
      color: blackColor,
      opacity: 1
    }
  ];

  const [h, s, l] = rgb2hsl(color[0], color[1], color[2]);
  const labelHSLA = figma.createText();
  labelHSLA.x = textPosX;
  labelHSLA.y = 27;
  labelHSLA.fontSize = 14;
  labelHSLA.characters = `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
  labelHSLA.fills = [
    {
      type: "SOLID",
      color: blackColor,
      opacity: 1
    }
  ];

  const labelHEX = figma.createText();
  labelHEX.x = textPosX;
  labelHEX.y = 47;
  labelHEX.fontSize = 14;
  labelHEX.characters = variableValue;
  labelHEX.fills = [
    {
      type: "SOLID",
      color: blackColor,
      opacity: 1
    }
  ];

  const nodesGroup = figma.group(
    [ellipse, labelName, labelHSLA, labelHEX],
    figma.currentPage
  );
  nodesGroup.name = variableName;

  return nodesGroup;
};

export default drawCircle;
