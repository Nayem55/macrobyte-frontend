const esc=value=>String(value||'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

(async()=>{
  const category=new URLSearchParams(location.search).get('name');
  const products=(await fetch('/api/products').then(response=>response.json())).filter(product=>product.category===category);
  document.title=`${category||'Products'} | MacroByte Trade`;
  const imageFor=product=>window.MacrobyteMedia.product(product)[0];
  document.querySelector('#app').innerHTML=`
    <p class="eyebrow">Product category</p>
    <h1 style="font-size:clamp(35px,6vw,60px);margin:8px 0 12px">${esc(category||'Products')}</h1>
    <p class="description" style="max-width:650px;margin-bottom:36px">Explore practical products for your business or project. Open an item for specifications, a product gallery and a direct enquiry option.</p>
    <div class="catalog-grid">${products.map(product=>`<article class="catalog-card">
      <img src="${imageFor(product)}" alt="${esc(product.name)}" loading="lazy">
      <div><span class="eyebrow">${esc(product.subCategory||product.category)}</span><h3>${esc(product.name)}</h3>
      <p>${esc(product.description)}</p><a href="/product?id=${product.id}">View product</a></div>
    </article>`).join('')||'<p>No products have been added to this category yet.</p>'}</div>`;
})().catch(()=>document.querySelector('#app').innerHTML='<h1>Unable to load this category.</h1>');
