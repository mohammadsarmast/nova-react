export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function isHexColor(color) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color.trim());
}

export function expandHex(hex) {
  const trimmed = hex.trim();
  if (trimmed.length === 4) {
    return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`;
  }
  return trimmed;
}

export function hexToRgb(hex) {
  const normalized = expandHex(hex).replace('#', '');
  const int = parseInt(normalized, 16);
  if (Number.isNaN(int)) return null;
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

export function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('')}`;
}

export function parseRgbColor(color) {
  const match = color.trim().match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (!match) return null;
  return {
    r: +match[1],
    g: +match[2],
    b: +match[3],
  };
}

export function hslToRgb(h, s, l) {
  const hue = h / 360;
  const sat = s / 100;
  const light = l / 100;

  if (sat === 0) {
    const gray = Math.round(light * 255);
    return { r: gray, g: gray, b: gray };
  }

  const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
  const p = 2 * light - q;

  const hueToChannel = (t) => {
    let channel = t;
    if (channel < 0) channel += 1;
    if (channel > 1) channel -= 1;
    if (channel < 1 / 6) return p + (q - p) * 6 * channel;
    if (channel < 1 / 2) return q;
    if (channel < 2 / 3) return p + (q - p) * (2 / 3 - channel) * 6;
    return p;
  };

  return {
    r: Math.round(hueToChannel(hue + 1 / 3) * 255),
    g: Math.round(hueToChannel(hue) * 255),
    b: Math.round(hueToChannel(hue - 1 / 3) * 255),
  };
}

export function parseHslColor(color) {
  const match = color.trim().match(/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%/i);
  if (!match) return null;
  return hslToRgb(+match[1], +match[2], +match[3]);
}

export function normalizeColorToHex(color) {
  if (!color) return null;
  const trimmed = color.trim();

  if (isHexColor(trimmed)) {
    return expandHex(trimmed);
  }

  const rgb = parseRgbColor(trimmed);
  if (rgb) return rgbToHex(rgb.r, rgb.g, rgb.b);

  const hsl = parseHslColor(trimmed);
  if (hsl) return rgbToHex(hsl.r, hsl.g, hsl.b);

  return null;
}

export function shadeHex(hex, amount) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const factor = 1 - amount;
  return rgbToHex(rgb.r * factor, rgb.g * factor, rgb.b * factor);
}

export function tintHex(hex, amount) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return rgbToHex(
    rgb.r + (255 - rgb.r) * amount,
    rgb.g + (255 - rgb.g) * amount,
    rgb.b + (255 - rgb.b) * amount
  );
}

export function getCustomColorVars(color) {
  if (!color) return null;

  const trimmed = color.trim();
  const hex = normalizeColorToHex(trimmed);
  const primary = hex ?? trimmed;
  const textColor = hex && isLightColor(hex) ? '#111827' : '#fff';

  if (!hex) {
    return {
      '--nr-btn-primary': trimmed,
      '--nr-btn-primary-hover': trimmed,
      '--nr-btn-primary-active': trimmed,
      '--nr-btn-primary-soft': trimmed,
      '--nr-btn-primary-text': textColor,
      '--nr-btn-gradient': trimmed,
      '--nr-btn-gradient-hover': trimmed,
    };
  }

  return {
    '--nr-btn-primary': hex,
    '--nr-btn-primary-hover': shadeHex(hex, 0.12),
    '--nr-btn-primary-active': shadeHex(hex, 0.22),
    '--nr-btn-primary-soft': tintHex(hex, 0.88),
    '--nr-btn-primary-text': textColor,
    '--nr-btn-gradient': `linear-gradient(135deg, ${hex}, ${shadeHex(hex, 0.15)})`,
    '--nr-btn-gradient-hover': `linear-gradient(135deg, ${shadeHex(hex, 0.12)}, ${shadeHex(hex, 0.25)})`,
  };
}

export function isLightColor(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.62;
}
