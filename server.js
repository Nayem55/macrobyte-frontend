const express = require('express');
const path = require('path');
const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const stockCatalogue = require('./stock-catalogue');

const root = __dirname;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/macro-byte';
const JWT_SECRET = process.env.JWT_SECRET || 'macrobyte-local-development-secret';
const publicPort = Number(process.env.PORT || 1016);
const adminPort = Number(process.env.ADMIN_PORT || 1017);
let client, db;

const defaults = {
  brand: 'MacroByte Trade',
  tagline: 'Technology. Services. Supply.',
  hero: { eyebrow: 'One partner. Many solutions.', title: 'Technology that works for your world.', description: 'From essential online applications to IT maintenance, smart installations, creative design and dependable business supplies — MacroByte Trade helps people and businesses get things done.' },
  contact: { address: 'House 29, Road 2, Block B, Banasree, Rampura, Dhaka, Bangladesh', phone: '+880 0000 000 000', email: 'hello@macrobytetrade.com' },
  about: { heading: 'Local service. Practical solutions.', description: 'MacroByte Trade is your trusted local partner for everyday digital help, technology support, creative work and business supply needs.' }
};
const defaultServices = [
  { title:'Online & Digital Services', icon:'▤', description:'Guidance and assistance with common online applications and digital tasks.', tags:['Applications','Documents','Online help'], order:1, active:true },
  { title:'IT Maintenance & Repair', icon:'⚙', description:'Practical support to keep computers, printers and essential equipment working.', tags:['PC repair','Printers','Maintenance'], order:2, active:true },
  { title:'Office Setup & Installation', icon:'⌘', description:'A tailored office setup service for the PCs, laptops, CCTV, networking, printers and practical equipment your team needs.', tags:['Office setup','CCTV','Networking'], order:3, active:true },
  { title:'Creative & Business Support', icon:'✦', description:'Design and business support services that help ideas look professional.', tags:['Design','Printing','Branding'], order:4, active:true }
];
const defaultProducts = [
  { name:'Office Technology', category:'Technology', icon:'▣', description:'Computers, accessories and essential tech for work.', order:1, active:true },
  { name:'Business Supplies', category:'Supplies', icon:'▤', description:'Reliable everyday supplies for your operation.', order:2, active:true },
  { name:'Networking Essentials', category:'Technology', icon:'⌁', description:'Connectivity products for home and office.', order:3, active:true },
  { name:'Print & Stationery', category:'Supplies', icon:'✎', description:'Practical print and stationery solutions.', order:4, active:true }
];
const catalogSeed = [
  {slug:'acer-aspire-lite-15',name:'Acer Aspire Lite 15 Laptop',brand:'Acer',category:'Computer & IT',subCategory:'Laptop',price:'From ৳58,500',icon:'laptop',description:'Everyday 15.6-inch laptop for office work, study and business productivity.',details:'A practical workhorse with a modern processor, a bright Full HD display and fast solid-state storage. Ideal for documents, browsing, online meetings and business software.',features:['15.6-inch Full HD display','Intel Core i5 processor','8GB RAM and 512GB NVMe SSD','Wi-Fi 6 and USB-C connectivity'],specs:[['Display','15.6-inch Full HD'],['Processor','Intel Core i5'],['Memory','8GB DDR4'],['Storage','512GB NVMe SSD']],order:10,active:true},
  {slug:'dell-vostro-office-desktop',name:'Dell Vostro Office Desktop',brand:'Dell',category:'Computer & IT',subCategory:'Desktop PC',price:'From ৳69,000',icon:'desktop',description:'Dependable desktop configuration for office counters and business teams.',details:'Designed for reliable day-to-day productivity, with the performance and ports required by accounting, sales and administrative workstations.',features:['Intel Core i5 platform','8GB RAM / 512GB SSD','Multiple USB ports','Business-ready compact chassis'],specs:[['Processor','Intel Core i5'],['Memory','8GB'],['Storage','512GB SSD'],['Use case','Office productivity']],order:11,active:true},
  {slug:'logitech-mk295-combo',name:'Logitech MK295 Wireless Combo',brand:'Logitech',category:'Computer & IT',subCategory:'Accessories',price:'From ৳3,900',icon:'keyboard',description:'Quiet wireless keyboard and mouse combination for tidy desks.',details:'A reliable desk companion with a compact wireless receiver and comfortable everyday typing experience.',features:['Wireless keyboard and mouse','Quiet typing','Long battery life','Plug-and-play receiver'],specs:[['Connection','2.4GHz wireless'],['Compatibility','Windows / macOS'],['Included','Keyboard, mouse, receiver']],order:12,active:true},
  {slug:'hikvision-2mp-cctv-kit',name:'Hikvision 2MP CCTV Camera Kit',brand:'Hikvision',category:'CCTV & Security',subCategory:'CCTV',price:'Request a quote',icon:'camera',description:'Complete indoor/outdoor monitoring setup for shops, offices and homes.',details:'A scalable security package with camera, recorder and storage options. MacroByte can assess the location and arrange installation.',features:['2MP full-HD recording','Night vision monitoring','Remote mobile viewing','Installation available'],specs:[['Resolution','2MP Full HD'],['Viewing','Mobile app capable'],['Night vision','IR enabled'],['Recommended for','Shop / office / home']],order:20,active:true},
  {slug:'dahua-wifi-camera',name:'Dahua Wi-Fi Smart Camera',brand:'Dahua',category:'CCTV & Security',subCategory:'Wi-Fi Camera',price:'From ৳3,200',icon:'camera',description:'Compact app-connected indoor security camera with clear live view.',details:'A convenient single-camera option for home rooms, reception desks and smaller spaces where Wi-Fi connectivity is available.',features:['App-based live monitoring','Two-way audio','Motion alerts','MicroSD recording support'],specs:[['Connection','Wi-Fi'],['Resolution','Full HD'],['Audio','Two-way'],['Storage','MicroSD supported']],order:21,active:true},
  {slug:'zkteco-attendance-device',name:'ZKTeco Attendance Device',brand:'ZKTeco',category:'CCTV & Security',subCategory:'Access Control',price:'Request a quote',icon:'security',description:'Attendance and access control terminal for workplace time tracking.',details:'A professional attendance solution for teams that need simple, structured time records and controlled entry.',features:['Fingerprint or card options','Attendance reporting','TCP/IP connectivity','Installation support'],specs:[['Use','Attendance / access'],['Connectivity','TCP/IP'],['Setup','On-site available']],order:22,active:true},
  {slug:'double-a-a4-paper',name:'Double A A4 Copy Paper',brand:'Double A',category:'Paper & Office',subCategory:'Paper',price:'From ৳680 / ream',icon:'paper',description:'Reliable multipurpose paper for everyday office printing and copying.',details:'Clean, consistent A4 paper suited to common laser and inkjet printers, photocopiers and routine documentation.',features:['A4 size','80 GSM','Smooth printing surface','Suitable for copier and printer'],specs:[['Size','A4'],['Weight','80 GSM'],['Pack','500 sheets'],['Use','Print / copy']],order:30,active:true},
  {slug:'hp-107a-toner',name:'HP 107A Compatible Toner',brand:'HP Compatible',category:'Paper & Office',subCategory:'Printer Supplies',price:'From ৳1,650',icon:'toner',description:'Cost-conscious toner option for compatible mono laser printers.',details:'A dependable replacement cartridge for routine documents. Confirm your printer model with us before ordering.',features:['Sharp black output','Easy replacement','Suitable for document printing','Model confirmation support'],specs:[['Colour','Black'],['Type','Laser toner'],['Use','Mono printing']],order:31,active:true},
  {slug:'office-stationery-set',name:'Office Stationery Essentials Set',brand:'MacroByte Supply',category:'Paper & Office',subCategory:'Stationery',price:'Request a quote',icon:'stationery',description:'Customised everyday stationery bundle for desks and teams.',details:'Tell us your team size and recurring requirements for a tailored stationery supply quotation.',features:['Pens and markers','Files and folders','Sticky notes','Custom supply bundles'],specs:[['Supply type','Office stationery'],['Ordering','Bulk available']],order:32,active:true},
  {slug:'corrugated-carton-box',name:'Corrugated Carton Box',brand:'MacroByte Supply',category:'Packaging',subCategory:'Boxes',price:'Request a quote',icon:'box',description:'Durable shipping cartons in practical sizes for products and deliveries.',details:'Available in multiple dimensions and board strengths. Ask for a quote based on your product size and order quantity.',features:['Multiple dimensions','Bulk orders','Protective corrugated board','Custom sizes possible'],specs:[['Material','Corrugated board'],['Use','Shipping / storage'],['Order type','Bulk / custom']],order:40,active:true},
  {slug:'packing-tape-roll',name:'Heavy Duty Packing Tape',brand:'MacroByte Supply',category:'Packaging',subCategory:'Tape',price:'From ৳95 / roll',icon:'tape',description:'Strong adhesive tape for dispatch, carton sealing and storage.',details:'A practical sealing tape for day-to-day packaging work and commercial dispatch operations.',features:['Strong adhesive','Clear or brown options','Carton sealing','Bulk packs available'],specs:[['Type','BOPP packing tape'],['Use','Carton sealing']],order:41,active:true},
  {slug:'bubble-wrap-roll',name:'Protective Bubble Wrap Roll',brand:'MacroByte Supply',category:'Packaging',subCategory:'Protection',price:'Request a quote',icon:'wrap',description:'Cushioning material for fragile products and secure parcel packing.',details:'Lightweight protective wrapping for glassware, electronics and delicate products during storage or delivery.',features:['Lightweight protection','Flexible roll format','Fragile-item friendly','Bulk lengths available'],specs:[['Material','Bubble film'],['Use','Protective packaging']],order:42,active:true},
  {slug:'led-panel-light',name:'LED Panel Light',brand:'MacroByte Supply',category:'Building Materials',subCategory:'Electrical',price:'From ৳1,350',icon:'light',description:'Energy-efficient panel light for offices, shops and interior projects.',details:'A clean, bright lighting option for professional interiors. Ask about wattage and installation requirements.',features:['Low energy use','Clean ceiling finish','Office and retail suitable','Installation coordination'],specs:[['Type','LED panel'],['Use','Indoor lighting']],order:50,active:true},
  {slug:'pvc-conduit-pipe',name:'PVC Conduit Pipe & Fittings',brand:'MacroByte Supply',category:'Building Materials',subCategory:'Electrical',price:'Request a quote',icon:'pipe',description:'Electrical conduit materials for organised and protected cable routing.',details:'A useful project supply for residential, shop and office electrical installation work.',features:['Pipe and fitting options','Cable protection','Project quantity quotes','Contractor supply support'],specs:[['Material','PVC'],['Use','Cable routing']],order:51,active:true},
  {slug:'safety-gloves',name:'Work Safety Gloves',brand:'MacroByte Supply',category:'Building Materials',subCategory:'Safety',price:'From ৳180 / pair',icon:'gloves',description:'Practical hand-protection supplies for maintenance and project work.',details:'General-purpose safety gloves for handling materials and basic worksite tasks.',features:['Grip surface','Multiple sizes','General work use','Bulk orders'],specs:[['Type','Work safety glove'],['Use','Material handling']],order:52,active:true}
];
const serviceDetails = [
  {title:'Online & Digital Services',details:'Friendly, practical help for online applications, document preparation, registration forms and everyday digital tasks. Tell us what you are trying to complete and we will guide the right next step.',features:['Online application assistance','Document scanning and preparation','Form and registration guidance','Status and follow-up support'],specs:[['Best for','Individuals and small businesses'],['How it starts','Share your requirement'],['Delivery','Depends on service type']]},
  {title:'IT Maintenance & Repair',details:'Practical diagnosis and maintenance support for computers, printers and essential equipment. We focus on clear recommendations before work begins.',features:['Computer diagnostics','Printer setup and troubleshooting','Hardware maintenance','Software and performance checks'],specs:[['Best for','Home, shop and office equipment'],['Service format','Drop-off or arranged support'],['Next step','Describe the issue and device model']]},
  {title:'Office Setup & Installation',icon:'⌘',description:'A tailored office setup service for the PCs, laptops, CCTV, networking, printers and practical equipment your team needs.',tags:['Office setup','CCTV','Networking'],order:3,active:true,details:'We plan and deliver a practical office setup around your team, space and work needs. This can include desktop PCs, laptops, printers, CCTV cameras, Wi-Fi and networking, access control, cabling, power accessories and the everyday items needed to get an office operating. Every office is different, so we assess your requirements first and provide a tailored quotation rather than a fixed price.',features:['Desktop PC and laptop sourcing','CCTV, access control and attendance setup','Wi-Fi, router and network configuration','Printer, scanner and shared-device setup','Structured cabling and workstation organisation','Office supplies and essential accessories'],specs:[['Best for','New offices, expansions and relocations'],['How it starts','Tell us your team size, space and requirements'],['Quotation','Custom quote after requirement assessment'],['Pricing','No fixed price — based on your scope and equipment']]},
  {title:'Creative & Business Support',details:'Professional, practical creative support for businesses that need clear print-ready materials, simple visuals and dependable execution.',features:['Graphic design support','Print-ready artwork','Business documents','Branding and promotional materials'],specs:[['Best for','Start-ups, shops and local businesses'],['Workflow','Brief, draft, revise, finalise'],['Output','Digital or print-ready files']]}
];
const serviceCatalogue = [
  {title:'Digital Documentation Services',icon:'▤',description:'Application assistance for essential identity, travel, education and business documentation.',tags:['NID & passport','Tax & trade licence','Education support'],order:1,active:true,details:'Guided support for online applications, records, registrations and document preparation. Official approval remains with the relevant authority.',groups:[
    {title:'Identity & Civil Registration',items:['NID application assistance','NID information correction and update guidance','Lost or damaged NID reissue assistance','Birth registration application assistance','Birth registration information correction','Birth registration verification and record assistance','Voter information and registration assistance']},
    {title:'Passport & Police Clearance',items:['E-passport application and renewal assistance','Passport information correction guidance','Police clearance certificate application assistance','Online appointment and application tracking support','Supporting-document checklist and preparation guidance']},
    {title:'Business & Government Compliance',items:['E-TIN registration assistance','Online income tax return filing assistance','Trade licence application and renewal assistance','Business registration documentation support','VAT and tax portal assistance, where applicable','Government recruitment and public-service applications']},
    {title:'Education & Professional Applications',items:['University and college admission applications','Examination registration assistance','Education board certificate correction applications','Scholarship applications','Job applications and professional CV preparation']}
  ],specs:[['How it starts','Share your application or document requirement'],['Pricing','Quoted based on the service and documents required'],['Important','Application support does not guarantee official approval']]},
  {title:'IT Infrastructure & Maintenance',icon:'⌘',description:'Technology installation, diagnostics and ongoing support for homes, shops and offices.',tags:['Workstations','Networking','CCTV & maintenance'],order:2,active:true,details:'From a single workstation to a connected office, we assess your existing setup and provide practical installation, repair and maintenance support.',groups:[
    {title:'Computer Systems & Workstations',items:['Custom PC assembly and configuration','Business workstation deployment','Hardware upgrades and component replacement','Operating system deployment and configuration','Business software installation and setup','Data migration and backup configuration','PC diagnostics, performance optimization and preventive maintenance']},
    {title:'Networking & IT Infrastructure',items:['Office LAN and Wi-Fi deployment','Router, switch and access point configuration','Structured network cabling','Shared printer and network resource setup','Small-office server and network storage setup','Network troubleshooting and optimization','IT infrastructure planning for small businesses']},
    {title:'CCTV & Security Systems',items:['IP and analog CCTV installation','DVR/NVR deployment and configuration','Remote monitoring setup','Camera coverage planning','Surveillance storage configuration','Existing security system upgrades','CCTV maintenance and fault diagnosis']},
    {title:'Office Equipment Maintenance',items:['Printer and photocopier troubleshooting','Office machine installation and commissioning','Hardware diagnostics and component replacement','Printer and copier consumables support','Preventive maintenance','Equipment relocation and reinstallation','POS peripherals and barcode scanner setup']}
  ],specs:[['Best for','Homes, shops and offices'],['Assessment','Requirement and site assessment first'],['Pricing','Custom quotation based on equipment and scope']]},
  {title:'Creative & Digital Solutions',icon:'✦',description:'Professional branding and digital experiences to help businesses build a stronger presence.',tags:['Brand design','Web development','Digital marketing'],order:3,active:true,details:'Practical creative and digital work for businesses that need a clear visual identity, a reliable web presence and improved online visibility.',groups:[
    {title:'Brand Identity & Graphic Design',items:['Logo design and brand identity systems','Corporate stationery and business card design','Marketing campaign creatives','Social media content design','Promotional banners, posters and brochures','Product packaging and label design','Corporate profiles and company presentations']},
    {title:'Website Design & Development',items:['Corporate and business websites','E-commerce and product catalogue websites','Portfolio websites and landing pages','Responsive UI/UX design','Website redesign and modernization','Domain, hosting and business email setup assistance','Website maintenance and technical support']},
    {title:'Digital Presence & Marketing',items:['Search engine optimization (SEO)','Social media brand development','Digital advertising creatives','Product catalogue management','E-commerce product listing support','Website content optimization','Digital marketing campaign support']}
  ],specs:[['Workflow','Brief, scope, draft, review and delivery'],['Pricing','Custom quotation based on requirements'],['Output','Digital files, print-ready artwork or deployed website']]},
  {title:'Business Technology & Automation',icon:'⚙',description:'Practical technology solutions that help businesses improve daily operations.',tags:['POS systems','Office planning','Consultation'],order:4,active:true,details:'Technology planning and implementation for retailers, offices and growing businesses that want better day-to-day operations.',groups:[
    {title:'Retail & Business Systems',items:['POS system deployment and configuration','Barcode scanner and inventory equipment integration','Retail technology setup','Office equipment and workstation planning','E-commerce technology setup','Business website and digital catalogue integration','Ongoing IT maintenance arrangements']},
    {title:'Business Consultation',items:['Small-business IT consultation','Technology and equipment requirement assessment','Office IT setup planning','Workflow digitization consultation','Equipment upgrade and replacement planning','Custom technical solution coordination']}
  ],specs:[['Best for','Retailers, offices and small businesses'],['Planning','Requirement assessment first'],['Pricing','Tailored to the selected technology and implementation scope']]},
  {title:'Products & Trading',icon:'▣',description:'Equipment and supplies for businesses, offices, technology projects and everyday operations.',tags:['IT equipment','Office supplies','Packaging & materials'],order:5,active:true,details:'Source technology equipment, workplace supplies, packaging and project materials through a single business partner.',groups:[
    {title:'Computer Hardware & IT Equipment',items:['Desktop computers and workstation components','Processors, motherboards, RAM and storage','Monitors and computer peripherals','Networking equipment and accessories','Cables, adapters and connectivity products','UPS and power protection equipment']},
    {title:'Security & Surveillance Equipment',items:['CCTV and IP cameras','DVR/NVR systems','Surveillance storage','Network switches and accessories','Cables, connectors and installation materials','Complete camera system packages']},
    {title:'Office, Paper & Printing Supplies',items:['A4 and commercial printing paper','Tissue and hygiene products','Printer ink and toner','Photocopier consumables','Stationery and office essentials','Bulk workplace consumables']},
    {title:'Packaging & Industrial Consumables',items:['Carton boxes and corrugated packaging','Shipping and storage boxes','Packaging paper and protective materials','Packing tape and wrapping products','Bulk packaging materials for businesses']},
    {title:'Construction & Interior Materials',items:['Plywood sheets','MDF and related board products','Laminated boards','Furniture and interior project materials','Other construction materials sourced on request']},
    {title:'Commercial & Office Equipment',items:['Printers, scanners and photocopiers','POS terminals and peripherals','Barcode scanners','Office IT accessories','Business equipment and related consumables']}
  ],specs:[['Availability','Subject to stock and supplier availability'],['Ordering','Single, bulk and project requirements'],['Pricing','Product quotation provided on request']]},
  {title:'Corporate & Bulk Supply',icon:'▦',description:'Product sourcing and supply coordination for offices, retailers and institutions.',tags:['Procurement','Bulk quotations','Custom sourcing'],order:6,active:true,details:'Coordinate recurring and project-based procurement with product sourcing, bulk quotations and order support tailored to your organization.',groups:[
    {title:'Procurement & Supply',items:['Corporate procurement and product sourcing','Bulk supply quotations for offices, shops and institutions','IT equipment supply for workstation and networking projects','CCTV equipment and installation-material supply','Recurring supply of paper, tissue and office consumables','Packaging and carton supply for business operations','Custom sourcing based on product specifications','Product quotation and order coordination']}
  ],specs:[['Best for','Offices, retailers and institutions'],['Quotation','Based on quantity, specification and availability'],['Ordering','One-time projects or recurring supply arrangements']]}
];
async function getDb() {
  if (db) return db;
  client = new MongoClient(MONGODB_URI); await client.connect(); db = client.db();
  await Promise.all([db.collection('admins').createIndex({username:1},{unique:true}), db.collection('services').createIndex({order:1}), db.collection('products').createIndex({order:1})]);
  if (!await db.collection('settings').findOne({key:'site'})) await db.collection('settings').insertOne({key:'site', value:defaults});
  if (!await db.collection('services').countDocuments()) await db.collection('services').insertMany(defaultServices);
  if (!await db.collection('products').countDocuments()) await db.collection('products').insertMany(defaultProducts);
  if (!await db.collection('settings').findOne({key:'catalog-seed-v2'})) { for (const product of catalogSeed) await db.collection('products').updateOne({slug:product.slug},{$setOnInsert:product},{upsert:true}); await db.collection('settings').insertOne({key:'catalog-seed-v2',createdAt:new Date()}); }
  if (!await db.collection('settings').findOne({key:'service-detail-seed-v1'})) { for (const service of serviceDetails) await db.collection('services').updateOne({title:service.title},{$set:service}); await db.collection('settings').insertOne({key:'service-detail-seed-v1',createdAt:new Date()}); }
  if (!await db.collection('settings').findOne({key:'service-detail-seed-v2'})) { const office=serviceDetails.find(s=>s.title==='Office Setup & Installation'); await db.collection('services').updateOne({title:'Installation & Setup'},{$set:office}); await db.collection('settings').insertOne({key:'service-detail-seed-v2',createdAt:new Date()}); }
  if (!await db.collection('settings').findOne({key:'service-catalogue-v3'})) { await db.collection('services').deleteMany({}); await db.collection('services').insertMany(serviceCatalogue); await db.collection('settings').insertOne({key:'service-catalogue-v3',createdAt:new Date()}); }
  if (!await db.collection('settings').findOne({key:'stock-catalogue-v1'})) {
    await db.collection('products').deleteMany({});
    await db.collection('products').insertMany(stockCatalogue);
    await db.collection('settings').insertOne({key:'stock-catalogue-v1',createdAt:new Date(),source:'MACRO BYTE STOCK (1).xlsx',records:stockCatalogue.length});
  }
  if (!await db.collection('admins').findOne({username:'admin'})) await db.collection('admins').insertOne({username:'admin', password:await bcrypt.hash('macrobyte2026', 12), createdAt:new Date()});
  return db;
}
function auth(req,res,next) { try { req.user=jwt.verify((req.headers.authorization||'').replace('Bearer ',''),JWT_SECRET); next(); } catch { res.status(401).json({message:'Please sign in to continue.'}); } }
function clean(doc) { if(!doc) return doc; const {_id,...rest}=doc; return {id:_id.toString(),...rest}; }
function objectId(id) { if(!ObjectId.isValid(id)) throw Error('Invalid record id'); return new ObjectId(id); }

const api = express(); api.use(express.json({limit:'2mb'}));
api.get('/api/health', async (_q,res)=>{ try { await getDb(); res.json({ok:true,database:'connected'}); } catch(e) { res.status(503).json({ok:false,message:e.message}); } });
api.get('/api/site', async (_q,res)=> { const d=await getDb(); const s=await d.collection('settings').findOne({key:'site'}); res.json(s.value); });
api.get('/api/services', async (_q,res)=> { const d=await getDb(); res.json((await d.collection('services').find({active:true}).sort({order:1}).toArray()).map(clean)); });
api.get('/api/products', async (_q,res)=> { const d=await getDb(); res.json((await d.collection('products').find({active:true}).sort({order:1}).toArray()).map(clean)); });
api.post('/api/enquiries', async (req,res)=> { const d=await getDb(); const {name,phone,email,type,subject,message}=req.body; if(!name||!message) return res.status(400).json({message:'Name and details are required.'}); await d.collection('enquiries').insertOne({name,phone,email,type,subject,message,status:'new',createdAt:new Date()}); res.status(201).json({ok:true}); });
api.post('/api/auth/login', async (req,res)=> { const d=await getDb(); const user=await d.collection('admins').findOne({username:req.body.username}); if(!user || !await bcrypt.compare(req.body.password||'',user.password)) return res.status(401).json({message:'Invalid username or password.'}); res.json({token:jwt.sign({id:user._id.toString(),username:user.username},JWT_SECRET,{expiresIn:'12h'}),username:user.username}); });
api.get('/api/admin/dashboard',auth,async(_q,res)=> { const d=await getDb(); res.json({services:await d.collection('services').countDocuments(),products:await d.collection('products').countDocuments(),enquiries:await d.collection('enquiries').countDocuments(),newEnquiries:await d.collection('enquiries').countDocuments({status:'new'})}); });
api.get('/api/admin/site',auth,async(_q,res)=> { const d=await getDb(); res.json((await d.collection('settings').findOne({key:'site'})).value); });
api.put('/api/admin/site',auth,async(req,res)=> { const d=await getDb(); await d.collection('settings').updateOne({key:'site'},{$set:{value:req.body,updatedAt:new Date()}},{upsert:true}); res.json(req.body); });
for (const name of ['services','products']) {
  api.get('/api/admin/'+name,auth,async(_q,res)=>{ const d=await getDb();res.json((await d.collection(name).find().sort({order:1}).toArray()).map(clean)); });
  api.post('/api/admin/'+name,auth,async(req,res)=>{ const d=await getDb();const item={...req.body,active:req.body.active!==false,order:Number(req.body.order||0),createdAt:new Date()};const r=await d.collection(name).insertOne(item);res.status(201).json(clean({...item,_id:r.insertedId})); });
  api.put('/api/admin/'+name+'/:id',auth,async(req,res)=>{ const d=await getDb();const update={...req.body,order:Number(req.body.order||0),updatedAt:new Date()};delete update.id;await d.collection(name).updateOne({_id:objectId(req.params.id)},{$set:update});res.json({ok:true}); });
  api.delete('/api/admin/'+name+'/:id',auth,async(req,res)=>{ const d=await getDb();await d.collection(name).deleteOne({_id:objectId(req.params.id)});res.json({ok:true}); });
}
api.get('/api/admin/enquiries',auth,async(_q,res)=>{ const d=await getDb();res.json((await d.collection('enquiries').find().sort({createdAt:-1}).toArray()).map(clean)); });
api.patch('/api/admin/enquiries/:id',auth,async(req,res)=>{ const d=await getDb();await d.collection('enquiries').updateOne({_id:objectId(req.params.id)},{$set:{status:req.body.status}});res.json({ok:true}); });
api.use((err,_q,res,_next)=>res.status(500).json({message:err.message||'Server error'}));

const publicApp = express();
const publicCss='<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/light.css"><link rel="stylesheet" href="/header-theme.css"><link rel="stylesheet" href="/contrast.css"><link rel="stylesheet" href="/gallery.css"><link rel="stylesheet" href="/site-polish.css"><script src="/media.js"></script>';
const brandImage='<img src="/assets/macrobyte-logo.png" alt="MacroByte Trade">';
const applyBrand=html=>html
  .replace(/(<img\b[^>]*\bsrc=")data:image\/[^"]+("(?=[^>]*\balt="MacroByte[^"]*"[^>]*>))/g,'$1/assets/macrobyte-logo.png$2')
  .replace(/<span class="brandtext">[\s\S]*?<\/span>/g,'')
  .replace(/href="\/?#home"/g,'href="/"')
  .replace(/href="\/?#services"/g,'href="/services.html"')
  .replace(/href="\/?#products"/g,'href="/products.html"')
  .replace(/href="\/?#about"/g,'href="/about.html"')
  .replace(/href="\/?#contact"/g,'href="/contact.html"')
  .replace(/<a class="brand"[^>]*>[\s\S]*?<\/a>/g,`<a class="brand" href="/" aria-label="MacroByte Trade home">${brandImage}</a>`);
const sendPublicPage = page => (_q,res) => {
  const html=applyBrand(fs.readFileSync(path.join(root,page+'.html'),'utf8')).replace('</head>',publicCss+'</head>');
  res.type('html').send(html);
};
publicApp.use(api);
publicApp.get('/',(_q,res)=>{
  const html=applyBrand(fs.readFileSync(path.join(root,'macrobyte-trade-website.html'),'utf8'))
    .replace('</head>',publicCss+'</head>')
    .replace('</body>','<script src="/dynamic.js"></script></body>');
  res.type('html').send(html);
});
publicApp.get('/product.html',sendPublicPage('product'));
publicApp.get('/service.html',sendPublicPage('service'));
publicApp.get('/category.html',sendPublicPage('category'));
publicApp.get('/services.html',sendPublicPage('services'));
publicApp.get('/products.html',sendPublicPage('products'));
publicApp.get('/about.html',sendPublicPage('about'));
publicApp.get('/contact.html',sendPublicPage('contact'));
publicApp.use(express.static(root));
const adminApp = express(); adminApp.use(api); adminApp.use(express.static(path.join(root,'admin'))); adminApp.use((_q,res)=>res.sendFile(path.join(root,'admin','index.html')));
Promise.all([getDb().catch(e=>console.error('MongoDB unavailable at startup:',e.message)), new Promise(r=>publicApp.listen(publicPort,'0.0.0.0',r)), new Promise(r=>adminApp.listen(adminPort,'0.0.0.0',r))]).then(()=>console.log(`Macrobyte public: http://localhost:${publicPort} | admin: http://localhost:${adminPort}`));
