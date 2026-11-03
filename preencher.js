// Troca os marcadores [data-diario="email|controlador|encarregado"] pelos dados de contato.js.
(function () {
  var d = window.DIARIO || {};
  document.querySelectorAll('[data-diario]').forEach(function (el) {
    var value = d[el.getAttribute('data-diario')];
    if (!value) return;
    if (el.tagName === 'A' && el.getAttribute('data-diario') === 'email') {
      el.textContent = value;
      el.setAttribute('href', 'mailto:' + value);
    } else {
      el.textContent = value;
    }
  });
})();
