// The site's colour palette, as OKLCH hue angles (0-360).
// Give a section, card or project one of these and everything accent-coloured inside it follows.
// OKLCH keeps perceived lightness equal across hues, so text stays readable whichever colour you pick.
// Keep hues at least ~30 apart when they sit next to each other, so they stay clearly different.
export const hues = {
  blue: 255,
  violet: 295,
  pink: 350,
  red: 25,
  orange: 55,
  amber: 90,
  green: 150,
  teal: 195,
} as const;
