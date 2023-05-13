import { defineConfig } from "vite";

export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command !== "serve") {
    // command === 'build'
    return {
      // build specific config
      base: "/wano-maps",
      build: {
        outDir: "../dist",
      },
    };
  }
  return {};
});
