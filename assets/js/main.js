// assets/js/main.js
(function () {
    const PHONE_PLACEHOLDER = "+7 (917) 814-51-62";
    const PHONE_HREF = "tel:+79178145162";
    const VK_LINK = "https://vk.com/id1104069924";
    const MAIL = "on.point.1@yandex.ru";

    const WEB3FORMS_ACCESS_KEY = "d3b441b5-d157-40fc-bd93-10031f893076";
    const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

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

    function formatPhone(value) {
        const digits = value.replace(/\D/g, "");
        let clean = digits;

        if (clean.startsWith("8")) {
            clean = "7" + clean.slice(1);
        }

        if (!clean.startsWith("7")) {
            clean = "7" + clean;
        }

        clean = clean.slice(0, 11);

        const p1 = clean.slice(1, 4);
        const p2 = clean.slice(4, 7);
        const p3 = clean.slice(7, 9);
        const p4 = clean.slice(9, 11);

        let result = "+7";

        if (p1) result += ` (${p1}`;
        if (p1.length === 3) result += ")";
        if (p2) result += ` ${p2}`;
        if (p3) result += `-${p3}`;
        if (p4) result += `-${p4}`;

        return result;
    }

    function getPhoneDigits(value) {
        return value.replace(/\D/g, "");
    }

    function getFieldValue(form, name) {
        const field = form.querySelector(`[name="${name}"]`);
        return field ? field.value.trim() : "";
    }

    function getServiceName(form) {
        return getFieldValue(form, "service") || "Не указано";
    }

    function getSubmitButtonDefaultText(button) {
        if (!button) return "Отправить";
        return button.dataset.defaultText || button.textContent.trim() || "Отправить";
    }

    function initPhoneMasks(root = document) {
        root.querySelectorAll('input[type="tel"]').forEach((input) => {
            if (input.dataset.maskInited === "true") return;
            input.dataset.maskInited = "true";

            input.setAttribute("inputmode", "tel");
            input.setAttribute("autocomplete", "tel");
            input.setAttribute("placeholder", "+7 (___) ___-__-__");
            input.setAttribute("maxlength", "18");

            input.addEventListener("focus", () => {
                if (!input.value.trim()) {
                    input.value = "+7 ";
                }
            });

            input.addEventListener("input", () => {
                input.value = formatPhone(input.value);
            });

            input.addEventListener("blur", () => {
                const digits = getPhoneDigits(input.value);

                if (digits.length <= 1) {
                    input.value = "";
                }
            });
        });
    }

    function buildWeb3FormsData(form, phoneDigits) {
        const formData = new FormData();

        const name = getFieldValue(form, "name") || "Не указано";
        const phone = getFieldValue(form, "phone");
        const service = getServiceName(form);
        const comment = getFieldValue(form, "comment") || "Без комментария";

        formData.append("access_key", WEB3FORMS_ACCESS_KEY);
        formData.append("subject", "New lead from worker-tlt.ru");
        formData.append("from_name", "worker-tlt.ru");

        formData.append("Name", name);
        formData.append("Phone", phone);
        formData.append("Call phone", `+${phoneDigits}`);
        formData.append("Service", service);
        formData.append("Comment", comment);
        formData.append("Page", window.location.href);
        formData.append("Date", new Date().toLocaleString("ru-RU"));

        return formData;
    }
    async function sendLead(form, phoneDigits) {
        const formData = buildWeb3FormsData(form, phoneDigits);

        const response = await fetch(WEB3FORMS_ENDPOINT, {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Ошибка отправки формы");
        }

        return result;
    }

    function initForms(root = document) {
        root.querySelectorAll("form[data-lead-form]").forEach((form) => {
            if (form.dataset.inited === "true") return;
            form.dataset.inited = "true";

            form.addEventListener("submit", async (e) => {
                e.preventDefault();

                const hp = form.querySelector('input[name="company"]');
                if (hp && hp.value.trim() !== "") {
                    return;
                }

                if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === "ВСТАВЬ_СЮДА_ACCESS_KEY") {
                    alert("Форма ещё не подключена. Укажите WEB3FORMS_ACCESS_KEY в assets/js/main.js.");
                    return;
                }

                const name = form.querySelector('input[name="name"]');
                const phone = form.querySelector('input[name="phone"]');
                const agree = form.querySelector('input[name="agree"]');
                const submitButton = form.querySelector('button[type="submit"]');
                const defaultButtonText = getSubmitButtonDefaultText(submitButton);

                if (name && name.value.trim() && name.value.trim().length < 2) {
                    alert("Укажите имя минимум из 2 символов.");
                    name.focus();
                    return;
                }

                if (!phone) {
                    alert("Не найдено поле телефона.");
                    return;
                }

                const phoneDigits = getPhoneDigits(phone.value);

                if (phoneDigits.length !== 11 || !phoneDigits.startsWith("7")) {
                    alert("Укажите корректный телефон в формате +7 (___) ___-__-__.");
                    phone.focus();
                    return;
                }

                if (agree && !agree.checked) {
                    alert("Нужно согласиться с политикой конфиденциальности.");
                    agree.focus();
                    return;
                }

                if (submitButton) {
                    submitButton.dataset.defaultText = defaultButtonText;
                    submitButton.disabled = true;
                    submitButton.textContent = "Отправляем...";
                }

                try {
                    await sendLead(form, phoneDigits);

                    alert("Заявка отправлена! Мы свяжемся с вами в ближайшее время.");
                    form.reset();
                } catch (error) {
                    console.error(error);
                    alert("Не удалось отправить заявку. Позвоните нам или напишите в VK.");
                } finally {
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = defaultButtonText;
                    }
                }
            });
        });
    }

    function openSocialRequest() {
        window.open(VK_LINK, "_blank");
    }

    document.addEventListener("DOMContentLoaded", () => {
        applyContacts();
        initPhoneMasks();
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
        initPhoneMasks();
        initForms();
    });
})();