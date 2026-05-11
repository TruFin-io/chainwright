import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

export default defineConfig({
    integrations: [
        starlight({
            title: "Chainwright",
            description: "Provision browser wallets for end-to-end testing of blockchain dapps.",
            logo: {
                light: "./src/assets/logo-dark.svg",
                dark: "./src/assets/logo-light.svg",
                replacesTitle: true,
            },
            favicon: "/favicon.svg",
            head: [
                {
                    tag: "link",
                    attrs: {
                        rel: "icon",
                        type: "image/png",
                        sizes: "96x96",
                        href: "/favicon-96x96.png",
                    },
                },
                {
                    tag: "link",
                    attrs: { rel: "icon", sizes: "any", href: "/favicon.ico" },
                },
                {
                    tag: "link",
                    attrs: { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
                },
                {
                    tag: "link",
                    attrs: { rel: "manifest", href: "/site.webmanifest" },
                },
            ],
            social: [
                {
                    icon: "github",
                    label: "GitHub",
                    href: "https://github.com/amaify/chainwright",
                },
            ],
            sidebar: [
                {
                    label: "Getting Started",
                    items: [
                        { slug: "getting-started/installation" },
                        { slug: "getting-started/quickstart" },
                        { slug: "getting-started/configuration" },
                    ],
                },
                {
                    label: "Guides",
                    items: [{ autogenerate: { directory: "guides" } }],
                },
                {
                    label: "Wallets",
                    items: [{ autogenerate: { directory: "wallets" } }],
                },
                {
                    label: "Reference",
                    items: [{ autogenerate: { directory: "reference" } }],
                },
            ],
            customCss: ["./src/styles/custom.css"],
        }),
    ],
});
