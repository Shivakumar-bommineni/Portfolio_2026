/* ── utility helpers for portfolio ── */

export const merge = (def, override) => {
  if (!override) return def;
  const result = { ...def };
  for (const key of Object.keys(override)) {
    if (
      override[key] &&
      typeof override[key] === "object" &&
      !Array.isArray(override[key])
    ) {
      result[key] = merge(def[key] || {}, override[key]);
    } else if (
      override[key] !== undefined &&
      override[key] !== null &&
      override[key] !== ""
    ) {
      result[key] = override[key];
    }
  }
  return result;
};

export const scrollTo = (id) =>
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
