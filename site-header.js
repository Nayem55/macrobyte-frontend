(async()=>{
  const esc=value=>String(value||'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const oldHeader=document.querySelector('header');if(!oldHeader)return;
  document.querySelector('.topline')?.remove();
  let categories=[];try{categories=await fetch('/api/categories').then(response=>response.ok?response.json():[])}catch{}
  const categoryLinks=categories.map(category=>`<a href="/shop.html?category=${encodeURIComponent(category.slug)}">${esc(category.name)}</a>`).join('')||'<span class="mb-empty">Categories coming soon</span>';
  oldHeader.outerHTML=`<header class="mb-header"><div class="mb-header-inner"><a class="mb-brand" href="/" aria-label="MacroByte Trade home"><img src="/assets/macrobyte-logo.png" alt="MacroByte Trade"></a><button class="mb-menu" type="button" aria-label="Open navigation" aria-expanded="false">☰</button><nav class="mb-nav" aria-label="Main navigation"><a href="/">Home</a><a href="/services.html">Services</a><a href="/shop.html">Shop</a><div class="mb-category"><button type="button" aria-expanded="false">Categories <span>⌄</span></button><div class="mb-dropdown">${categoryLinks}</div></div><a href="/about.html">About</a><a href="/contact.html">Contact</a></nav><div class="mb-actions"><a class="mb-cart" href="/cart.html" aria-label="Shopping cart">Cart <span data-cart-count>0</span></a><a class="mb-quote" href="/contact.html">Get a quote</a></div></div></header>`;
  const header=document.querySelector('.mb-header'),menu=header.querySelector('.mb-menu'),nav=header.querySelector('.mb-nav'),category=header.querySelector('.mb-category');
  menu.addEventListener('click',()=>{const open=header.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
  category.querySelector('button').addEventListener('click',()=>{const open=category.classList.toggle('open');category.querySelector('button').setAttribute('aria-expanded',open)});
})();
