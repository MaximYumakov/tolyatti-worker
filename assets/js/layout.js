// assets/js/layout.js
async function loadComponent(selector, file) {
    const element = document.querySelector(selector);
    if (!element) return;

    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Не удалось загрузить ${file}: ${response.status}`);
        }

        const html = await response.text();
        element.innerHTML = html;
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await Promise.all([
        loadComponent("#header", "/components/header.html"),
        loadComponent("#footer", "/components/footer.html")
    ]);

    document.dispatchEvent(new CustomEvent("layout:updated"));
});