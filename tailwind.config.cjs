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
        '10xl': '10rem',
        '12xl': '12rem',
        '20xl': '16rem',
      },
      colors: {
        // Base colors from CSS variables
        bgColor: "var(--theme-bg)",
        bgSecondary: "var(--theme-bg-secondary)",
        bgElevated: "var(--theme-bg-elevated)",
        textColor: "var(--theme-text)",
        link: "var(--theme-link)",
        accent: "var(--theme-accent)",
        "accent-hover": "var(--theme-accent-hover)",
        muted: "var(--theme-muted)",

        // Semantic colors
        error: "var(--color-error)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        info: "var(--color-info)",

        // Extended palette
        pink: "var(--color-pink)",
        cyan: "var(--color-cyan)",
        purple: "var(--color-purple)",
        orange: "var(--color-orange)",

        // Glitch colors (decorative)
        "glitch-red": "var(--glitch-red)",
        "glitch-cyan": "var(--glitch-cyan)",

        // Social colors
        twitch: "var(--twitch)",
        twitter: "var(--twitter)",
        mastodon: "var(--mastodon)",
        youtube: "var(--youtube)",
        claw: "var(--claw)",
        github: "var(--github)",
      },
      fontFamily: {
        // Refined Neo Brutalist fonts
        'mono': ['JetBrains Mono', ...fontFamily.mono],
        'sans': ['Outfit', 'system-ui', ...fontFamily.sans],
      },
      spacing: {
        'brutal': '4px',
        'brutal-2': '8px',
      },
      borderWidth: {
        'brutal': '4px',
      },
      transitionProperty: {
        height: "height",
      },
      animation: {
        'glitch': 'glitch-1 0.3s infinite',
        'glitch-2': 'glitch-2 0.3s infinite',
        'noise': 'noise 0.5s steps(10) infinite',
        'flicker': 'flicker 0.15s infinite',
        'glitch-flash': 'glitch-flash 3s infinite',
      },
      typography: (theme) => ({
        brutalist: {
          css: {
            "--tw-prose-body": "var(--theme-text)",
            "--tw-prose-headings": "var(--theme-accent)",
            "--tw-prose-links": "var(--theme-accent)",
            "--tw-prose-bold": "var(--theme-text)",
            "--tw-prose-bullets": "var(--theme-accent)",
            "--tw-prose-quotes": "var(--theme-muted)",
            "--tw-prose-code": "var(--theme-accent)",
            "--tw-prose-hr": "4px solid var(--theme-accent)",
            "--tw-prose-th-borders": "var(--theme-accent)",
          },
        },
        DEFAULT: {
          css: {
            a: {
              color: "var(--theme-accent)",
              textDecoration: "none",
              borderBottom: "2px solid var(--theme-accent)",
              transition: "all 0.15s ease",
              "&:hover": {
                color: "var(--theme-text)",
                backgroundColor: "var(--theme-accent)",
              },
            },
            strong: {
              fontWeight: "700",
              color: "var(--theme-accent)",
            },
            code: {
              border: "2px solid var(--theme-accent)",
              borderRadius: "0",
              padding: "0.125rem 0.375rem",
              backgroundColor: "var(--theme-bg-secondary)",
              color: "var(--theme-accent)",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            blockquote: {
              borderLeftWidth: "4px",
              borderLeftColor: "var(--theme-accent)",
              backgroundColor: "var(--theme-bg-secondary)",
              padding: "1rem",
              fontStyle: "normal",
            },
            hr: {
              borderTop: "4px solid var(--theme-accent)",
            },
            thead: {
              borderBottomWidth: "4px",
              borderBottomColor: "var(--theme-accent)",
            },
            "thead th": {
              fontWeight: "600",
              fontFamily: "JetBrains Mono, monospace",
              letterSpacing: "0",
            },
            "tbody tr": {
              borderBottomWidth: "2px",
              borderBottomColor: "var(--theme-bg-secondary)",
            },
            tfoot: {
              borderTop: "4px solid var(--theme-accent)",
            },
            pre: {
              backgroundColor: "var(--theme-bg-secondary)",
              border: "4px solid var(--theme-accent)",
              borderRadius: "0",
            },
            h1: {
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: "600",
              letterSpacing: "-0.02em",
            },
            h2: {
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: "600",
              letterSpacing: "-0.02em",
            },
            h3: {
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: "600",
              letterSpacing: "-0.01em",
            },
            h4: {
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: "500",
              letterSpacing: "0",
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
    plugin(function ({ addComponents, addUtilities }) {
      addComponents({
        // Brutalist link style
        ".brutal-link": {
          color: "var(--theme-accent)",
          position: "relative",
          display: "inline-block",
          padding: "0.25rem 0",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "100%",
            height: "2px",
            background: "var(--theme-accent)",
            transform: "scaleX(0)",
            transformOrigin: "right",
            transition: "transform 0.3s ease",
          },
          "&:hover::after": {
            transform: "scaleX(1)",
            transformOrigin: "left",
          },
        },
        ".title": {
          "@apply text-4xl font-bold text-accent font-mono uppercase tracking-wider": {},
        },
        ".prose p, .prose blockquote, .prose ul": {
          "@apply max-w-xl": {}
        },
        ".prose pre, .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6": {
          "@apply max-w-3xl": {}
        },
        ".prose pre": {
          "@apply scrollbar scrollbar-thumb-accent scrollbar-track-bgSecondary": {},
        }
      });
      addUtilities({
        ".text-stroke": {
          "-webkit-text-stroke": "1px var(--theme-accent)",
          "text-stroke": "1px var(--theme-accent)",
        },
        ".text-stroke-2": {
          "-webkit-text-stroke": "2px var(--theme-accent)",
          "text-stroke": "2px var(--theme-accent)",
        },
      });
    }),
  ],
};
