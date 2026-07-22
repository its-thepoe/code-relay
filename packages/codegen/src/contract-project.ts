import fs from "node:fs/promises";
import path from "node:path";
import {
  writeCanonicalSiteBundle,
  type CanonicalRoute,
  type CanonicalSiteBundle,
} from "../../content-contract/src/index.js";

export type ContractProjectResult = {
  projectDir: string;
  bundleDir: string;
  routeCount: number;
  generatedFiles: string[];
};

export async function generateViteProjectFromBundle(
  bundle: CanonicalSiteBundle,
  projectDir: string,
): Promise<ContractProjectResult> {
  await fs.mkdir(projectDir, { recursive: true });
  await fs.mkdir(path.join(projectDir, "src"), { recursive: true });
  await writeCanonicalSiteBundle(bundle, path.join(projectDir, ".coderelay"));

  const files = new Map<string, string>();
  files.set("package.json", JSON.stringify(projectPackageJson(bundle), null, 2) + "\n");
  files.set("index.html", indexHtml(bundle));
  files.set("vite.config.ts", viteConfig());
  files.set("tsconfig.json", tsconfigJson());
  files.set("src/main.tsx", mainTsx(bundle.routes.routes));
  files.set("src/styles.css", stylesCss());
  files.set("ARCHITECTURE.md", architectureDoc(bundle));

  for (const [relativePath, source] of files) {
    const absolute = path.join(projectDir, relativePath);
    await fs.mkdir(path.dirname(absolute), { recursive: true });
    await fs.writeFile(absolute, source, "utf8");
  }

  return {
    projectDir,
    bundleDir: path.join(projectDir, ".coderelay"),
    routeCount: bundle.routes.routes.length,
    generatedFiles: [...files.keys(), ".coderelay/manifest.json"],
  };
}

function projectPackageJson(bundle: CanonicalSiteBundle) {
  return {
    name: safePackageName(bundle.project.id),
    private: true,
    version: "0.0.0",
    type: "module",
    scripts: {
      dev: "vite --host 0.0.0.0",
      build: "tsc --noEmit && vite build",
      preview: "vite preview --host 0.0.0.0",
    },
    dependencies: {
      "@vitejs/plugin-react": "^5.1.0",
      vite: "^7.2.7",
      typescript: "^5.8.3",
      react: "^19.1.1",
      "react-dom": "^19.1.1",
      "@types/react": "^19.2.15",
      "@types/react-dom": "^19.2.3",
    },
    devDependencies: {},
  };
}

function indexHtml(bundle: CanonicalSiteBundle) {
  const title = bundle.project.title?.value ?? bundle.project.id;
  return `<!doctype html>
<html lang="${escapeHtml(bundle.project.locales[0] ?? "en")}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

function viteConfig() {
  return `import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
});
`;
}

function tsconfigJson() {
  return `${JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        useDefineForClassFields: true,
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        allowJs: false,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        module: "ESNext",
        moduleResolution: "Bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
      },
      include: ["src"],
    },
    null,
    2,
  )}\n`;
}

function mainTsx(routes: CanonicalRoute[]) {
  const routeRecords = routes.map((route) => ({
    path: route.path,
    title: route.seo?.title?.value ?? route.path,
    kind: route.kind,
    templateKind: route.templateKind,
    redirectTo: route.redirect?.to ?? null,
    redirectStatus: route.redirect?.status ?? null,
  }));
  return `import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const routes = ${JSON.stringify(routeRecords, null, 2)} as const;

function normalizePath(value: string) {
  if (value.length > 1 && value.endsWith("/")) return value.slice(0, -1);
  return value || "/";
}

function App() {
  const currentPath = normalizePath(window.location.pathname);
  const route = routes.find((entry) => normalizePath(entry.path) === currentPath) ?? routes[0];

  React.useEffect(() => {
    if (route?.redirectTo) window.location.replace(route.redirectTo);
  }, [route]);

  if (!route) {
    return <main className="page-shell"><h1>No routes in bundle</h1></main>;
  }
  if (route.redirectTo) {
    return <main className="page-shell"><h1>Redirecting</h1><p>{route.path} redirects to {route.redirectTo}</p></main>;
  }
  return (
    <main className="page-shell">
      <p className="eyebrow">Code Relay canonical bundle</p>
      <h1>{route.title}</h1>
      <dl>
        <div><dt>Route</dt><dd>{route.path}</dd></div>
        <div><dt>Template</dt><dd>{route.templateKind}</dd></div>
        <div><dt>Kind</dt><dd>{route.kind}</dd></div>
      </dl>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
`;
}

function stylesCss() {
  return `:root {
  color: #171717;
  background: #fbfbf8;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  margin: 0;
}

.page-shell {
  width: min(760px, calc(100vw - 32px));
  margin: 12vh auto;
}

.eyebrow {
  color: #5f6f52;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  margin: 0 0 24px;
  font-size: clamp(2rem, 6vw, 4rem);
  line-height: 1;
  letter-spacing: 0;
}

dl {
  display: grid;
  gap: 8px;
}

dl > div {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  border-top: 1px solid #ddd8ce;
  padding: 12px 0;
}

dt {
  color: #706f68;
}

dd {
  margin: 0;
  font-weight: 650;
}
`;
}

function architectureDoc(bundle: CanonicalSiteBundle) {
  return `# Generated From Code Relay Canonical Bundle

This project was generated from \`.coderelay/manifest.json\`.

- Routes: ${bundle.routes.routes.length}
- Components: ${bundle.components.components.length}
- CMS collections: ${bundle.cms.index.collections.length}
- Code files: ${bundle.code.files.length}

The generated route shell intentionally reads only canonical bundle data. Runtime, Framer, CMS, and code-file evidence should be changed in the bundle first, then regenerated.
`;
}

function safePackageName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 214) || "coderelay-export";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
