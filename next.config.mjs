// next.config.mjs (ESM)
const nextConfig = {
  output: 'export',        // para generar ./out con next export
  trailingSlash: true,     // ayuda en IIS con rutas /foo/ -> foo/index.html
  images: { unoptimized: true }, // si usas next/image
};

export default nextConfig;