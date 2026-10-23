const esc=value=>String(value||'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

(async()=>{
  const isService=location.pathname.includes('service');
  const id=new URLSearchParams(location.search).get('id');
  const items=await fetch(isService?'/api/services':'/api/products').then(response=>response.json());
  const item=items.find(entry=>entry.id===id);
  const app=document.querySelector('#app');
  if(!item){app.innerHTML='<h1>Item not found</h1>';return;}
  const name=item.name||item.title;
  const photos=isService?window.MacrobyteMedia.service(item):window.MacrobyteMedia.product(item);
  const message=encodeURIComponent(`Hello MacroByte Trade, I would like to get a quote for ${name}.`);
  const media=`<div class="product-gallery"><img id="galleryMain" class="gallery-main" src="${photos[0]}" alt="${esc(name)}"><div class="gallery-thumbs">${photos.map((source,index)=>`<button class="gallery-thumb ${index===0?'active':''}" type="button" data-image="${source}" aria-label="View image ${index+1}"><img src="${source}" alt="${esc(name)} view ${index+1}"></button>`).join('')}</div></div>`;
  const included=item.groups?.length?`<section class="section"><h2>Services included</h2><div class="service-groups">${item.groups.map(group=>`<article class="service-group"><h3>${esc(group.title)}</h3><ul>${group.items.map(entry=>`<li>${esc(entry)}</li>`).join('')}</ul></article>`).join('')}</div></section>`:`<section class="section"><h2>${isService?'What is included':'Key features'}</h2><ul class="features">${(item.features||item.tags||[]).map(feature=>`<li>${esc(feature)}</li>`).join('')}</ul></section>`;
  document.title=`${name} | MacroByte Trade`;
  let meta=document.querySelector('meta[name="description"]');if(!meta){meta=document.createElement('meta');meta.name='description';document.head.append(meta)}meta.content=item.description||item.details||name;
  app.innerHTML=`<div class="layout"><div class="visual"><span class="label">${esc(item.category||'MacroByte service')}</span>${media}</div><div class="info"><div class="eyebrow">${isService?'Tailored service quotation':'Product enquiry'}</div><p class="brandname">${esc(item.brand||item.subCategory||'MacroByte Trade')}</p><h1>${esc(name)}</h1><p class="description">${esc(item.details||item.description)}</p>${isService?'<p class="quote-note">No fixed price — your quotation is prepared around your exact requirements.</p>':`<div class="price">${esc(item.price||'Request a quote')}</div>`}<div class="actions">${isService?'':`<button class="button primary" id="addToCart">Add to cart</button>`}<a class="button primary" href="https://wa.me/8801989480551?text=${message}" target="_blank" rel="noopener">${isService?'Get a quote on WhatsApp':'Enquire on WhatsApp'}</a><a class="button secondary" href="/contact.html">Send requirements</a></div></div></div>${included}<section class="section"><h2>${isService?'How we quote':'Specifications at a glance'}</h2><table class="specs">${(item.specs||[]).map(spec=>`<tr><td>${esc(spec[0])}</td><td>${esc(spec[1])}</td></tr>`).join('')}</table></section>`;
  app.querySelectorAll('.gallery-thumb').forEach(button=>button.addEventListener('click',()=>{app.querySelector('#galleryMain').src=button.dataset.image;app.querySelectorAll('.gallery-thumb').forEach(thumb=>thumb.classList.toggle('active',thumb===button));}));
  app.querySelector('#addToCart')?.addEventListener('click',event=>{window.MacrobyteCart?.add(item);event.currentTarget.textContent='Added to cart';setTimeout(()=>event.currentTarget.textContent='Add to cart',1000)});
})().catch(()=>document.querySelector('#app').innerHTML='<h1>Unable to load this page</h1>');
