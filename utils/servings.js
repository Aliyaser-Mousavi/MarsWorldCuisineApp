/** Scale ingredient lines when they start with a number (e.g. "2 cups"). */
export function scaleIngredientLine(line, servingsMultiplier) {
  if (!line || servingsMultiplier === 1) return line;
  const match = String(line).match(
    /^(\d+\s*\/\s*\d+|\d+[.,]\d+|\d+)\s*(.*)$/,
  );
  if (!match) {
    return servingsMultiplier === 1
      ? line
      : `${line}  ·  ×${servingsMultiplier}`;
  }

  const raw = match[1].replace(",", ".").replace(/\s/g, "");
  let value;
  if (raw.includes("/")) {
    const [a, b] = raw.split("/").map(Number);
    value = a / b;
  } else {
    value = Number(raw);
  }
  if (!Number.isFinite(value)) {
    return `${line}  ·  ×${servingsMultiplier}`;
  }

  const scaled = value * servingsMultiplier;
  const pretty =
    Math.abs(scaled - Math.round(scaled)) < 0.05
      ? String(Math.round(scaled))
      : scaled.toFixed(1).replace(/\.0$/, "");

  return `${pretty} ${match[2]}`.trim();
}

export function scaleIngredients(ingredients, servingsMultiplier) {
  return (ingredients || []).map((line) =>
    scaleIngredientLine(line, servingsMultiplier),
  );
}
