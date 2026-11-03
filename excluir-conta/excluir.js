// Exclusão de conta pela web: entra com e-mail e senha (Supabase Auth) e chama a Edge Function
// `account` com o token da sessão. Nada é guardado no navegador: o token vive só nesta memória.
(function () {
  var formEntrar = document.getElementById('form-entrar');
  var formExcluir = document.getElementById('form-excluir');
  var status = document.getElementById('status');
  var botaoExcluir = document.getElementById('excluir');
  var palavra = document.getElementById('palavra');
  var token = null;

  function dizer(texto, erro) {
    status.textContent = texto;
    status.style.color = erro ? 'var(--danger)' : 'inherit';
  }

  function mensagem(codigo) {
    if (codigo === 'invalid_credentials' || codigo === 400) return 'E-mail ou senha incorretos.';
    if (codigo === 'email_not_confirmed') return 'Confirme o e-mail da conta antes (abra o app e digite o código).';
    return 'Não foi possível concluir agora. Nada foi apagado; tente de novo em instantes.';
  }

  formEntrar.addEventListener('submit', function (evento) {
    evento.preventDefault();
    dizer('Entrando…', false);
    var api = window.DIARIO_API;
    fetch(api.url + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: api.key },
      body: JSON.stringify({ email: document.getElementById('email').value.trim().toLowerCase(), password: document.getElementById('senha').value }),
    })
      .then(function (resposta) {
        return resposta.json().then(function (corpo) {
          if (!resposta.ok || !corpo.access_token) throw new Error(corpo.error_code || resposta.status);
          return corpo;
        });
      })
      .then(function (corpo) {
        token = corpo.access_token;
        document.getElementById('senha').value = '';
        formEntrar.classList.add('oculto');
        formExcluir.classList.remove('oculto');
        document.getElementById('logado').textContent = 'Conta: ' + (corpo.user && corpo.user.email ? corpo.user.email : '');
        dizer('', false);
        palavra.focus();
      })
      .catch(function (erro) {
        dizer(mensagem(erro.message), true);
      });
  });

  palavra.addEventListener('input', function () {
    botaoExcluir.disabled = palavra.value.trim().toUpperCase() !== 'EXCLUIR';
  });

  formExcluir.addEventListener('submit', function (evento) {
    evento.preventDefault();
    if (palavra.value.trim().toUpperCase() !== 'EXCLUIR' || !token) return;
    botaoExcluir.disabled = true;
    dizer('Excluindo… isso pode levar alguns segundos.', false);
    var api = window.DIARIO_API;
    fetch(api.url + '/functions/v1/account', {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: api.key, authorization: 'Bearer ' + token },
      body: JSON.stringify({ acao: 'excluir_conta', confirmar: true }),
    })
      .then(function (resposta) {
        if (!resposta.ok) throw new Error('falha');
        token = null;
        formExcluir.classList.add('oculto');
        dizer('Pronto: sua conta e seus dados foram excluídos. Você pode fechar esta página.', false);
      })
      .catch(function () {
        botaoExcluir.disabled = false;
        dizer('Não foi possível excluir agora. Nada foi apagado; tente de novo em instantes.', true);
      });
  });
})();
