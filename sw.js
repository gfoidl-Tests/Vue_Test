if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return a[e]||(s=new Promise(async s=>{if("document"in self){const a=document.createElement("script");a.src=e,document.head.appendChild(a),a.onload=s}else importScripts(e),s()})),s.then(()=>{if(!a[e])throw new Error(`Module ${e} didn’t register its module`);return a[e]})},s=(s,a)=>{Promise.all(s.map(e)).then(e=>a(1===e.length?e[0]:e))},a={require:Promise.resolve(s)};self.define=(s,d,c)=>{a[s]||(a[s]=Promise.resolve().then(()=>{let a={};const i={uri:location.origin+s.slice(1)};return Promise.all(d.map(s=>{switch(s){case"exports":return a;case"module":return i;default:return e(s)}})).then(e=>{const s=c(...e);return a.default||(a.default=s),a})}))}}define("./sw.js",["./workbox-2c5d8bc1"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/../index.html",revision:"00b8b6ff0dfeed3764499c2dff53502b"},{url:"assets/../manifest.json",revision:"e7f1c4828b5ab6c34bdb1a2ad4934275"},{url:"assets/0.574ccad219bed9a125d7.css",revision:"f69b1de982f145ee763ee7d02c4b76fb"},{url:"assets/1.574ccad219bed9a125d7.css",revision:"66437251491b7703a423260a5f6d051c"},{url:"assets/3.574ccad219bed9a125d7.css",revision:"86863a672c282311d939d989afb123f1"},{url:"assets/app.574ccad219bed9a125d7.js",revision:"c840921b992de29e88f691ec89e83609"},{url:"assets/bootstrap.574ccad219bed9a125d7.js",revision:"f554677806888075c737175008c1342b"},{url:"assets/bootstrap.574ccad219bed9a125d7.js.LICENSE.txt",revision:"b033dff0b77856cf983739048db55c20"},{url:"assets/common~13c43f11.574ccad219bed9a125d7.js",revision:"6e6ffb3c55e2907324e2565d27ccf770"},{url:"assets/common~13c43f11.574ccad219bed9a125d7.js.LICENSE.txt",revision:"bafb21bf640b960edf2dae831221109a"},{url:"assets/icons/icon_128x128.64f1a3f8a4ee127932d4eceabe6ac891.png",revision:"64f1a3f8a4ee127932d4eceabe6ac891"},{url:"assets/icons/icon_192x192.6646554de756411ddeb177238fe44eae.png",revision:"6646554de756411ddeb177238fe44eae"},{url:"assets/icons/icon_256x256.979ffee76d20d7ab677f8ab0337b63a5.png",revision:"979ffee76d20d7ab677f8ab0337b63a5"},{url:"assets/icons/icon_384x384.29de88823f1b8bbc650168cc35110c9c.png",revision:"29de88823f1b8bbc650168cc35110c9c"},{url:"assets/icons/icon_512x512.ad58f3e332c491aaf54e2db7c373fd2d.png",revision:"ad58f3e332c491aaf54e2db7c373fd2d"},{url:"assets/icons/icon_96x96.960504fae193185d434492ee1a37bab9.png",revision:"960504fae193185d434492ee1a37bab9"},{url:"assets/images/loading.527f1d8b0371ec39b73553aabdbdf3ee.gif",revision:"6019adfc013f3d2ef28e97cdd204e8d5"},{url:"assets/main.574ccad219bed9a125d7.js",revision:"3a0a0300f72b0d5a36a5357fcd88a0a4"},{url:"assets/main.574ccad219bed9a125d7.js.LICENSE.txt",revision:"ff19b47f2938176e3074d9d4f53fdf16"},{url:"assets/runtime.574ccad219bed9a125d7.js",revision:"61734b905f4aae6a9102be085fad4655"}],{}),e.cleanupOutdatedCaches()}));
//# sourceMappingURL=sw.js.map