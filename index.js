import * as modeling from "@jscad/modeling";
import * as roundedCubeLib from "@justinsdk/src/rounded_cube.scad?use";

export function main() {
  return modeling.booleans.union(
    roundedCubeLib.rounded_cube([1.8, 1.2, 0.75], 0.18, true),
    modeling.transforms.translate(
      [-0.95, -0.95, 0.2],
      modeling.primitives.cube({ size: [0.9, 0.9, 0.45] }),
    ),
  );
}
