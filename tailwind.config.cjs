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
        '10xl': '10rem',
        '12xl': '12rem',
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
        // Neon colors
        "neon-pink": "var(--neon-pink)",
        "neon-cyan": "var(--neon-cyan)",
        "neon-purple": "var(--neon-purple)",
        "neon-chartreuse": "var(--neon-chartreuse)",
        "neon-orange": "var(--neon-orange)",
      },
      fontFamily: {
        // Synthwave fonts
        'orbitron': ['Orbitron', 'sans-serif'],
        'exo': ['Exo 2', 'sans-serif'],
        sans: ['Exo 2', ...fontFamily.sans],
        serif: [...fontFamily.serif],
      },
      transitionProperty: {
        height: "height",
      },
      boxShadow: {
        'neon-pink': '0 0 5px #FF6B9D, 0 0 10px #FF6B9D, 0 0 20px #FF6B9D',
        'neon-pink-lg': '0 0 10px #FF6B9D, 0 0 20px #FF6B9D, 0 0 40px #FF6B9D',
        'neon-cyan': '0 0 5px #00D9FF, 0 0 10px #00D9FF, 0 0 20px #00D9FF',
        'neon-cyan-lg': '0 0 10px #00D9FF, 0 0 20px #00D9FF, 0 0 40px #00D9FF',
        'neon-purple': '0 0 5px #C7A3FF, 0 0 10px #C7A3FF, 0 0 20px #C7A3FF',
        'neon-chartreuse': '0 0 5px #DAFF01, 0 0 10px #DAFF01, 0 0 20px #DAFF01',
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 5px #FF6B9D, 0 0 10px #FF6B9D, 0 0 15px #FF6B9D',
          },
          '50%': {
            boxShadow: '0 0 10px #FF6B9D, 0 0 20px #FF6B9D, 0 0 30px #FF6B9D',
          },
        },
        'glow': {
          '0%': {
            textShadow: '0 0 5px #FF6B9D, 0 0 10px #FF6B9D',
          },
          '100%': {
            textShadow: '0 0 10px #FF6B9D, 0 0 20px #FF6B9D, 0 0 30px #FF6B9D',
          },
        },
      },
      typography: (theme) => ({
        neon: {
          css: {
            "--tw-prose-body": "var(--theme-text)",
            "--tw-prose-headings": "var(--neon-pink)",
            "--tw-prose-links": "var(--neon-cyan)",
            "--tw-prose-bold": "var(--theme-text)",
            "--tw-prose-bullets": "var(--neon-pink)",
            "--tw-prose-quotes": "var(--theme-quote)",
            "--tw-prose-code": "var(--neon-cyan)",
            "--tw-prose-hr": "1px solid rgba(255, 107, 157, 0.3)",
            "--tw-prose-th-borders": "rgba(255, 107, 157, 0.3)",
          },
        },
        DEFAULT: {
          css: {
            a: {
              color: "var(--neon-cyan)",
              textDecoration: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                textShadow: "0 0 10px var(--neon-cyan)",
              },
            },
            strong: {
              fontWeight: "700",
              color: "var(--neon-pink)",
            },
            code: {
              border: "1px solid rgba(255, 107, 157, 0.3)",
              borderRadius: "4px",
              backgroundColor: "rgba(255, 107, 157, 0.1)",
              color: "var(--neon-cyan)",
            },
            blockquote: {
              borderLeftWidth: "4px",
              borderLeftColor: "var(--neon-pink)",
              backgroundColor: "rgba(255, 107, 157, 0.05)",
              padding: "1rem",
            },
            hr: {
              borderColor: "rgba(255, 107, 157, 0.3)",
            },
            thead: {
              borderBottomWidth: "none",
            },
            "thead th": {
              fontWeight: "700",
              borderBottom: "1px solid rgba(255, 107, 157, 0.3)",
              color: "var(--neon-pink)",
            },
            "tbody tr": {
              borderBottomWidth: "none",
            },
            tfoot: {
              borderTop: "1px solid rgba(255, 107, 157, 0.3)",
            },
            h1: {
              color: "var(--neon-pink)",
            },
            h2: {
              color: "var(--neon-pink)",
            },
            h3: {
              color: "var(--neon-cyan)",
            },
            h4: {
              color: "var(--neon-purple)",
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
        ".cactus-link": {
          color: "var(--neon-cyan)",
          textDecoration: "none",
          position: "relative",
          transition: "all 0.3s ease",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-2px",
            left: "0",
            width: "0",
            height: "2px",
            background: "var(--neon-cyan)",
            boxShadow: "0 0 5px var(--neon-cyan), 0 0 10px var(--neon-cyan)",
            transition: "width 0.3s ease",
          },
          "&:hover": {
            textShadow: "0 0 10px var(--neon-cyan)",
          },
          "&:hover::after": {
            width: "100%",
          },
        },
        ".title": {
          "@apply text-2xl font-bold font-orbitron uppercase tracking-wider": {},
          color: "var(--neon-pink)",
          textShadow: "0 0 10px rgba(255, 107, 157, 0.5)",
        },
        ".prose p, .prose blockquote, .prose ul": {
          "@apply max-w-xl": {}
        },
        ".prose pre, .prose h1, .prose h2,.prose h3,.prose h4,.prose h5,.prose h6": {
          "@apply max-w-3xl": {}
        },
        ".prose pre": {
          "@apply scrollbar scrollbar-thumb-neon-pink scrollbar-track-transparent border border-neon-pink/30": {},
          boxShadow: "0 0 10px rgba(255, 107, 157, 0.2)",
        }
      });
    }),
  ],
};
