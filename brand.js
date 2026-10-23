/* Apply the supplied MacroByte Trade logo consistently after each page is parsed. */
document.querySelectorAll('a.brand').forEach(brand=>{
  brand.setAttribute('aria-label','MacroByte Trade home');
  brand.innerHTML='<img src="/assets/macrobyte-logo.png" alt="MacroByte Trade">';
});

document.querySelectorAll('.footer .brand').forEach(brand=>{
  brand.innerHTML='<img src="/assets/macrobyte-logo.png" alt="MacroByte Trade">';
});
