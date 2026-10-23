/*
 * Catalogue seed derived from MACRO BYTE STOCK (1).xlsx.
 * Purchase cost is deliberately excluded from the public catalogue.
 */
const rows = `
1|USB HUB|LOGIC|USB 2.0 HUB|250|3
2|USB HUB|LOCAL|4-PORT HUB-1.2M|300|3
3|USB HUB (GAMING)|HYPER-X|LOCAL|500|2
4|USB HUB + CARD READER|LOCAL|LOCAL|600|1
5|KEYBOARD|A4TECH|KRS-83|799|3
6|KEYBOARD|RAPOO|NK-2600|780|1
7|KEYBOARD|LOGITECH|K120 CORDED|849|1
8|KEYBOARD|A4TECH|KRS-82BD|999|3
9|KEYBOARD|FASTKEY|LK-04|400|6
10|KEYBOARD|JEDEL|K29|499|6
11|KEYBOARD|MICROPACK|K-205|650|3
12|KEYBOARD (MINI)|JEDEL|K1000|599|1
13|KEYBOARD (USB-MINI)|APTECH|P-274|550|1
14|KEYBOARD (WIRELESS MINI)|LOCAL|GKM901|1100|1
15|KEYBOARD & MOUSE COMBO (WIRELESS-DUEL MODE)|JEDEL|WS739|1500|1
16|KEYBOARD & MOUSE COMBO (WIRELESS-BT)|LOCAL|MOUSE & KEYBOARD KIT|1350|1
17|GAMING BACK LIGHTING KEYBOARD|GIGASONIC|GK100|1500|1
18|GAMING BACK LIGHTING KEYBOARD|GIGASONIC|RGB-699GS|1500|1
19|GAMING BACK LIGHTING KEYBOARD|AMC TECH|K23|1200|1
20|BACKLIT KEYBOARD|HIGH-POWER|D701|1000|1
21|LED BACKLIT KEYBOARD|SUNTECH|ST-800|1300|2
22|MECHANICAL KEYBOARD (BLUE SWITCH)|GIGASONIC|M300K|2200|1
23|MECHANICAL KEYBOARD|APTECH|A700M|2350|1
24|MOUSE PAD|H3|H3 (S)|100|6
25|MOUSE PAD|LOCAL|LOCAL (XL)|300|2
26|MOUSE PAD|RASURE|G-2 (M)|180|3
27|MOUSE|A4TECH|OP-550S|499|3
28|MOUSE|LOGITECH|M90|449|3
29|MOUSE|LOGITECH|B100|449|3
30|MOUSE|MICROPACK|M-101|450|3
31|MOUSE|R8|1655|400|3
32|MOUSE|A4TECH|OP-620D|350|6
33|MOUSE|HP|M10|450|6
34|MOUSE (MINI)|APTECH|FX95|350|2
35|MOUSE (WIRELESS-DUEL MODE RGB)|HP|W10|400|2
36|MOUSE (WIRELESS-DUEL MODE)|K-2000|K-2000|650|3
37|MOUSE (WIRELESS)|APTECH|W69|550|3
38|MOUSE (WIRELESS)|MICROPACK|MP-716W|650|3
39|MOUSE (WIRELESS)|APTECH|W70|650|3
40|MOUSE (WIRELESS)|SUNTECH|WM-066/WM-069|600|3
41|MOUSE (WIRELESS)|A4TECH|LOCAL|600|3
42|MOUSE (WIRELESS-DUEL MODE)|R8|1760|600|2
43|WIFI ADAPTER (150 MBPS)|LB-LINK|BL-WN151|500|2
44|WIFI ADAPTER (300 MBPS)|LB-LINK|BL-WN351|490|2
45|BT ADAPTER|APTECH|BT60|550|2
46|BT ADAPTER|LOCAL|BT-5.3|250|2
47|WIFI ADAPTER|NONAP|300M-802.11N|500|2
48|WIFI + BT ADAPTER|NONAP|W107 (300M + BT4.0)|600|1
49|WIFI + BT ADAPTER|APTECH|AP-WA107N|550|2
50|WIFI ADAPTER|APTECH|AP-WA105N|500|2
51|WIFI ADAPTER|TENDA|W311MI (AX300 WIFI6)|600|2
52|WIRED HEADSET WITH MICROPHONE|T-WOLF|H150|1000|1
53|WIRED HEADSET WITH MICROPHONE|ASTANA|HS 220|1150|1
54|WIRED HEADSET WITH MICROPHONE (RGB)|IMICE|HD-410|1600|1
55|WIRED HEADSET WITH MICROPHONE (RGB)|IMICE|HD-480|1650|1
56|WIRED HEADSET WITH MICROPHONE (RGB)|T-WOLF|H120|1050|1
57|SCREEN CLEANING KIT|LOCAL|LOCAL|250|6
58|USB FLASH DRIVE|HP|8 GB|650|2
59|USB FLASH DRIVE|HP|16 GB|750|2
60|USB FLASH DRIVE|HP|32 GB|1180|2
61|USB FLASH DRIVE|HP|64 GB|1350|2
62|DUAL-BAND WIFI ROUTER|TP-LINK|ARCHER C24|2500|2
63|DUAL-BAND WIFI ROUTER|TP-LINK|ARCHER C54|2800|1
64|DUAL-BAND WIFI ROUTER|TP-LINK|ARCHER C50|2850|1
65|WIFI ROUTER|TENDA|F6|1950|1
66|WIFI ROUTER|TENDA|F3|1700|1
67|WIFI ROUTER|TENDA|N301|1800|1
68|WIFI CAMERA|TAPO|TAPO C210|2800|4
69|WIFI CAMERA|TAPO|TAPO C212|2950|2
70|WIFI CAMERA|LOCAL|V380 PRO|1850|2
71|WIFI CAMERA|TENDA|CP3 PRO|2550|1
72|WIFI CAMERA|TENDA|CP7|3300|1
73|VGA CABLE 1.5M (WHITE)|LOCAL|LOCAL|250|2
74|VGA CABLE 1.8M (BLACK)|LOCAL|LOCAL|280|2
75|HDMI CABLE 1.5M (REDCAPE)|HIGH SPEED|HIGH SPEED HDTV|350|2
76|HDMI CABLE 3M (BLACKCAP)|HIGH SPEED|HIGH SPEED HDTV|450|2
77|HDMI CABLE 1.5M (BLACK)|HIGH SPEED|HIGH SPEED HDTV|300|2
78|USB TO USB CABLE|LOCAL|LOCAL|250|2
79|USB EXTENSION|LOCAL|LOCAL|250|2
80|PRINTER CABLE 1.5M|LOCAL|LOCAL|300|2
81|3 PIN POWER CABLE|LOCAL|LOCAL|300|4
82|2 PIN POWER CABLE|LOCAL|LOCAL|280|2
83|CAMERA MEMORY|UNIT|128 GB|2200|6
84|MULTIPLUG (20FT)|MAXLINE|ML2010|380|2
85|MULTIPLUG (10FT)|MAXLINE|ML017|180|2
86|MULTIPLUG (8FT)|MAXLINE|ML2013|250|2
87|MULTIPLUG (7FT)|MAXLINE|ML209|200|2
88|MULTIPLUG (6FT)|MAXLINE|ML016|150|2
89|MULTIPLUG (3M)|MAXLINE|ML073|380|6
90|MULTIPLUG (3M)|MAXLINE|ML704|1050|1
91|MULTIPLUG (5M)|MAXLINE|ML348|1000|1
92|MULTIPLUG (5M)|MAXLINE|ML024|1250|1
93|MULTIPLUG (3M)|MAXLINE|ML024|1050|1
94|MULTIPLUG (3M)|MAXLINE|ML255|1050|1
95|MULTIPLUG|GPBLACK|GP-727|550|3
96|MULTIPLUG|CLICK|CLICK33|1000|1
97|BT SPEAKER (5W)|LOCAL|DV-1132|550|2
98|BT SPEAKER|HOCO|HC3|1600|3
99|BT SPEAKER|LOCAL|X-811|900|2
100|BT SPEAKER|HOCO|HC2|1700|2
101|BT SPEAKER|LOCAL|X-535|800|3
102|CAR SPEAKER (WIRELESS)|LOCAL|X-702|1800|1
103|NECKBAND EARPHONE|ORAIMO|NECKLACE NEO (OEB-310)|1350|2
104|NECKBAND EARPHONE|HOCO|ES65|950|2
105|NECKBAND EARPHONE|AWEI|G83BL|1150|1
106|NECKBAND EARPHONE|SURPASS|WIRELESS 4 PROPLUS|1650|2
107|EARBUDS|HOCO|EQ24|1050|2
108|EARBUDS|LOCAL|GI00X|850|2
109|EARBUDS|AWEI|T88 ANC|1500|1
110|EARBUDS|AWEI|T99 ANC|1250|1
111|POWERBANK (10000 MAH)|ORAIMO|OPB-1100D|1550|1
112|POWERBANK (20000 MAH)|ORAIMO POWERNOVA Q21|OPB-7200Q|2350|1
113|POWERBANK (10000 MAH)|AWEI|PA-90|1350|1
114|WIFI ROUTER (DUAL-BAND)|TP-LINK|ARCHER C64|3450|1
115|WIFI ROUTER|TENDA|F6|1850|2
116|TRIMMER|VGR|V-937|1650|2
117|LED RECHARGEABLE DESK FAN|JR|JR-2018|1500|2
118|MINI ELECTRIC FAN (10W)|LOCAL|BKF01|1100|2
119|DIGITAL DISPLAY HANDHELD FAN|FUNDSNAP|Z1012|950|2
120|HANDHELD FAN|LOCAL|H137-11|550|1
121|HANDHELD FAN|LOCAL|H137-22|480|1
122|GIMBAL STABILIZER|Q08|Q08|2400|1
123|TRIPOD WITH RING LIGHT|PLOKAMA|LIVE-K9 PRO|1550|1
124|SELFIE STICK|PLOKAMA|LIVE-K9|1050|1
125|SELFIE STICK|PLOKAMA|LIVE-K9 LED|1000|1
126|BLUETOOTH INTEGRATED SELFIE STICK|Q07|Q07|500|1
127|360 DEGREE MOBILE STAND|KLX|L-359|450|2
128|360 DEGREE MOBILE STAND|LOCAL|ZY033|150|2
129|MOBILE STAND|LOCAL|J-020|150|2
130|COLLAR CLIP BUTTON MICROPHONE|K31PRO|K31PRO|1950|1
131|WIRELESS MICROPHONE|LOCAL|F11-2|1100|1
132|WIRELESS MICROPHONE|ULANZI|WM-10|1750|1`;

const clean = value => value.replace(/\s+/g, ' ').trim();
const titleCase = value => clean(value).toLowerCase().replace(/\b\w/g, char => char.toUpperCase()).replace('Wifi', 'Wi-Fi').replace('Bt ', 'Bluetooth ');
const slugify = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const brandNames = {
  'A4TECH':'A4Tech','AMC TECH':'AMC Tech','APTECH':'Aptech','ASTANA':'Astana','AWEI':'Awei','CLICK':'Click','FASTKEY':'FastKey','FUNDSNAP':'FundSnap','GIGASONIC':'GigaSonic','GPBLACK':'GP Black','HIGH-POWER':'High Power','HOCO':'Hoco','HP':'HP','HYPER-X':'HyperX','IMICE':'iMICE','JEDEL':'Jedel','K31PRO':'K31 Pro','LB-LINK':'LB-Link','LOGIC':'Logic','LOGITECH':'Logitech','MAXLINE':'Maxline','MICROPACK':'Micropack','NONAP':'Nonap','ORAIMO':'Oraimo','ORAIMO POWERNOVA Q21':'Oraimo','PLOKAMA':'Plokama','Q07':'Q07','Q08':'Q08','R8':'R8','RASURE':'Rasure','SUNTECH':'Suntech','SURPASS':'Surpass','T-WOLF':'T-Wolf','TAPO':'Tapo','TENDA':'Tenda','TP-LINK':'TP-Link','ULANZI':'Ulanzi','VGR':'VGR'
};
const publicBrand = value => ['LOCAL', 'UNIT', 'HIGH SPEED'].includes(value) ? 'Compatible' : (brandNames[value] || titleCase(value));

function categoryFor(item) {
  if (/camera|camera memory/i.test(item)) return 'CCTV & Smart Security';
  if (/router|wifi|bt adapter|bluetooth adapter/i.test(item)) return 'Networking & Connectivity';
  if (/headset|speaker|earphone|earbuds/i.test(item)) return 'Audio & Wearables';
  if (/powerbank|multiplug|power cable/i.test(item)) return 'Power & Charging';
  if (/gimbal|tripod|selfie|mobile stand|microphone/i.test(item)) return 'Mobile Content Creation';
  if (/trimmer|fan/i.test(item)) return 'Personal & Lifestyle Electronics';
  return 'Computer Accessories';
}

function subCategoryFor(item) {
  if (/keyboard/i.test(item)) return 'Keyboard & Mouse';
  if (/mouse/i.test(item)) return 'Keyboard & Mouse';
  if (/hub|flash drive|cleaning|cable/i.test(item)) return 'Computer Accessories';
  if (/camera/i.test(item)) return 'Wi-Fi Camera';
  if (/router/i.test(item)) return 'Wi-Fi Router';
  if (/wifi|adapter/i.test(item)) return 'Network Adapter';
  if (/headset|speaker|earphone|earbuds/i.test(item)) return 'Audio';
  if (/powerbank|multiplug|power cable/i.test(item)) return 'Power Accessory';
  if (/gimbal|tripod|selfie|mobile stand|microphone/i.test(item)) return 'Creator Gear';
  return 'Electronics';
}

function featureFor(item, model) {
  if (/mechanical/i.test(item)) return 'Mechanical Keys for Responsive Gaming';
  if (/keyboard.*mouse/i.test(item)) return 'Wireless Keyboard and Mouse Combo';
  if (/keyboard/i.test(item)) return /backlit|back lighting|rgb|led/i.test(item) ? 'Backlit Keys for Work and Play' : 'Everyday Typing for Workstations';
  if (/mouse pad/i.test(item)) return 'Desk Surface for Smooth Mouse Control';
  if (/mouse/i.test(item)) return /wireless/i.test(item) ? 'Wireless Control for Everyday Computing' : 'Reliable Pointing for Office Use';
  if (/hub.*card/i.test(item)) return 'USB Expansion with Card Reader';
  if (/hub/i.test(item)) return 'Extra USB Connectivity for Your Desk';
  if (/wifi.*camera/i.test(item)) return 'App-Connected Monitoring for Home or Office';
  if (/router/i.test(item)) return /dual/i.test(item) ? 'Dual-Band Wi-Fi for Connected Homes and Offices' : 'Wi-Fi Coverage for Everyday Connectivity';
  if (/wifi.*bt/i.test(item)) return 'Wi-Fi and Bluetooth Connectivity Upgrade';
  if (/wifi/i.test(item)) return 'Wireless Connectivity Upgrade for PCs';
  if (/bt adapter/i.test(item)) return 'Bluetooth Connectivity for Compatible Devices';
  if (/headset/i.test(item)) return /rgb/i.test(item) ? 'RGB Headset with Built-In Microphone' : 'Wired Audio with Built-In Microphone';
  if (/speaker/i.test(item)) return 'Wireless Audio for Everyday Listening';
  if (/earphone|earbuds/i.test(item)) return 'Wireless Listening for Calls and Music';
  if (/flash drive/i.test(item)) return `Portable ${model} Storage for Everyday Files`;
  if (/cable/i.test(item)) return 'Reliable Connection for Compatible Devices';
  if (/multiplug/i.test(item)) return 'Multiple Power Outlets for Desk and Home Use';
  if (/powerbank/i.test(item)) return 'Portable Backup Power for Mobile Devices';
  if (/gimbal/i.test(item)) return 'Stabilised Mobile Video for Creators';
  if (/tripod/i.test(item)) return 'Ring Light and Tripod for Live Content';
  if (/selfie/i.test(item)) return 'Extendable Mobile Support for Photos and Video';
  if (/mobile stand/i.test(item)) return 'Hands-Free Phone Positioning for Desk Use';
  if (/microphone/i.test(item)) return /wireless/i.test(item) ? 'Wireless Audio Capture for Content and Calls' : 'Clip-On Audio Capture for Mobile Recording';
  if (/trimmer/i.test(item)) return 'Personal Grooming for Everyday Use';
  if (/fan/i.test(item)) return /rechargeable/i.test(item) ? 'Rechargeable Cooling for Your Desk' : 'Compact Personal Cooling for Everyday Use';
  if (/cleaning/i.test(item)) return 'Screen Care for Computers and Mobile Devices';
  return 'Practical Everyday Electronics';
}

function itemName(item) {
  return titleCase(item)
    .replace('Duel', 'Dual')
    .replace('Bt', 'Bluetooth')
    .replace('MaH', 'mAh')
    .replace('Rgb', 'RGB')
    .replace('Usb', 'USB')
    .replace('Vga', 'VGA')
    .replace('Hdmi', 'HDMI')
    .replace('Led', 'LED');
}

const bySku = new Map();
for (const line of rows.trim().split('\n')) {
  const [sourceNo, rawItem, rawBrand, rawModel, rawMrp, rawQty] = line.split('|');
  const item = clean(rawItem), brand = clean(rawBrand), model = clean(rawModel);
  const key = `${item}|${brand}|${model}`;
  const entry = bySku.get(key) || { sourceNos: [], item, brand, model, mrp: Number(rawMrp), stockQty: 0 };
  entry.sourceNos.push(Number(sourceNo));
  entry.stockQty += Number(rawQty);
  entry.mrp = Math.min(entry.mrp, Number(rawMrp));
  bySku.set(key, entry);
}

module.exports = [...bySku.values()].map((entry, index) => {
  const category = categoryFor(entry.item);
  const hasModel = !['LOCAL', entry.brand].includes(entry.model);
  const productType = itemName(entry.item);
  const brand = publicBrand(entry.brand);
  const model = hasModel ? entry.model.toUpperCase() : '';
  const feature = featureFor(entry.item, model || productType);
  const name = `${brand} ${productType}${model ? ` ${model}` : ''} – ${feature}`;
  const slug = `${slugify(brand)}-${slugify(productType)}-${slugify(model || `stock-${entry.sourceNos[0]}`)}`;
  return {
    slug, name, brand, category, subCategory: subCategoryFor(entry.item), productType,
    model: model || 'Compatible / unbranded model', sourceRows: entry.sourceNos,
    price: `৳${entry.mrp.toLocaleString('en-BD')}`,
    stockQty: entry.stockQty, stockStatus: entry.stockQty > 0 ? 'In stock' : 'Stock confirmation required',
    description: `${brand} ${productType.toLowerCase()}${model ? `, model ${model}` : ''}, for ${feature.toLowerCase()}. Available from MacroByte Trade subject to stock confirmation.`,
    details: `A stocked ${productType.toLowerCase()} for home, office and project requirements. Confirm availability, compatibility and delivery requirements with MacroByte Trade before ordering.`,
    features: [feature, `Model: ${model || 'Compatible / unbranded'}`, 'Stock confirmation before order', 'Direct product enquiry support'],
    specs: [['Brand', brand], ['Model', model || 'Compatible / unbranded'], ['Category', category], ['Stock status', entry.stockQty > 0 ? `${entry.stockQty} unit(s) listed in stock` : 'Confirm availability'], ['Listed MRP', `৳${entry.mrp.toLocaleString('en-BD')}`]],
    keywords: [brand, productType, model, category, 'MacroByte Trade Bangladesh'].filter(Boolean),
    order: index + 1, active: true, source: 'MACRO BYTE STOCK (1).xlsx'
  };
});
