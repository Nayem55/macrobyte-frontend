/* Deliberately mapped images: each item receives a relevant, distinct online image. */
window.MacrobyteMedia={
products:{
'acer-aspire-lite-15':['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1400&q=85'],
'dell-vostro-office-desktop':['https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1400&q=85'],
'logitech-mk295-combo':['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1400&q=85'],
'hikvision-2mp-cctv-kit':['https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=85'],
'dahua-wifi-camera':['https://down-my.img.susercontent.com/file/my-11134207-7r992-lrgti0rzo5x369','https://down-ph.img.susercontent.com/file/ph-11134207-820la-mnwo4t6jpvr654'],
'zkteco-attendance-device':['https://cctv9.my/cdn/shop/products/wme1000x1000_cfa029ad-5ebe-4c57-a6a6-ecdb8cd1b733_1200x1200.png?v=1677032300','https://d1agmp9y4cki1i.cloudfront.net/images/20250701/K40%20Pro_01_500x500.png'],
'double-a-a4-paper':['https://down-my.img.susercontent.com/file/d11bc0ddd07dd9c9b7abab996782950c','https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1400&q=85'],
'hp-107a-toner':['https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1400&q=85'],
'office-stationery-set':['https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1400&q=85'],
'corrugated-carton-box':['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1400&q=85'],
'packing-tape-roll':['https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1400&q=85'],
'bubble-wrap-roll':['https://images.unsplash.com/photo-1586528116493-da8eb0fce8e1?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1400&q=85'],
'led-panel-light':['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=1400&q=85'],
'pvc-conduit-pipe':['https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=85'],
'safety-gloves':['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=85']
},
services:{
'Online & Digital Services':['https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1400&q=85'],
'IT Maintenance & Repair':['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85'],
'Office Setup & Installation':['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85'],
'Creative & Business Support':['https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=1400&q=85']
},
product(item){
  if(this.products[item.slug])return this.products[item.slug];
  const related={
    'Computer Accessories':['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1400&q=85'],
    'Networking & Connectivity':['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1600267165477-6d4cc741b379?auto=format&fit=crop&w=1400&q=85'],
    'CCTV & Smart Security':['https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=85'],
    'Audio & Wearables':['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1400&q=85'],
    'Power & Charging':['https://images.unsplash.com/photo-1558091879-7f36736b0e3a?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1609592424824-5027c3f7a8dd?auto=format&fit=crop&w=1400&q=85'],
    'Mobile Content Creation':['https://images.unsplash.com/photo-1598550476439-6847785fcea4?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1400&q=85'],
    'Personal & Lifestyle Electronics':['https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1400&q=85']
  };
  return related[item.category]||['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=85'];
},
service(item){return this.services[item.title]||['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85'];}
};
