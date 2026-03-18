import {
  VALUES_DIMENSIONS,
  VALUES_SUB_DIMENSIONS,
} from "@/lib/framework/values-definitions";

function serializeValuesFramework(): string {
  const dimensionBlocks = VALUES_DIMENSIONS.map((dim) => {
    const subDims = VALUES_SUB_DIMENSIONS.filter(
      (s) => s.dimensionKey === dim.key,
    );

    const subLines = subDims
      .map(
        (s) => `
    <value key="${s.key}" name="${s.title}">
      <description>${s.description}</description>
    </value>`,
      )
      .join("");

    return `
  <dimension key="${dim.key}" name="${dim.title}">
    <description>${dim.description}</description>
    ${subLines}
  </dimension>`;
  }).join("");

  return `<values-framework>
  ${dimensionBlocks}
</values-framework>`;
}

export const VALUES_FRAMEWORK_XML = serializeValuesFramework();
