(function () {
    const service = document.getElementById("calc-service");
    const volume = document.getElementById("calc-volume");
    const loading = document.getElementById("calc-loading");
    const result = document.getElementById("calc-result");

    if (!service || !volume || !loading || !result) return;

    function formatPrice(value) {
        return "от " + new Intl.NumberFormat("ru-RU").format(value) + " ₽";
    }

    function calculate() {
        const servicePrice = Number(service.value || 0);
        const volumeMultiplier = Number(volume.value || 1);
        const loadingPrice = Number(loading.value || 0);

        const total = Math.round(servicePrice * volumeMultiplier + loadingPrice);
        result.textContent = formatPrice(total);
    }

    service.addEventListener("change", calculate);
    volume.addEventListener("change", calculate);
    loading.addEventListener("change", calculate);

    calculate();
})();