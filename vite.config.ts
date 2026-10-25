import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    deps: {
      // tsdown <0.23 compatibility: resolve external dependency subpaths.
      // Remove to preserve subpath imports as written (the new default).
      // https://tsdown.dev/options/dependencies#deps-resolvedepsubpath
      resolveDepSubpath: true,
    },
    dts: {
      generator: "tsgo",
    },
    exports: true,
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
    ignorePatterns: ["sponsorkit/**"],
  },
  fmt: {
    sortImports: true,
    sortPackageJson: true,
    ignorePatterns: ["sponsorkit/**"],
  },
  run: {
    tasks: {
      sponsorkit: {
        command: "vpx sponsorkit",
        cache: {
          env: [
            "SPONSORKIT_GITHUB_TOKEN",
            "SPONSORKIT_GITHUB_LOGIN",
            "SPONSORKIT_LIBERAPAY_LOGIN",
            "SPONSORKIT_KOFI_VERIFICATION_TOKEN",
          ],
        },
      },
    },
  },
  staged: {
    "*": "vp check --fix"
  }
});
