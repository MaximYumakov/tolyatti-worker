// assets/js/main.js
(function () {
    const PHONE_PLACEHOLDER = "+7 (917) 814-51-62";
    const PHONE_HREF = "tel:+79178145162";
    const VK_LINK = "https://vk.com/id1104069924";
    const MAIL = "on.point.1@yandex.ru";

    function applyContacts(root = document) {
        root.querySelectorAll("[data-phone]").forEach(el => {
            el.textContent = PHONE_PLACEHOLDER;
        });

        root.querySelectorAll("[data-phone-href]").forEach(el => {
            el.setAttribute("href", PHONE_HREF);
        });

        root.querySelectorAll("[data-tg-href]").forEach(el => {
            el.setAttribute("href", VK_LINK);
        });

        root.querySelectorAll("[data-mail]").forEach(el => {
            el.textContent = MAIL;
        });

        root.querySelectorAll("[data-mail-href]").forEach(el => {
            el.setAttribute("href", `mailto:${MAIL}`);
        });

        root.querySelectorAll("#year").forEach(el => {
            el.textContent = new Date().getFullYear();
        });
    }

    function initForms(root = document) {
        root.querySelectorAll("form[data-lead-form]").forEach((form) => {
            if (form.dataset.inited === "true") return;
            form.dataset.inited = "true";

            form.addEventListener("submit", (e) => {
                const hp = form.querySelector('input[name="company"]');
                if (hp && hp.value.trim() !== "") {
                    e.preventDefault();
                    return;
                }

                const phone = form.querySelector('input[name="phone"]');
                const agree = form.querySelector('input[name="agree"]');

                if (!phone || phone.value.trim().length < 7) {
                    e.preventDefault();
                    alert("Укажите телефон для связи.");
                    phone?.focus();
                    return;
                }

                if (agree && !agree.checked) {
                    e.preventDefault();
                    alert("Нужно согласиться с политикой конфиденциальности.");
                    agree.focus();
                    return;
                }

                e.preventDefault();
                alert("Заявка отправлена! Мы свяжемся с вами в ближайшее время.");
                form.reset();
            });
        });
    }

    function openSocialRequest() {
        window.open(VK_LINK, "_blank");
    }

    document.addEventListener("DOMContentLoaded", () => {
        applyContacts();
        initForms();
    });

    document.addEventListener("click", (e) => {
        const socialBtn = e.target.closest("[data-tg-photo]");
        if (socialBtn) {
            e.preventDefault();
            openSocialRequest();
        }
    });

    document.addEventListener("layout:updated", () => {
        applyContacts();
        initForms();
    });
})();