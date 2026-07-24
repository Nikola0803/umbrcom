/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          // Site-wide font mandate: Assistant everywhere, no exceptions —
          // this overrides Tailwind's own default "font-serif" utility
          // (which otherwise wins over the old @layer base CSS override,
          // since Tailwind's utilities layer always beats the base layer
          // regardless of selector specificity). Fixing it here, at the
          // theme level, is the only way that's actually reliable.
          sans: ['Assistant', 'Arial Hebrew', 'sans-serif'],
          serif: ['Assistant', 'Arial Hebrew', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }