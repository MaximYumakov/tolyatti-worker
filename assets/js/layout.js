// assets/js/layout.js
function getBasePath() {
    const { hostname, pathname } = window.location;

    // Локально или на обычном домене сайт живёт от корня
    if (
        hostname === "127.0.0.1" ||
        hostname === "localhost" ||
        !hostname.endsWith("github.io")
    ) {
        return "";
    }

    // GitHub Pages project site: /repo-name/...
    const parts = pathname.split("/").filter(Boolean);
    return parts.length > 0 ? `/${parts[0]}` : "";
}

const BASE_PATH = getBasePath();

function normalizePath(path) {
    if (!path.startsWith("/")) return path;
    return `${BASE_PATH}${path}`;
}

async function loadComponent(selector, file) {
    const element = document.querySelector(selector);
    if (!element) return;

    try {
        const response = await fetch(normalizePath(file));

        if (!response.ok) {
            throw new Error(`Не удалось загрузить ${normalizePath(file)}: ${response.status}`);
        }

        const html = await response.text();
        element.innerHTML = html;
    } catch (error) {
        console.error(error);
    }
}

function applyComponentLinks(root = document) {
    root.querySelectorAll("[data-nav]").forEach((link) => {
        const raw = link.getAttribute("data-nav");
        if (!raw) return;
        link.setAttribute("href", normalizePath(raw));
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await Promise.all([
        loadComponent("#header", "/components/header.html"),
        loadComponent("#footer", "/components/footer.html")
    ]);

    applyComponentLinks(document);
    document.dispatchEvent(new CustomEvent("layout:updated"));
});
