import * as modeling from "@jscad/modeling";
import * as hexagonsLib from "@justinsdk/src/hexagons.scad?use";
import * as starburstLib from "@justinsdk/src/starburst.scad?use";

const toFiniteNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toInteger = (value, fallback = 1, { min = 1, max = 24 } = {}) => {
  const parsed = Math.round(toFiniteNumber(value, fallback));
  return Math.max(min, Math.min(max, parsed));
};

const normalizeVector3 = (value, fallback = [0, 0, 0]) => {
  const source = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : value == null
        ? []
        : [value];
  const numbers = source
    .slice(0, 3)
    .map((entry, index) => toFiniteNumber(entry, fallback[index] ?? 0));
  while (numbers.length < 3) {
    numbers.push(fallback[numbers.length] ?? 0);
  }
  return numbers;
};

const degreesToRadians = (degrees) => (toFiniteNumber(degrees, 0) * Math.PI) / 180;

export function main({ variables = {} } = {}) {
  const hexRadius = toFiniteNumber(variables.hex_radius, 3.2);
  const hexSpacing = toFiniteNumber(variables.hex_spacing, 0.8);
  const hexCount = toInteger(variables.hex_count, 3, { min: 1, max: 8 });
  const plateHeight = toFiniteNumber(variables.plate_height, 3);
  const crownOuterRadius = toFiniteNumber(variables.crown_outer_radius, 10);
  const crownInnerRadius = toFiniteNumber(variables.crown_inner_radius, 5);
  const crownPoints = toInteger(variables.crown_points, 6, { min: 3, max: 14 });
  const crownHeight = toFiniteNumber(variables.crown_height, 6);
  const displayScale = Math.max(0.25, toFiniteNumber(variables.display_scale, 1));
  const yawDeg = toFiniteNumber(variables.yaw_deg, 10);
  const workbenchOffset = normalizeVector3(variables.workbench_offset, [-1.2, 0.8, 0]);

  const plate = modeling.extrusions.extrudeLinear(
    { height: plateHeight },
    hexagonsLib.hexagons(hexRadius, hexSpacing, hexCount),
  );
  const crown = modeling.transforms.translate(
    [0, 0, plateHeight],
    starburstLib.starburst(
      crownOuterRadius,
      crownInnerRadius,
      crownPoints,
      crownHeight,
    ),
  );
  const workpiece = modeling.booleans.union(
    plate,
    crown,
  );
  const scaledWorkpiece = modeling.transforms.scale(
    [displayScale, displayScale, displayScale],
    workpiece,
  );

  return modeling.transforms.translate(
    workbenchOffset,
    modeling.transforms.rotateZ(degreesToRadians(yawDeg), scaledWorkpiece),
  );
}
