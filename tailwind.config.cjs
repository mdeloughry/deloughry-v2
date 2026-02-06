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
        // Social colors
        twitch: "var(--twitch)",
        twitter: "var(--twitter)",
        mastodon: "var(--mastodon)",
        youtube: "var(--youtube)",
        claw: "var(--claw)",
        github: "var(--github)",
        // BBS ANSI Colors
        "bbs-cyan": "var(--bbs-cyan)",
        "bbs-magenta": "var(--bbs-magenta)",
        "bbs-blue": "var(--bbs-blue)",
        "bbs-red": "var(--bbs-red)",
        "bbs-yellow": "var(--bbs-yellow)",
        "bbs-white": "var(--bbs-white)",
        "bbs-gray": "var(--bbs-gray)",
        "bbs-dark-gray": "var(--bbs-dark-gray)",
      },
      fontFamily: {
        // BBS Fonts
        'mono': ['IBM Plex Mono', 'Courier New', ...fontFamily.mono],
        'vt323': ['VT323', 'monospace'],
        'ibm': ['IBM Plex Mono', ...fontFamily.mono],
        sans: ['IBM Plex Mono', ...fontFamily.mono],
        serif: ['IBM Plex Mono', ...fontFamily.mono],
      },
      transitionProperty: {
        height: "height",
      },
      typography: (theme) => ({
        cactus: {
          css: {
            "--tw-prose-body": "var(--theme-text)",
            "--tw-prose-headings": "var(--bbs-cyan)",
            "--tw-prose-links": "var(--bbs-cyan)",
            "--tw-prose-bold": "var(--theme-accent)",
            "--tw-prose-bullets": "var(--theme-accent)",
            "--tw-prose-quotes": "var(--theme-quote)",
            "--tw-prose-code": "var(--bbs-cyan)",
            "--tw-prose-hr": "1px solid var(--bbs-gray)",
            "--tw-prose-th-borders": "var(--bbs-gray)",
          },
        },
        DEFAULT: {
          css: {
            fontFamily: "'IBM Plex Mono', monospace",
            a: {
              "@apply bbs-link": "",
              color: "var(--bbs-cyan)",
              textDecoration: "none",
              "&:hover": {
                color: "var(--theme-accent)",
              },
            },
            strong: {
              fontWeight: "700",
              color: "var(--theme-accent)",
            },
            code: {
              border: "1px solid var(--bbs-gray)",
              borderRadius: "0",
              backgroundColor: "var(--bbs-dark-gray)",
              color: "var(--bbs-cyan)",
              padding: "0.125rem 0.25rem",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            blockquote: {
              borderLeftWidth: "2px",
              borderLeftColor: "var(--theme-accent)",
              fontStyle: "normal",
              backgroundColor: "var(--bbs-dark-gray)",
              padding: "1rem",
            },
            hr: {
              borderTopStyle: "solid",
              borderColor: "var(--bbs-gray)",
            },
            thead: {
              borderBottomWidth: "1px",
              borderColor: "var(--theme-accent)",
            },
            "thead th": {
              fontWeight: "700",
              borderBottom: "1px solid var(--theme-accent)",
              color: "var(--theme-accent)",
            },
            "tbody tr": {
              borderBottomWidth: "1px",
              borderColor: "var(--bbs-gray)",
            },
            tfoot: {
              borderTop: "1px solid var(--theme-accent)",
            },
            h1: {
              color: "var(--bbs-cyan)",
            },
            h2: {
              color: "var(--bbs-cyan)",
            },
            h3: {
              color: "var(--bbs-cyan)",
            },
            h4: {
              color: "var(--bbs-cyan)",
            },
            pre: {
              backgroundColor: "var(--bbs-dark-gray)",
              border: "1px solid var(--bbs-gray)",
              borderRadius: "0",
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
        ".bbs-link": {
          color: "var(--bbs-cyan)",
          textDecoration: "none",
          transition: "all 0.1s ease",
          "&:hover": {
            color: "var(--theme-accent)",
            textShadow: "0 0 5px var(--theme-accent)",
          },
        },
        ".title": {
          "@apply text-2xl font-semibold text-bbs-cyan": {},
        },
        ".prose p, .prose blockquote, .prose ul": {
          "@apply max-w-xl": {}
         },
        ".prose pre, .prose h1, .prose h2,.prose h3,.prose h4,.prose h5,.prose h6": {
          "@apply max-w-3xl": {}
         },
        ".prose pre": {
          // show y scrollbar always
          "@apply scrollbar scrollbar-thumb-accent scrollbar-track-bbs-dark-gray": {},
        }
      });
    }),
  ],
};
