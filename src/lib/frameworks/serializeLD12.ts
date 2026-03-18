import { DOMAINS, DIMENSIONS, SKILLS } from "@/lib/framework/ld12-definitions";

function serializeLD12Framework(): string {
  const domainBlocks = DOMAINS.map((domain) => {
    const domainDimensions = DIMENSIONS.filter((d) => d.domainId === domain.id);

    const dimensionBlocks = domainDimensions
      .map((dim) => {
        const dimSkills = SKILLS.filter((s) => s.dimensionId === dim.id);

        const skillLines = dimSkills
          .map(
            (s) => `
      <skill id="${s.id}" name="${s.name}">
        <definition>${s.description}</definition>
      </skill>`,
          )
          .join("");

        return `
    <dimension name="${dim.name}">
      <description>${dim.description}</description>
      ${skillLines}
    </dimension>`;
      })
      .join("");

    return `
  <domain name="${domain.name}">
    <description>${domain.description}</description>
    ${dimensionBlocks}
  </domain>`;
  }).join("");

  return `<ld12-framework>
  ${domainBlocks}
</ld12-framework>`;
}

export const LD12_FRAMEWORK_XML = serializeLD12Framework();
