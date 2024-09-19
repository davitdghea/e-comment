
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    fontFamily: {
      main: ['']
    },
    listStyleType:{
      none:'none',
      disc:"disc",
      decimal:"decimal",
      square:"square",
      roman:"upper-roman",
    },
    extend: {
      width: {
        main: "1320px"
      },
      backgroundColor: {
        main: '#ee3131',
        overlay: 'rgba(0,0,0,0.3)'
      },
      color: {
        main: '#ee3131'
      },
      keyframes: {
        'slide-top': {
          '0%': {
            '-webkit-transform': 'translateY(20px)',
            transform: 'translateY(20px)'
          },
          '100%': {
            '-webkit-transform': 'translateY(0px)',
            transform: 'translateY(0px)'
          }
        },
        'slide-top-sm':{
          '0%':{
            '-webkit-transform':"translateY(8px);",
            transform:"translateY(8px);"
          },
          '100%': {
            '-webkit-transform': 'translateY(0px)',
            transform: 'translateY(0px)'
          }
        },
        'slide-right': {
          '0%': {
            '- webkit - transform': 'translateX(-10000px);',
            transform: 'translateX(-10000px);'
          },
          '100%': {
            '- webkit - transform': 'translateX(0);',
            transform: 'translateX(0);'
          }
        }
      },
      flex: {
        '2': '2 2 0%',
        '3': '3 3 0%',
        '4': '4 4 0%',
        '5': '5 5 0%'
      },
      animation: {
        'slide-top': 'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
        'slide-top-sm':'slide-top-sm 0.2s linear both;',
        'slide-right':"slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;"
      }
    },
  },
  plugins: [

  ],
}