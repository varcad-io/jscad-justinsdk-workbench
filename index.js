import * as modeling from "@jscad/modeling";
import { createJustinShape } from "@justinsdk/core";

export function main() {
  return modeling.booleans.union(
    createJustinShape(),
    modeling.transforms.translate(
      [-0.8, -0.8, 0.15],
      modeling.primitives.cube({ size: 1.0 }),
    ),
  );
}
