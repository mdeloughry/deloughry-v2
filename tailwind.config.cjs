const { fontFamily } = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}"],
  darkMode: "class",
  corePlugins: {
    // disable aspect ratio as per docs -> @tailwindcss/aspect-ratio
    aspectRatio: false,
    // disable some core plugins as they are included in the css, even when unused
    touchAction: false,
    ringOffsetWidth: false,
    ringOffsetColor: false,
    scrollSnapType: false,
    borderOpacity: false,
    textOpacity: false,
    fontVariantNumeric: false,
  },
  theme: {
    listStyleType: {
      decimal: "decimal",
      disc: "disc",
    },
    extend: {
      gridTemplateColumns: {
        '20': 'repeat(20, minmax(0, 1fr))',
        '50': 'repeat(50, minmax(0, 1fr))',
      },
      fontSize: {
        '20xl': '8rem',
      },
      colors: {
        bgColor: "var(--theme-bg)",
        textColor: "var(--theme-text)",
        link: "var(--theme-link)",
        accent: "var(--theme-accent)",
        "accent-dark": "var(--theme-accent-hover)",
        "accent-bg": "var(--theme-accent-bg)",
        twitch: "var(--twitch)",
        twitter: "var(--twitter)",
        mastodon: "var(--mastodon)",
        youtube: "var(--youtube)",
        claw: "var(--claw)",
        github: "var(--github)",
        // Terminal Hacker specific colors
        terminal: {
          green: "#00FF87",
          cyan: "#00D9FF",
          yellow: "#DAFF01",
          red: "#FF4757",
          muted: "#737373",
          black: "#000000",
        },
      },
      fontFamily: {
        // Terminal monospace font
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['JetBrains Mono', ...fontFamily.sans],
        serif: ['JetBrains Mono', ...fontFamily.serif],
      },
      transitionProperty: {
        height: "height",
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'glitch': 'glitch 0.3s ease-in-out',
        'flicker': 'flicker 0.15s ease-in-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.95' },
          '52%': { opacity: '1' },
          '54%': { opacity: '0.9' },
          '56%': { opacity: '1' },
        },
        'glow-pulse': {
          '0%, 100%': { textShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
          '50%': { textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' },
        },
      },
      boxShadow: {
        'terminal': '0 0 10px rgba(0, 255, 135, 0.3)',
        'terminal-hover': '0 0 20px rgba(0, 255, 135, 0.5)',
        'glow': '0 0 5px currentColor, 0 0 10px currentColor',
      },
      typography: (theme) => ({
        terminal: {
          css: {
            "--tw-prose-body": "var(--theme-text)",
            "--tw-prose-headings": "var(--theme-accent)",
            "--tw-prose-links": "var(--theme-link)",
            "--tw-prose-bold": "var(--theme-text)",
            "--tw-prose-bullets": "var(--theme-text)",
            "--tw-prose-quotes": "var(--theme-quote)",
            "--tw-prose-code": "var(--theme-accent)",
            "--tw-prose-hr": "1px dashed var(--theme-text)",
            "--tw-prose-th-borders": "var(--theme-text)",
            fontFamily: "'JetBrains Mono', monospace",
          },
        },
        cactus: {
          css: {
            "--tw-prose-body": "var(--theme-text)",
            "--tw-prose-headings": "var(--theme-accent)",
            "--tw-prose-links": "var(--theme-text)",
            "--tw-prose-bold": "var(--theme-text)",
            "--tw-prose-bullets": "var(--theme-text)",
            "--tw-prose-quotes": "var(--theme-quote)",
            "--tw-prose-code": "var(--theme-text)",
            "--tw-prose-hr": "0.5px dashed #666",
            "--tw-prose-th-borders": "#666",
          },
        },
        DEFAULT: {
          css: {
            a: {
              "@apply terminal-link text-link": "",
            },
            strong: {
              fontWeight: "700",
            },
            code: {
              border: "1px solid var(--theme-text)",
              borderRadius: "0",
              padding: "0.125rem 0.25rem",
              backgroundColor: "rgba(0, 255, 135, 0.1)",
            },
            blockquote: {
              borderLeftWidth: "2px",
              borderLeftColor: "var(--theme-accent)",
              fontStyle: "normal",
            },
            hr: {
              borderTopStyle: "dashed",
              borderColor: "var(--theme-text)",
            },
            thead: {
              borderBottomWidth: "none",
            },
            "thead th": {
              fontWeight: "700",
              borderBottom: "1px dashed var(--theme-text)",
            },
            "tbody tr": {
              borderBottomWidth: "none",
            },
            tfoot: {
              borderTop: "1px dashed var(--theme-text)",
            },
          },
        },
        sm: {
          css: {
            code: {
              fontSize: theme("fontSize.sm")[0],
              fontWeight: "400",
            },
          },
        },
      }),
    },
  },
  plugins: [

    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require('tailwind-scrollbar'),
    plugin(function ({ addComponents }) {
      addComponents({
        ".terminal-link": {
          color: "var(--theme-link)",
          textDecoration: "none",
          "&:hover": {
            color: "var(--theme-accent)",
            textShadow: "0 0 5px currentColor, 0 0 10px currentColor",
          },
        },
        ".cactus-link": {
          color: "var(--theme-link)",
          "@apply bg-[size:100%_6px] bg-bottom bg-repeat-x": {},
          "&:hover": {
            color: "var(--theme-accent)",
          },
        },
        ".title": {
          "@apply text-2xl font-semibold text-accent": {},
        },
        ".prose p, .prose blockquote, .prose ul": {
          "@apply max-w-xl": {}
         },
        ".prose pre, .prose h1, .prose h2,.prose h3,.prose h4,.prose h5,.prose h6": {
          "@apply max-w-3xl": {}
         },
        ".prose pre": {
          // show y scrollbar always
          "@apply scrollbar scrollbar-thumb-accent scrollbar-track-accent": {},
        }
      });
    }),
  ],
};
