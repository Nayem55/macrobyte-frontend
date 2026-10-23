(()=>{
  const key='macrobyte-cart';const read=()=>{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return[]}};const write=items=>{localStorage.setItem(key,JSON.stringify(items));document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=items.reduce((total,item)=>total+item.quantity,0));};
  window.MacrobyteCart={items:read(),add(product){if(!product)return;const items=read(),existing=items.find(item=>item.productId===product.id);if(existing)existing.quantity+=1;else items.push({productId:product.id,name:product.name,price:product.price,quantity:1});this.items=items;write(items);}};write(read());
})();
