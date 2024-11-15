/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Incluye todos los archivos en la carpeta src
  ],
  theme: {
    extend: {
      keyframes: {
        'modal-in': {
          '0%': { transform: 'translateY(-100vh)' },  // Modal inicia fuera de la pantalla (arriba)
          '100%': { transform: 'translateY(0)' },  // Modal termina en su posición original
        },
      },
      animation: {
        'modal-in': 'modal-in 0.3s ease-out forwards',  // Define la animación con la duración y efecto
      },
    },
  },
  plugins: [],
}
