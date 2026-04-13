/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
        "tertiary-container": "#007030",
        "secondary-container": "#e1e3e4",
        "on-secondary": "#ffffff",
        "surface-dim": "#dadada",
        "on-primary-fixed": "#0f0069",
        "surface-container-high": "#e8e8e8",
        "primary": "#3525cd",
        "surface-container-low": "#f3f3f4",
        "surface-container": "#eeeeee",
        "error-container": "#ffdad6",
        "on-tertiary-fixed-variant": "#005321",
        "on-tertiary-fixed": "#002109",
        "inverse-on-surface": "#f0f1f1",
        "surface-bright": "#f9f9f9",
        "surface-tint": "#4d44e3",
        "on-primary-fixed-variant": "#3323cc",
        "tertiary": "#005523",
        "outline": "#777587",
        "primary-fixed": "#e2dfff",
        "error": "#ba1a1a",
        "surface-container-highest": "#e2e2e2",
        "inverse-surface": "#2f3131",
        "secondary": "#5c5f60",
        "surface-variant": "#e2e2e2",
        "surface-container-lowest": "#ffffff",
        "surface": "#f9f9f9",
        "on-tertiary": "#ffffff",
        "on-error-container": "#93000a",
        "tertiary-fixed-dim": "#4ae176",
        "on-tertiary-container": "#63f889",
        "secondary-fixed": "#e1e3e4",
        "primary-fixed-dim": "#c3c0ff",
        "on-surface-variant": "#464555",
        "background": "#f9f9f9",
        "on-error": "#ffffff",
        "outline-variant": "#c7c4d8",
        "inverse-primary": "#c3c0ff",
        "on-primary-container": "#dad7ff",
        "tertiary-fixed": "#6bff8f",
        "on-surface": "#1a1c1c",
        "on-background": "#1a1c1c",
        "on-secondary-fixed": "#191c1d",
        "secondary-fixed-dim": "#c5c7c8",
        "on-secondary-container": "#626566",
        "on-primary": "#ffffff",
        "on-secondary-fixed-variant": "#454748",
        "primary-container": "#4f46e5"
      },
      "borderRadius": {
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      "fontFamily": {
        "inter": ["Inter", "sans-serif"],
        "headline": ["Inter"],
        "body": ["Inter"],
        "label": ["Inter"]
      }
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/forms')
  ],
}
