if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return d[e]||(s=new Promise(async s=>{if("document"in self){const d=document.createElement("script");d.src=e,document.head.appendChild(d),d.onload=s}else importScripts(e),s()})),s.then(()=>{if(!d[e])throw new Error(`Module ${e} didn’t register its module`);return d[e]})},s=(s,d)=>{Promise.all(s.map(e)).then(e=>d(1===e.length?e[0]:e))},d={require:Promise.resolve(s)};self.define=(s,c,a)=>{d[s]||(d[s]=Promise.resolve().then(()=>{let d={};const i={uri:location.origin+s.slice(1)};return Promise.all(c.map(s=>{switch(s){case"exports":return d;case"module":return i;default:return e(s)}})).then(e=>{const s=a(...e);return d.default||(d.default=s),d})}))}}define("./sw.js",["./workbox-2c5d8bc1"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/../index.html",revision:"57f0939c6ca19dcdaa5b0b1d30001a60"},{url:"assets/../manifest.7c2d276818906332a67423c2a8535dc7.json",revision:"7c2d276818906332a67423c2a8535dc7"},{url:"assets/0.69d05808de467dfdecb7.css",revision:"f69b1de982f145ee763ee7d02c4b76fb"},{url:"assets/1.69d05808de467dfdecb7.css",revision:"66437251491b7703a423260a5f6d051c"},{url:"assets/3.69d05808de467dfdecb7.css",revision:"9ff8c4c289a652096d33a5996ea46c57"},{url:"assets/app.69d05808de467dfdecb7.js",revision:"be48352401b59d3235072bf5feb4f374"},{url:"assets/bootstrap.69d05808de467dfdecb7.js",revision:"c7c540ecd671e5d8f37e7fa5eeece087"},{url:"assets/bootstrap.69d05808de467dfdecb7.js.LICENSE.txt",revision:"b033dff0b77856cf983739048db55c20"},{url:"assets/common~13c43f11.69d05808de467dfdecb7.js",revision:"cafaf95720e1f6a9900b5ebeb9ef6c3b"},{url:"assets/common~13c43f11.69d05808de467dfdecb7.js.LICENSE.txt",revision:"bafb21bf640b960edf2dae831221109a"},{url:"assets/icons/icon_128x128.64f1a3f8a4ee127932d4eceabe6ac891.png",revision:"64f1a3f8a4ee127932d4eceabe6ac891"},{url:"assets/icons/icon_192x192.6646554de756411ddeb177238fe44eae.png",revision:"6646554de756411ddeb177238fe44eae"},{url:"assets/icons/icon_256x256.979ffee76d20d7ab677f8ab0337b63a5.png",revision:"979ffee76d20d7ab677f8ab0337b63a5"},{url:"assets/icons/icon_384x384.29de88823f1b8bbc650168cc35110c9c.png",revision:"29de88823f1b8bbc650168cc35110c9c"},{url:"assets/icons/icon_512x512.ad58f3e332c491aaf54e2db7c373fd2d.png",revision:"ad58f3e332c491aaf54e2db7c373fd2d"},{url:"assets/icons/icon_96x96.960504fae193185d434492ee1a37bab9.png",revision:"960504fae193185d434492ee1a37bab9"},{url:"assets/images/loading.527f1d8b0371ec39b73553aabdbdf3ee.gif",revision:"6019adfc013f3d2ef28e97cdd204e8d5"},{url:"assets/main.69d05808de467dfdecb7.js",revision:"7c07595e0765555c7b129ed5c2d7b570"},{url:"assets/main.69d05808de467dfdecb7.js.LICENSE.txt",revision:"ff19b47f2938176e3074d9d4f53fdf16"},{url:"assets/runtime.69d05808de467dfdecb7.js",revision:"d7347f756b3fd1ae9356ba2ccc973f5d"}],{}),e.cleanupOutdatedCaches()}));
//# sourceMappingURL=sw.js.map
