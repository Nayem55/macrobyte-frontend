(() => {
  const activePage = new URLSearchParams(location.search).get("page");
  if (!['products', 'subcategories'].includes(activePage)) return;
  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const api = async (path, options = {}) => {
    const response = await fetch(`/api${path}`, {...options, headers:{'Content-Type':'application/json', Authorization:`Bearer ${localStorage.getItem('mb_token') || ''}`, ...(options.headers || {})}});
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw Error(data.message || 'Request failed');
    return data;
  };
  const uploadImages = async (files) => {
    const uploaded = [];
    for (const file of [...files]) {
      const form = new FormData();
      form.append('file', file);
      form.append('uploadType', 'product');
      const response = await fetch('/api/upload', {method:'POST',headers:{Authorization:`Bearer ${localStorage.getItem('mb_token') || ''}`},body:form});
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw Error(data.message || `Could not upload ${file.name}`);
      if (data.url) uploaded.push(data.url);
    }
    return uploaded;
  };
  const content = () => document.querySelector('.content');
  const active = (item) => `<span class="admin-pill ${item.active === false ? 'off' : ''}">${item.active === false ? 'Hidden' : 'Live'}</span>`;
  const optionsFor = (subcategories, category, selected = '') => subcategories.filter((item) => !category || item.parentCategory === category).map((item) => `<option value="${esc(item.name)}" ${item.name === selected ? 'selected' : ''}>${esc(item.name)}</option>`).join('');
  const attachNav = () => {
    const categories = [...document.querySelectorAll('.sidebar a')].find((link) => link.href.includes('page=categories'));
    if (categories && !document.querySelector('.sidebar a[href*="page=subcategories"]')) { const link=document.createElement('a');link.href='?page=subcategories';link.textContent='Subcategories';link.dataset.subcategoryNav='true';if(activePage==='subcategories')link.className='active';categories.insertAdjacentElement('afterend',link); }
  };
  const editor = (title, html, submit) => {
    const holder=document.querySelector('#editor');
    holder.innerHTML=`<div class="editor-modal" role="dialog" aria-modal="true" aria-labelledby="editor-title"><div class="editor-modal-backdrop" data-close-editor></div><form class="card admin-editor editor-modal-card" id="taxonomy-editor"><div class="editor-head"><h2 id="editor-title">${title}</h2><button class="secondary" type="button" id="close-editor">Close</button></div><div class="grid">${html}</div><button class="primary">Save</button></form></div>`;
    document.body.classList.add('modal-open');
    const close=()=>{holder.innerHTML='';document.body.classList.remove('modal-open');document.removeEventListener('keydown',onKeydown)},onKeydown=(event)=>{if(event.key==='Escape')close()};
    document.querySelector('#close-editor').onclick=close;
    document.querySelector('[data-close-editor]').onclick=close;
    document.addEventListener('keydown',onKeydown);
    document.querySelector('#taxonomy-editor').onsubmit=submit;
  };
  async function renderProducts() {
    const [products,categories,subcategories,brands]=await Promise.all([api('/admin/products'),api('/admin/categories'),api('/admin/subcategories'),api('/admin/brands')]);
    const brandNames=[...new Set([...brands.map((item)=>item.name),...products.map((item)=>item.brand).filter(Boolean)])].sort((a,b)=>a.localeCompare(b));
    content().innerHTML=`<div class="top"><div><p class="eyebrow">Catalogue</p><h1>Products</h1><p class="muted">Assign every product to a parent category and useful subcategory.</p></div><button class="primary" id="add-product">Add product</button></div><div id="editor"></div><section class="admin-filters" aria-label="Product filters"><input id="product-search" type="search" placeholder="Search name, brand or model" aria-label="Search products"><select id="category-filter" aria-label="Filter by category"><option value="">All categories</option>${categories.map((c)=>`<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('')}</select><select id="subcategory-filter" aria-label="Filter by subcategory"><option value="">All subcategories</option>${optionsFor(subcategories,'')}</select></section><p class="muted" id="product-filter-count"></p><section class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Product</th><th>Category</th><th>Subcategory</th><th>Brand</th><th>Stock</th><th></th></tr></thead><tbody>${products.map((p)=>`<tr data-product-row data-category="${esc(p.category||'')}" data-subcategory="${esc(p.subCategory||'')}" data-search="${esc([p.name,p.model,p.brand,p.category,p.subCategory].filter(Boolean).join(' ').toLowerCase())}"><td><strong>${esc(p.name)}</strong><small>${esc(p.model||'')}</small></td><td>${esc(p.category||'—')}</td><td>${esc(p.subCategory||'—')}</td><td>${esc(p.brand||'—')}</td><td>${esc(p.stockQty??'—')}</td><td class="row-actions"><button data-edit="${p.id}">Edit</button><button class="danger" data-delete="${p.id}">Delete</button></td></tr>`).join('')}</tbody></table></section>`;
    const open=(item={})=>editor(`${item.id?'Edit':'Add'} product`, `<div class="full"><label>SEO product name<input name="name" required value="${esc(item.name||'')}"></label></div><div><label>Brand<input name="brand" list="brand-options" value="${esc(item.brand||'')}"><datalist id="brand-options">${brandNames.map((name)=>`<option value="${esc(name)}"></option>`).join('')}</datalist></label></div><div><label>Model<input name="model" value="${esc(item.model||'')}"></label></div><div><label>Category<select name="category" id="product-category" required><option value="">Select a category</option>${categories.map((c)=>`<option value="${esc(c.name)}" ${c.name===item.category?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label></div><div><label>Subcategory<select name="subCategory" id="product-subcategory"><option value="">Select a subcategory</option>${optionsFor(subcategories,item.category,item.subCategory)}</select></label></div><div><label>MRP / price<input name="price" value="${esc(item.price||'')}"></label></div><div><label>Stock quantity<input name="stockQty" type="number" min="0" value="${esc(item.stockQty??0)}"></label></div><div><label>Display order<input name="order" type="number" value="${esc(item.order||0)}"></label></div><div><label>Visible<select name="active"><option value="true" ${item.active!==false?'selected':''}>Yes</option><option value="false" ${item.active===false?'selected':''}>No</option></select></label></div><div class="full"><label>Short description<textarea name="description">${esc(item.description||'')}</textarea></label></div><div class="full"><label>Product details<textarea name="details">${esc(item.details||'')}</textarea></label></div><div class="full"><label>Features (one per line)<textarea name="features">${esc((item.features||[]).join('\n'))}</textarea></label></div><div class="full"><label>Gallery image URLs (one per line)<textarea name="images">${esc((item.images||[]).join('\n'))}</textarea></label></div><div class="full"><label>Or upload new gallery images<input name="imageFiles" type="file" accept="image/*" multiple></label></div>`, async (event)=>{event.preventDefault();try{const scrollY=window.scrollY,form=event.currentTarget;const f=Object.fromEntries(new FormData(form));const uploaded=await uploadImages(form.elements.imageFiles.files);const images=[...f.images.split('\n').map((x)=>x.trim()).filter(Boolean),...uploaded];const body={...item,...f,images,stockQty:Number(f.stockQty||0),order:Number(f.order||0),active:f.active==='true',features:f.features.split('\n').map((x)=>x.trim()).filter(Boolean)};delete body.id;delete body.imageFiles;await api(`/admin/products${item.id?`/${item.id}`:''}`,{method:item.id?'PUT':'POST',body:JSON.stringify(body)});document.body.classList.remove('modal-open');await renderProducts();window.scrollTo({top:scrollY,behavior:'auto'})}catch(error){alert(error.message)}});
    const search=document.querySelector('#product-search'),categoryFilter=document.querySelector('#category-filter'),subcategoryFilter=document.querySelector('#subcategory-filter'),count=document.querySelector('#product-filter-count'),query=new URLSearchParams(location.search);
    search.value=query.get('q')||'';categoryFilter.value=query.get('category')||'';subcategoryFilter.innerHTML=`<option value="">All subcategories</option>${optionsFor(subcategories,categoryFilter.value,query.get('subcategory')||'')}`;
    const filterProducts=()=>{const term=search.value.trim().toLowerCase(),category=categoryFilter.value,subcategory=subcategoryFilter.value;let shown=0;document.querySelectorAll('[data-product-row]').forEach((row)=>{const visible=(!term||row.dataset.search.includes(term))&&(!category||row.dataset.category===category)&&(!subcategory||row.dataset.subcategory===subcategory);row.hidden=!visible;if(visible)shown+=1});count.textContent=`Showing ${shown} of ${products.length} products`;const url=new URL(location.href);url.searchParams.set('page','products');term?url.searchParams.set('q',term):url.searchParams.delete('q');category?url.searchParams.set('category',category):url.searchParams.delete('category');subcategory?url.searchParams.set('subcategory',subcategory):url.searchParams.delete('subcategory');history.replaceState(null,'',url)};
    search.oninput=filterProducts;categoryFilter.onchange=()=>{subcategoryFilter.innerHTML=`<option value="">All subcategories</option>${optionsFor(subcategories,categoryFilter.value)}`;filterProducts()};subcategoryFilter.onchange=filterProducts;filterProducts();
    document.querySelector('#add-product').onclick=()=>open();document.querySelectorAll('[data-edit]').forEach((button)=>button.onclick=()=>open(products.find((item)=>item.id===button.dataset.edit)));document.querySelectorAll('[data-delete]').forEach((button)=>button.onclick=async()=>{if(confirm('Delete this product?')){await api(`/admin/products/${button.dataset.delete}`,{method:'DELETE'});renderProducts()}});document.querySelector('#product-category')?.addEventListener('change',(event)=>{document.querySelector('#product-subcategory').innerHTML=`<option value="">Select a subcategory</option>${optionsFor(subcategories,event.target.value)}`});
  }
  async function renderSubcategories() {
    const [subcategories,categories]=await Promise.all([api('/admin/subcategories'),api('/admin/categories')]);
    content().innerHTML=`<div class="top"><div><p class="eyebrow">Catalogue structure</p><h1>Subcategories</h1><p class="muted">Create and manage child categories such as Keyboards, Mice, Headsets and Earbuds.</p></div><button class="primary" id="add-subcategory">Add subcategory</button></div><div id="editor"></div><section class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Parent category</th><th>Subcategory</th><th>Slug</th><th>Status</th><th></th></tr></thead><tbody>${subcategories.map((item)=>`<tr><td>${esc(item.parentCategory)}</td><td><strong>${esc(item.name)}</strong><small>${esc(item.description||'')}</small></td><td>${esc(item.slug)}</td><td>${active(item)}</td><td class="row-actions"><button data-edit="${item.id}">Edit</button><button class="danger" data-delete="${item.id}">Delete</button></td></tr>`).join('')||'<tr><td colspan="5">No subcategories found.</td></tr>'}</tbody></table></section>`;
    const open=(item={})=>editor(`${item.id?'Edit':'Add'} subcategory`, `<div><label>Parent category<select name="parentCategory" required><option value="">Select a category</option>${categories.map((c)=>`<option value="${esc(c.name)}" ${c.name===item.parentCategory?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label></div><div><label>Subcategory name<input name="name" required value="${esc(item.name||'')}" placeholder="e.g. Keyboards"></label></div><div><label>Slug<input name="slug" value="${esc(item.slug||'')}"></label></div><div><label>Display order<input name="order" type="number" value="${esc(item.order||0)}"></label></div><div><label>Visible<select name="active"><option value="true" ${item.active!==false?'selected':''}>Yes</option><option value="false" ${item.active===false?'selected':''}>No</option></select></label></div><div class="full"><label>Description<textarea name="description">${esc(item.description||'')}</textarea></label></div>`, async (event)=>{event.preventDefault();try{const scrollY=window.scrollY,f=Object.fromEntries(new FormData(event.currentTarget));await api(`/admin/subcategories${item.id?`/${item.id}`:''}`,{method:item.id?'PUT':'POST',body:JSON.stringify({...f,order:Number(f.order||0),active:f.active==='true'})});document.body.classList.remove('modal-open');await renderSubcategories();window.scrollTo({top:scrollY,behavior:'auto'})}catch(error){alert(error.message)}});
    document.querySelector('#add-subcategory').onclick=()=>open();document.querySelectorAll('[data-edit]').forEach((button)=>button.onclick=()=>open(subcategories.find((item)=>item.id===button.dataset.edit)));document.querySelectorAll('[data-delete]').forEach((button)=>button.onclick=async()=>{if(confirm('Delete this subcategory?'))try{await api(`/admin/subcategories/${button.dataset.delete}`,{method:'DELETE'});renderSubcategories()}catch(error){alert(error.message)}});
  }
  const showError = (error) => {
    const workspace = content();
    if (/sign in|token|jwt|authori[sz]/i.test(error.message)) {
      localStorage.removeItem('mb_token');
      if (workspace) location.reload();
      return;
    }
    if (workspace) workspace.innerHTML=`<p class="notice">${esc(error.message)}</p>`;
  };
  setTimeout(()=>{
    if (!localStorage.getItem('mb_token') || !content()) return;
    attachNav();
    if(activePage==='products')renderProducts().catch(showError);
    if(activePage==='subcategories')renderSubcategories().catch(showError);
  },150);
})();
