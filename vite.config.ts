import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  
  // Pre-bundle CommonJS dependencies
  optimizeDeps: {
    include: [
      "@syncfusion/ej2-react-buttons",
      "@syncfusion/ej2-react-grids",
      "@syncfusion/ej2-react-charts",
      "@syncfusion/ej2-base",
      "@syncfusion/ej2-react-navigations",
      // Add other Syncfusion packages you're using
    ],
  },
  
  ssr: {
    // Fixed typo: syncfuntion -> syncfusion
    noExternal: [/@syncfusion/]
  },
  
  // Additional build configuration for CommonJS modules
  build: {
    commonjsOptions: {
      include: [/@syncfusion/, /node_modules/],
    },
  },
});
