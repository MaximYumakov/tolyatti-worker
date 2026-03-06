// assets/js/main.js
(function () {
    const PHONE_PLACEHOLDER = "+7 (XXX) XXX-XX-XX";
    const PHONE_HREF = "tel:+7XXXXXXXXXX";
    const TG_LINK = "https://t.me/username"; // заглушка
    const MAIL = "mail@example.com";

    function applyContacts(root = document) {
        root.querySelectorAll("[data-phone]").forEach(el => {
            el.textContent = PHONE_PLACEHOLDER;
        });

        root.querySelectorAll("[data-phone-href]").forEach(el => {
            el.setAttribute("href", PHONE_HREF);
        });

        root.querySelectorAll("[data-tg-href]").forEach(el => {
            el.setAttribute("href", TG_LINK);
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

    function openTelegramPhotoRequest() {
        const page = document.title || "Сайт";
        const text = encodeURIComponent(
            `Здравствуйте! Нужна помощь: ${page}. Город: Тольятти. Прикрепляю фото, подскажите стоимость.`
        );

        window.open(`${TG_LINK}?text=${text}`, "_blank");
    }

    document.addEventListener("DOMContentLoaded", () => {
        applyContacts();
        initForms();
    });

    document.addEventListener("click", (e) => {
        const tgPhotoBtn = e.target.closest("[data-tg-photo]");
        if (tgPhotoBtn) {
            e.preventDefault();
            openTelegramPhotoRequest();
        }
    });

    document.addEventListener("layout:updated", () => {
        applyContacts();
        initForms();
    });
})();