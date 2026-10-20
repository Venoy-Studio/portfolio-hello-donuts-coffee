/* Hello Donuts & Coffee — Script Aprimorado (Code Makers / Anti-AI CRO) */
(function () {
  'use strict';

  var header = document.querySelector('.header');
  var hero = document.querySelector('.hero');
  var fab = document.querySelector('.fab--auto');
  var nav = document.getElementById('nav');
  var toggle = document.querySelector('.menu-toggle');

  // Topo e WhatsApp flutuante aparecem depois da abertura
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) {
      header.classList.toggle('is-scrolled', y > 8);
      if (header.classList.contains('header--auto')) {
        var limit = hero ? hero.offsetHeight - 140 : 0;
        var shown = y > limit;
        header.classList.toggle('is-shown', shown);
        if (!shown) closeMenu();
      }
    }
    if (fab) fab.classList.toggle('is-shown', y > (hero ? hero.offsetHeight * 0.6 : 200));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Menu Mobile
  function closeMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  }
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.header')) closeMenu();
    });
  }

  // Granulado colorido flutuando
  var colors = ['#ffffff', '#ffe08a', '#8fd6c4', '#9ad0ff', '#ffb3cd', '#fdb827'];
  document.querySelectorAll('.show__sprinkles').forEach(function (box) {
    var total = window.innerWidth < 700 ? 9 : 16;
    for (var i = 0; i < total; i++) {
      var s = document.createElement('span');
      s.className = 'sprinkle';
      s.style.left = (Math.random() * 96 + 2).toFixed(1) + '%';
      s.style.top = (Math.random() * 92 + 2).toFixed(1) + '%';
      s.style.setProperty('--c', colors[i % colors.length]);
      s.style.setProperty('--r', Math.round(Math.random() * 180) + 'deg');
      s.style.setProperty('--s', (0.6 + Math.random() * 0.7).toFixed(2));
      s.style.setProperty('--t', (5 + Math.random() * 5).toFixed(1) + 's');
      s.style.setProperty('--dl', (-Math.random() * 8).toFixed(1) + 's');
      box.appendChild(s);
    }
  });

  // Reveal Animations
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Scroll Spy
  function spy(links, activeClass, onChange) {
    var map = [];
    links.forEach(function (a) {
      var id = (a.getAttribute('href') || '').split('#')[1];
      var target = id && document.getElementById(id);
      if (target) map.push({ a: a, el: target });
    });
    if (map.length < 2) return;
    var current = null;
    function update() {
      var line = window.innerHeight * 0.35;
      var found = map[0];
      map.forEach(function (m) { if (m.el.getBoundingClientRect().top <= line) found = m; });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) found = map[map.length - 1];
      if (found.a === current) return;
      current = found.a;
      links.forEach(function (a) { a.classList.toggle(activeClass, a === current); });
      if (onChange) onChange(current);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
  spy(Array.prototype.slice.call(document.querySelectorAll('.nav__link[href^="#"]')), 'is-active');
  var tabs = document.getElementById('tabs');
  if (tabs) {
    spy(Array.prototype.slice.call(tabs.querySelectorAll('.tab')), 'is-active', function (a) {
      var left = a.offsetLeft - (tabs.clientWidth - a.offsetWidth) / 2;
      tabs.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    });
  }

  // Carrosséis horizontais (Rails)
  document.querySelectorAll('.rail-wrap').forEach(function (wrap) {
    var rail = wrap.querySelector('.rail');
    var prev = wrap.querySelector('.rail-btn--prev');
    var next = wrap.querySelector('.rail-btn--next');
    var bar = wrap.querySelector('.rail-bar');
    if (!rail) return;
    function update() {
      var max = rail.scrollWidth - rail.clientWidth;
      var has = max > 8;
      if (prev) prev.hidden = !has || rail.scrollLeft <= 4;
      if (next) next.hidden = !has || rail.scrollLeft >= max - 4;
      if (bar) {
        bar.hidden = !has;
        if (has) {
          var share = rail.clientWidth / rail.scrollWidth;
          var thumb = bar.firstElementChild;
          thumb.style.setProperty('--w', (share * 100).toFixed(1) + '%');
          thumb.style.setProperty('--x', ((rail.scrollLeft / max) * (1 - share) / share * 100).toFixed(1) + '%');
        }
      }
    }
    function go(dir) {
      rail.scrollBy({ left: dir * Math.max(260, rail.clientWidth * 0.8), behavior: 'smooth' });
    }
    rail.addEventListener('keydown', function (e) {
      if (e.target !== rail || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
      e.preventDefault();
      var card = rail.querySelector('.card');
      var passo = card ? card.getBoundingClientRect().width + 14 : 260;
      rail.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * passo, behavior: 'smooth' });
    });
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    update();
  });

  // Status da Loja em Tempo Real (Aberto / Fechado)
  function checkStoreStatus() {
    var now = new Date();
    var hour = now.getHours();
    var isOpen = hour >= 11 && hour < 21;
    document.querySelectorAll('.status-indicator').forEach(function (el) {
      var dot = el.querySelector('.status-dot');
      var txt = el.querySelector('.status-txt');
      if (dot) dot.classList.toggle('status-dot--closed', !isOpen);
      if (txt) {
        txt.textContent = isOpen 
          ? 'Loja aberta agora · Pedidos saindo em 25-35 min' 
          : 'Loja fechada agora · Abre às 11h (pode adiantar pedido)';
      }
    });
  }
  checkStoreStatus();

  // Toast Notification System
  var toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);
  }

  function showToast(title, subtitle) {
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = 
      '<div class="toast__icon">🍩</div>' +
      '<div class="toast__body">' +
        '<strong>' + title + '</strong>' +
        '<span>' + subtitle + '</span>' +
      '</div>' +
      '<button class="toast__action" type="button" data-cart-open>Ver sacola</button>';
    
    toastContainer.appendChild(toast);
    setTimeout(function () {
      toast.style.animation = 'toast-out 0.25s forwards';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, 3500);
  }

  // Quick Modal para Detalhes do Donut
  var quickModal = document.getElementById('quick-modal');
  var quickImg = document.getElementById('qm-img');
  var quickBadge = document.getElementById('qm-badge');
  var quickTitle = document.getElementById('qm-title');
  var quickPrice = document.getElementById('qm-price');
  var quickDesc = document.getElementById('qm-desc');
  var quickTags = document.getElementById('qm-tags');
  var quickQty = document.getElementById('qm-qty');
  var quickAddBtn = document.getElementById('qm-add-btn');
  var quickCurrentId = null;

  var productDetails = {
    'ferrero-rocher': {
      desc: 'Massa tradicional ultraleve com fermentação lenta de 24 horas. Recheio artesanal cremoso de avelã italiana e castanhas tostadas. Coberto com blend de chocolate nobre e coroado com bombom Ferrero Rocher legítimo.',
      badge: 'Super Premium ⭐',
      tags: ['Cacau Nobre', 'Avelã Italiana', 'Fermentação 24h', 'Sem Gordura Hidrogenada']
    },
    'kinder-bueno': {
      desc: 'Recheado fartamente com pedaços crocantes de Kinder Bueno e ganache de chocolate branco suíço. Cobertura dupla com raspas finas e bombom Kinder no topo.',
      badge: 'Super Premium ⭐',
      tags: ['Kinder Legítimo', 'Chocolate Branco Nobre', 'Mais Vendido']
    },
    'pistache': {
      desc: 'Recheio aveludado de chocolate branco com pasta pura de pistache da Sicília. Cobertura espelhada salpicada com generosos pedaços de pistache levemente tostados.',
      badge: 'Gourmet Artesanal 🌿',
      tags: ['Pistache 100% Puro', 'Pouco Doce', 'Gourmet Especial']
    },
    'churros': {
      desc: 'Massa dourada fofíssima empanada no açúcar cristal e canela aromática, com vulcão de doce de leite cremoso artesanal tipo argentino.',
      badge: 'Clássico Amado 🍯',
      tags: ['Doce de Leite Cremoso', 'Canela Especial', 'Receita Secreta']
    },
    'm-m-s': {
      desc: 'Donut de massa amanteigada coberto com farta camada de ganache de chocolate ao leite e confeitos coloridos crocantes de M&M.',
      badge: 'Favorito da Galera 🌈',
      tags: ['Crocante', 'Chocolate ao Leite', 'Perfeito para Crianças']
    },
    'milkshake-homer': {
      desc: 'Milkshake ultra cremoso cor-de-rosa sabor morango silvestre especial da casa, com generosa camada de chantilly fresco e granulados coloridos artesanais.',
      badge: 'Assinatura da Casa 🍓',
      tags: ['Sorvete Artesanal', 'Chantilly Fresco', 'Edição Homer']
    },
    'combo-felicidade': {
      desc: 'O trio perfeito para matar a fome com excelência: 1 Donut Salgado de Frango com Cream Cheese + 1 Donut Doce de Chocolate + 1 Refrigerante geladinho 220ml à sua escolha.',
      badge: 'Melhor Custo-Benefício 🏆',
      tags: ['Salgado + Doce + Bebida', 'Economia Garantida', 'Pronto em 15min']
    }
  };

  function openQuickModal(id, itemData) {
    if (!quickModal) return;
    quickCurrentId = id;
    var details = productDetails[id] || {
      desc: 'Massa artesanal macia, preparada diariamente com ingredientes selecionados e sem conservantes artificiais.',
      badge: 'Donut Artesanal ✨',
      tags: ['Fresco do Dia', 'Massa Aerada', 'Sem Conservantes']
    };

    if (quickTitle) quickTitle.textContent = itemData[0];
    if (quickPrice) quickPrice.textContent = 'R$ ' + (itemData[1] / 100).toFixed(2).replace('.', ',');
    if (quickBadge) quickBadge.textContent = details.badge;
    if (quickDesc) quickDesc.textContent = details.desc;
    if (quickImg && itemData[2]) {
      quickImg.src = 'assets/img/cut/' + itemData[2] + '.webp';
      quickImg.alt = itemData[0];
    }
    if (quickTags) {
      quickTags.innerHTML = details.tags.map(function (t) {
        return '<span class="quick-modal__tag">' + t + '</span>';
      }).join('');
    }
    if (quickQty) quickQty.textContent = '1';

    if (quickModal.showModal) quickModal.showModal();
    else quickModal.setAttribute('open', '');
  }

  // Carrinho e Gestão de Compras
  var cart = document.getElementById('cart');
  var catalogo = document.getElementById('hd-catalogo');
  if (cart && catalogo) (function () {
    var loja;
    try { loja = JSON.parse(catalogo.textContent); } catch (e) { return; }

    var CHAVE = 'hd-carrinho-v2';
    var VALE = 24 * 60 * 60 * 1000;
    var MAX = 99;
    var META_FRETE = 6000; // R$ 60,00 para frete grátis / brinde
    var CUPOM_VALIDO = 'HELLO10';
    var DESCONTO_CUPOM = 0.10;

    var tem = Object.prototype.hasOwnProperty;
    var root = document.documentElement;
    var lista = document.getElementById('cart-list');
    var molde = document.getElementById('cart-row');
    var obs = document.getElementById('cart-obs');
    var ir = document.getElementById('cart-go');
    var bar = document.getElementById('cartbar');
    var live = document.getElementById('cart-live');
    var fechar = cart.querySelector('.cart__close');
    var limpar = cart.querySelector('.cart__clear');
    var selo = document.querySelector('.order-btn__n');
    var semMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Novos elementos CRO no Carrinho
    var progressBar = document.getElementById('cart-progress');
    var progressText = document.getElementById('cart-progress-text');
    var progressFill = document.getElementById('cart-progress-fill');
    var deliveryType = localStorage.getItem('hd-tipo-entrega') || 'delivery';
    var addressInput = document.getElementById('cart-address');
    var couponInput = document.getElementById('cart-coupon-input');
    var couponBtn = document.getElementById('cart-coupon-btn');
    var couponFeedback = document.getElementById('cart-coupon-feedback');
    var discountRow = document.getElementById('cart-discount-row');
    var discountAmount = document.getElementById('cart-discount-amount');
    var paymentPreference = localStorage.getItem('hd-pagamento') || 'Pix';

    var estado = ler();

    function ler() {
      var novo = { itens: {}, obs: '', cupom: '', endereco: '', tipoEntrega: deliveryType, pagamento: paymentPreference, t: Date.now() };
      try {
        var salvo = JSON.parse(localStorage.getItem(CHAVE) || 'null');
        if (!salvo || !(Date.now() - salvo.t < VALE)) return novo;
        Object.keys(salvo.itens).forEach(function (id) {
          var q = Math.min(MAX, Math.floor(Number(salvo.itens[id])));
          if (tem.call(loja.itens, id) && q > 0) novo.itens[id] = q;
        });
        novo.obs = String(salvo.obs || '').slice(0, 300);
        novo.cupom = String(salvo.cupom || '');
        novo.endereco = String(salvo.endereco || '');
        novo.tipoEntrega = salvo.tipoEntrega || deliveryType;
        novo.pagamento = salvo.pagamento || paymentPreference;
      } catch (e) {}
      return novo;
    }

    function guardar() {
      estado.t = Date.now();
      try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) {}
    }

    function ids() { return Object.keys(estado.itens); }
    function conta() { return ids().reduce(function (n, id) { return n + estado.itens[id]; }, 0); }
    function subtotal() { return ids().reduce(function (n, id) { return n + estado.itens[id] * loja.itens[id][1]; }, 0); }
    
    function desconto() {
      if (estado.cupom.toUpperCase() === CUPOM_VALIDO) {
        return Math.round(subtotal() * DESCONTO_CUPOM);
      }
      return 0;
    }
    
    function totalFinal() {
      return Math.max(0, subtotal() - desconto());
    }

    function plural(n) { return n + (n === 1 ? ' item' : ' itens'); }
    function reais(centavos) {
      return 'R$ ' + (centavos / 100).toFixed(2).replace('.', ',').replace(/B(?=(d{3})+(?!d))/g, '.');
    }

    // Link do WhatsApp estruturado
    function linkWhatsApp() {
      var fone = loja.fone || '5511987654321';
      var linhas = [
        '🍩 *NOVO PEDIDO · HELLO DONUTS & COFFEE*',
        '_Unidade Jardins · Fictícia_',
        '',
        '*Itens do pedido:*'
      ];
      ids().forEach(function (id) {
        var it = loja.itens[id];
        var q = estado.itens[id];
        linhas.push('• ' + q + 'x ' + it[0] + ' (' + reais(q * it[1]) + ')');
      });
      linhas.push('');
      linhas.push('*Subtotal:* ' + reais(subtotal()));
      if (desconto() > 0) {
        linhas.push('*Desconto Cupom ' + estado.cupom.toUpperCase() + ' (10%):* -' + reais(desconto()));
      }
      linhas.push('*Total a pagar:* ' + reais(totalFinal()));
      linhas.push('');
      linhas.push('*Forma de Recebimento:* ' + (estado.tipoEntrega === 'retirada' ? '🛍️ Retirar no Balcão (Alameda dos Sabores, 1820)' : '🛵 Entrega em Domicílio'));
      if (estado.tipoEntrega === 'delivery' && estado.endereco.trim()) {
        linhas.push('*Endereço de Entrega:* ' + estado.endereco.trim());
      }
      linhas.push('*Forma de Pagamento:* ' + estado.pagamento);
      if (estado.obs.trim()) {
        linhas.push('');
        linhas.push('*Observações:* ' + estado.obs.trim());
      }
      linhas.push('');
      linhas.push('_Pedido gerado via site oficial demonstrativo._');

      return 'https://wa.me/' + fone + '?text=' + encodeURIComponent(linhas.join('\n'));
    }

    function novaLinha(id) {
      var it = loja.itens[id];
      var li = molde.content.firstElementChild.cloneNode(true);
      li.setAttribute('data-id', id);
      li.querySelector('.cart__name').textContent = it[0];
      li.querySelector('.cart__unit').textContent = reais(it[1]) + ' cada';
      li.querySelector('[data-step="1"]').setAttribute('aria-label', 'Mais um: ' + it[0]);
      if (it[2]) {
        var foto = new Image();
        foto.alt = it[0];
        foto.width = foto.height = 58;
        foto.src = 'assets/img/menu/' + it[2] + '.webp';
        var quadro = li.querySelector('.cart__thumb');
        quadro.textContent = '';
        quadro.appendChild(foto);
      }
      var dica = li.querySelector('.cart__opt');
      if (it[3]) dica.textContent = it[3]; else dica.parentNode.removeChild(dica);
      lista.appendChild(li);
      return li;
    }

    function pintar() {
      var n = conta();
      var sub = subtotal();
      var desc = desconto();
      var tot = totalFinal();
      var totalTxt = reais(tot);

      root.classList.toggle('has-cart', n > 0);

      // Botões de adicionar na vitrine
      document.querySelectorAll('[data-add]').forEach(function (b) {
        var id = b.getAttribute('data-add');
        var q = estado.itens[id] || 0;
        var marca = b.querySelector('.add-n');
        if (marca) marca.textContent = q || '';
        if (b.classList.contains('add-btn') && tem.call(loja.itens, id)) {
          b.setAttribute('aria-label', 'Adicionar ' + loja.itens[id][0] + ' ao carrinho' + (q ? ' (' + q + ' no carrinho)' : ''));
        }
      });

      // Badges do Header e Cartbar
      if (selo) { selo.textContent = n; selo.hidden = !n; }
      if (bar) {
        bar.hidden = !n;
        bar.querySelector('.cartbar__n').textContent = n;
        bar.querySelector('.cartbar__total').textContent = totalTxt;
      }

      // Gaveta do Carrinho
      cart.querySelector('.cart__empty').hidden = n > 0;
      cart.querySelectorAll('[data-cart-full]').forEach(function (el) { el.hidden = !n; });
      cart.querySelector('.cart__count').textContent = n ? plural(n) : '';
      
      var totalEl = document.getElementById('cart-total');
      if (totalEl) totalEl.textContent = totalTxt;

      // Desconto no Carrinho
      if (discountRow && discountAmount) {
        if (desc > 0) {
          discountRow.hidden = false;
          discountAmount.textContent = '-' + reais(desc);
        } else {
          discountRow.hidden = true;
        }
      }

      // Barra de Frete Grátis Progressiva
      if (progressBar && progressFill && progressText) {
        var pct = Math.min(100, Math.round((sub / META_FRETE) * 100));
        progressFill.style.width = pct + '%';
        if (sub >= META_FRETE) {
          progressBar.classList.add('cart__progress--complete');
          progressText.innerHTML = '<span>🎉 Parabéns! Você ganhou <strong>FRETE GRÁTIS!</strong></span>';
        } else {
          progressBar.classList.remove('cart__progress--complete');
          var falta = META_FRETE - sub;
          progressText.innerHTML = '<span>Faltam <strong>' + reais(falta) + '</strong> para FRETE GRÁTIS</span><span>' + pct + '%</span>';
        }
      }

      // Botão WhatsApp com link dinâmico
      if (ir) ir.href = linkWhatsApp();

      // Renderiza itens
      ids().forEach(function (id) {
        var q = estado.itens[id];
        var li = lista.querySelector('[data-id="' + id + '"]') || novaLinha(id);
        var menos = li.querySelector('[data-step="-1"]');
        li.querySelector('.qty__n').textContent = q;
        li.querySelector('.cart__sub').textContent = reais(q * loja.itens[id][1]);
        menos.querySelector('use').setAttribute('href', q > 1 ? '#i-minus' : '#i-trash');
        menos.setAttribute('aria-label', (q > 1 ? 'Tirar um: ' : 'Remover ') + loja.itens[id][0]);
        li.querySelector('[data-step="1"]').disabled = q >= MAX;
      });

      Array.prototype.slice.call(lista.children).forEach(function (li) {
        if (tem.call(estado.itens, li.getAttribute('data-id'))) return;
        var comFoco = li.contains(document.activeElement);
        var vizinha = li.nextElementSibling || li.previousElementSibling;
        lista.removeChild(li);
        if (comFoco) (vizinha ? vizinha.querySelector('[data-step="-1"]') : fechar).focus();
      });
    }

    function mudar(id, passo, silencioso) {
      if (!tem.call(loja.itens, id)) return;
      var atual = estado.itens[id] || 0;
      var q = Math.max(0, Math.min(MAX, atual + passo));
      if (q) estado.itens[id] = q; else delete estado.itens[id];
      guardar();
      pintar();

      if (!silencioso && passo > 0) {
        showToast('Donut adicionado à sacola!', loja.itens[id][0] + ' (' + reais(loja.itens[id][1]) + ')');
      }
    }

    function pular(el, classe) {
      if (!el) return;
      el.classList.remove(classe);
      void el.offsetWidth;
      el.classList.add(classe);
    }

    function fechou() {
      cart.classList.remove('is-closing');
      root.classList.remove('cart-open');
    }
    function abrirCarrinho() {
      closeMenu();
      if (cart.hasAttribute('open')) return;
      if (cart.showModal) cart.showModal(); else cart.setAttribute('open', '');
      root.classList.add('cart-open');
    }
    function fecharCarrinho() {
      if (!cart.hasAttribute('open') || cart.classList.contains('is-closing')) return;
      cart.classList.add('is-closing');
      setTimeout(function () {
        if (cart.close) cart.close(); else { cart.removeAttribute('open'); fechou(); }
      }, semMovimento ? 0 : 200);
    }
    cart.addEventListener('close', fechou);

    // Configuração dos links de adicionar
    document.querySelectorAll('a[data-add]').forEach(function (a) {
      a.setAttribute('role', 'button');
      a.removeAttribute('target');
    });

    document.addEventListener('click', function (e) {
      var add = e.target.closest('[data-add]');
      if (add) {
        var id = add.getAttribute('data-add');
        if (!tem.call(loja.itens, id)) return;
        e.preventDefault();
        mudar(id, 1);
        pular(add, 'is-added');
        pular(bar, 'is-bump');
        if (live) live.textContent = loja.itens[id][0] + ' no carrinho. Agora são ' + plural(conta()) + ', ' + reais(totalFinal()) + '.';
        if (add.hasAttribute('data-add-open')) {
          abrirCarrinho();
          var itRow = lista.querySelector('[data-id="' + id + '"]');
          if (itRow) itRow.scrollIntoView({ block: 'nearest' });
        }
        return;
      }
      if (e.target.closest('[data-cart-open]')) {
        abrirCarrinho();
        return;
      }
      // Detalhes do produto (Quick View)
      var quickBtn = e.target.closest('[data-quick-view]');
      if (quickBtn) {
        var qId = quickBtn.getAttribute('data-quick-view');
        if (tem.call(loja.itens, qId)) {
          openQuickModal(qId, loja.itens[qId]);
        }
      }
    });

    // Seletor de entrega (Delivery vs Retirada)
    document.querySelectorAll('[data-delivery-type]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var type = btn.getAttribute('data-delivery-type');
        estado.tipoEntrega = type;
        document.querySelectorAll('[data-delivery-type]').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        var addressWrap = document.getElementById('delivery-address-wrap');
        var pickupWrap = document.getElementById('pickup-info-wrap');
        if (addressWrap) addressWrap.hidden = (type !== 'delivery');
        if (pickupWrap) pickupWrap.hidden = (type !== 'retirada');
        guardar();
        pintar();
      });
    });

    if (addressInput) {
      addressInput.value = estado.endereco || '';
      addressInput.addEventListener('input', function () {
        estado.endereco = addressInput.value.slice(0, 200);
        guardar();
        if (ir) ir.href = linkWhatsApp();
      });
    }

    // Seletor de Pagamento
    document.querySelectorAll('[data-payment]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pay = btn.getAttribute('data-payment');
        estado.pagamento = pay;
        document.querySelectorAll('[data-payment]').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        guardar();
        pintar();
      });
    });

    // Cupom de Desconto
    if (couponBtn && couponInput) {
      if (estado.cupom) couponInput.value = estado.cupom;
      couponBtn.addEventListener('click', function () {
        var code = couponInput.value.trim().toUpperCase();
        if (code === CUPOM_VALIDO) {
          estado.cupom = code;
          if (couponFeedback) {
            couponFeedback.textContent = 'Cupom ' + code + ' aplicado! (10% de desconto)';
            couponFeedback.className = 'coupon-feedback coupon-feedback--success';
          }
        } else if (!code) {
          estado.cupom = '';
          if (couponFeedback) couponFeedback.textContent = '';
        } else {
          estado.cupom = '';
          if (couponFeedback) {
            couponFeedback.textContent = 'Cupom inválido. Tente HELLO10';
            couponFeedback.className = 'coupon-feedback coupon-feedback--error';
          }
        }
        guardar();
        pintar();
      });
    }

    // Modal Quick View Add
    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', function () {
        if (!quickCurrentId) return;
        var q = parseInt(quickQty ? quickQty.textContent : '1', 10) || 1;
        mudar(quickCurrentId, q);
        if (quickModal && quickModal.close) quickModal.close();
      });
    }

    var qmPlus = document.getElementById('qm-plus');
    var qmMinus = document.getElementById('qm-minus');
    if (qmPlus && quickQty) {
      qmPlus.addEventListener('click', function () {
        var val = parseInt(quickQty.textContent, 10) || 1;
        if (val < 20) quickQty.textContent = String(val + 1);
      });
    }
    if (qmMinus && quickQty) {
      qmMinus.addEventListener('click', function () {
        var val = parseInt(quickQty.textContent, 10) || 1;
        if (val > 1) quickQty.textContent = String(val - 1);
      });
    }

    var qmClose = document.getElementById('qm-close');
    if (qmClose && quickModal) {
      qmClose.addEventListener('click', function () {
        if (quickModal.close) quickModal.close();
        else quickModal.removeAttribute('open');
      });
    }

    // Fechar carrinho
    var apertou = null;
    var certeza = 0;
    cart.addEventListener('pointerdown', function (e) { apertou = e.target; });
    cart.addEventListener('click', function (e) {
      if (e.target.closest('[data-cart-close]') || (e.target === cart && apertou === cart)) { fecharCarrinho(); return; }
      var passo = e.target.closest('[data-step]');
      if (passo) { mudar(passo.closest('[data-id]').getAttribute('data-id'), Number(passo.getAttribute('data-step'))); return; }
      if (e.target === limpar) {
        if (!certeza) {
          limpar.textContent = 'Toque de novo para esvaziar';
          certeza = setTimeout(function () { certeza = 0; limpar.textContent = 'Esvaziar carrinho'; }, 3500);
          return;
        }
        clearTimeout(certeza);
        certeza = 0;
        limpar.textContent = 'Esvaziar carrinho';
        estado.itens = {};
        estado.obs = obs ? (obs.value = '') : '';
        guardar();
        pintar();
        fechar.focus();
      }
    });

    if (obs) {
      obs.value = estado.obs;
      obs.addEventListener('input', function () {
        estado.obs = obs.value.slice(0, 300);
        guardar();
        if (ir) ir.href = linkWhatsApp();
      });
    }

    function reler() {
      estado = ler();
      if (obs) obs.value = estado.obs;
      lista.textContent = '';
      pintar();
    }
    window.addEventListener('storage', function (e) { if (e.key === CHAVE || e.key === null) reler(); });
    window.addEventListener('pageshow', function (e) { if (e.persisted) reler(); });

    pintar();
  })();

  // Busca e Filtros ao Vivo na página do Cardápio
  var menuSearchInput = document.getElementById('menu-search');
  var menuSearchClear = document.getElementById('menu-search-clear');
  var filterChips = document.querySelectorAll('.chip-btn');
  var menuCards = document.querySelectorAll('.menu-section .card');

  if (menuSearchInput && menuCards.length > 0) {
    function filterMenu() {
      var query = menuSearchInput.value.toLowerCase().trim();
      var activeChip = document.querySelector('.chip-btn.is-active');
      var filterCat = activeChip ? activeChip.getAttribute('data-filter') : 'all';

      menuCards.forEach(function (card) {
        var title = (card.querySelector('.card__name') || {}).textContent || '';
        var desc = (card.querySelector('.card__desc') || {}).textContent || '';
        var section = card.closest('.menu-section');
        var sectionId = section ? section.id : '';

        var matchesQuery = !query || title.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
        var matchesCat = filterCat === 'all' || sectionId === filterCat;

        var visible = matchesQuery && matchesCat;
        card.style.display = visible ? '' : 'none';
      });

      if (menuSearchClear) {
        menuSearchClear.hidden = !query;
      }
    }

    menuSearchInput.addEventListener('input', filterMenu);
    if (menuSearchClear) {
      menuSearchClear.addEventListener('click', function () {
        menuSearchInput.value = '';
        filterMenu();
        menuSearchInput.focus();
      });
    }

    filterChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        filterChips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        filterMenu();
      });
    });
  }

  try { sessionStorage.setItem('hd-intro', '1'); } catch (e) {}

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
