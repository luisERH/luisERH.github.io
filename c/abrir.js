// Convite por link (`/c/<código>`). Com o app instalado, o Android abre direto e esta página nem aparece
// (App Links, `/.well-known/assetlinks.json`). Sem o app, ela leva à loja com o código no referrer: o app o lê
// na primeira abertura e a pessoa não digita nada. O código só sai da URL para os dois links abaixo.
(function () {
  var APP_ID = 'com.luiserh.diario';
  var match = /^\/c\/([A-Za-z2-9]{6})\/?$/.exec(window.location.pathname);
  var code = match ? match[1].toUpperCase() : null;
  var open = document.getElementById('abrir');
  var install = document.getElementById('instalar');
  var phrase = document.getElementById('frase');

  if (!code) {
    phrase.textContent = 'Este link de convite não está completo. Peça um novo a quem enviou.';
    open.classList.add('oculto');
    install.classList.add('oculto');
    return;
  }

  open.href = 'diario://convite/' + code;
  install.href = 'https://play.google.com/store/apps/details?id=' + APP_ID + '&referrer=' + encodeURIComponent('convite=' + code);
  document.getElementById('codigo').textContent = code.slice(0, 3) + ' ' + code.slice(3);
  document.getElementById('plano-b').classList.remove('oculto');
})();
