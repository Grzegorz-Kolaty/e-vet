import{A as J2,H as Z2,S as c1,V as l1,W as s1,g as r2,h as V2,j as Y2,k as Q,ka as a1,na as e1,r as X2,t as $2,w as K2,x as v,y as z2,z as Q2}from"./chunk-WHZMVVWQ.js";function h3(c,l,s){return(l=g3(l))in c?Object.defineProperty(c,l,{value:s,enumerable:!0,configurable:!0,writable:!0}):c[l]=s,c}function n1(c,l){var s=Object.keys(c);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(c);l&&(a=a.filter(function(e){return Object.getOwnPropertyDescriptor(c,e).enumerable})),s.push.apply(s,a)}return s}function i(c){for(var l=1;l<arguments.length;l++){var s=arguments[l]!=null?arguments[l]:{};l%2?n1(Object(s),!0).forEach(function(a){h3(c,a,s[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(c,Object.getOwnPropertyDescriptors(s)):n1(Object(s)).forEach(function(a){Object.defineProperty(c,a,Object.getOwnPropertyDescriptor(s,a))})}return c}function x3(c,l){if(typeof c!="object"||!c)return c;var s=c[Symbol.toPrimitive];if(s!==void 0){var a=s.call(c,l||"default");if(typeof a!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(l==="string"?String:Number)(c)}function g3(c){var l=x3(c,"string");return typeof l=="symbol"?l:l+""}var o1=()=>{},B2={},F1={},D1=null,B1={mark:o1,measure:o1};try{typeof window<"u"&&(B2=window),typeof document<"u"&&(F1=document),typeof MutationObserver<"u"&&(D1=MutationObserver),typeof performance<"u"&&(B1=performance)}catch{}var{userAgent:i1=""}=B2.navigator||{},T=B2,p=F1,t1=D1,J=B1,D0=!!T.document,k=!!p.documentElement&&!!p.head&&typeof p.addEventListener=="function"&&typeof p.createElement=="function",R1=~i1.indexOf("MSIE")||~i1.indexOf("Trident/"),N3=/fa(s|r|l|t|d|dr|dl|dt|b|k|kd|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,b3=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i,E1={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"}},S3={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},H1=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],C="classic",e2="duotone",w3="sharp",y3="sharp-duotone",I1=[C,e2,w3,y3],k3={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"}},A3={"Font Awesome 6 Free":{900:"fas",400:"far"},"Font Awesome 6 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 6 Brands":{400:"fab",normal:"fab"},"Font Awesome 6 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 6 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 6 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"}},v3=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}]]),P3={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",brands:"fab"},duotone:{solid:"fad",regular:"fadr",light:"fadl",thin:"fadt"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds",regular:"fasdr",light:"fasdl",thin:"fasdt"}},T3=["fak","fa-kit","fakd","fa-kit-duotone"],f1={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},F3=["kit"],D3={kit:{"fa-kit":"fak"},"kit-duotone":{"fa-kit-duotone":"fakd"}},B3=["fak","fakd"],R3={kit:{fak:"fa-kit"},"kit-duotone":{fakd:"fa-kit-duotone"}},r1={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},Z={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},E3=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],H3=["fak","fa-kit","fakd","fa-kit-duotone"],I3={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},O3={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"}},U3={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"]},u2={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"}},q3=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands"],d2=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt",...E3,...q3],W3=["solid","regular","light","thin","duotone","brands"],O1=[1,2,3,4,5,6,7,8,9,10],_3=O1.concat([11,12,13,14,15,16,17,18,19,20]),G3=[...Object.keys(U3),...W3,"2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",Z.GROUP,Z.SWAP_OPACITY,Z.PRIMARY,Z.SECONDARY].concat(O1.map(c=>"".concat(c,"x"))).concat(_3.map(c=>"w-".concat(c))),j3={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},w="___FONT_AWESOME___",h2=16,U1="fa",q1="svg-inline--fa",E="data-fa-i2svg",x2="data-fa-pseudo-element",V3="data-fa-pseudo-element-pending",R2="data-prefix",E2="data-icon",z1="fontawesome-i2svg",Y3="async",X3=["HTML","HEAD","STYLE","SCRIPT"],W1=(()=>{try{return!0}catch{return!1}})();function $(c){return new Proxy(c,{get(l,s){return s in l?l[s]:l[C]}})}var _1=i({},E1);_1[C]=i(i(i(i({},{"fa-duotone":"duotone"}),E1[C]),f1.kit),f1["kit-duotone"]);var $3=$(_1),g2=i({},P3);g2[C]=i(i(i(i({},{duotone:"fad"}),g2[C]),r1.kit),r1["kit-duotone"]);var m1=$(g2),N2=i({},u2);N2[C]=i(i({},N2[C]),R3.kit);var H2=$(N2),b2=i({},O3);b2[C]=i(i({},b2[C]),D3.kit);var B0=$(b2),K3=N3,G1="fa-layers-text",Q3=b3,J3=i({},k3),R0=$(J3),Z3=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],m2=S3,c4=[...F3,...G3],j=T.FontAwesomeConfig||{};function l4(c){var l=p.querySelector("script["+c+"]");if(l)return l.getAttribute(c)}function s4(c){return c===""?!0:c==="false"?!1:c==="true"?!0:c}p&&typeof p.querySelector=="function"&&[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]].forEach(l=>{let[s,a]=l,e=s4(l4(s));e!=null&&(j[a]=e)});var j1={styleDefault:"solid",familyDefault:C,cssPrefix:U1,replacementClass:q1,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};j.familyPrefix&&(j.cssPrefix=j.familyPrefix);var W=i(i({},j1),j);W.autoReplaceSvg||(W.observeMutations=!1);var f={};Object.keys(j1).forEach(c=>{Object.defineProperty(f,c,{enumerable:!0,set:function(l){W[c]=l,V.forEach(s=>s(f))},get:function(){return W[c]}})});Object.defineProperty(f,"familyPrefix",{enumerable:!0,set:function(c){W.cssPrefix=c,V.forEach(l=>l(f))},get:function(){return W.cssPrefix}});T.FontAwesomeConfig=f;var V=[];function a4(c){return V.push(c),()=>{V.splice(V.indexOf(c),1)}}var P=h2,N={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function e4(c){if(!c||!k)return;let l=p.createElement("style");l.setAttribute("type","text/css"),l.innerHTML=c;let s=p.head.childNodes,a=null;for(let e=s.length-1;e>-1;e--){let n=s[e],o=(n.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(o)>-1&&(a=n)}return p.head.insertBefore(l,a),c}var n4="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function Y(){let c=12,l="";for(;c-- >0;)l+=n4[Math.random()*62|0];return l}function _(c){let l=[];for(let s=(c||[]).length>>>0;s--;)l[s]=c[s];return l}function I2(c){return c.classList?_(c.classList):(c.getAttribute("class")||"").split(" ").filter(l=>l)}function V1(c){return"".concat(c).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function o4(c){return Object.keys(c||{}).reduce((l,s)=>l+"".concat(s,'="').concat(V1(c[s]),'" '),"").trim()}function n2(c){return Object.keys(c||{}).reduce((l,s)=>l+"".concat(s,": ").concat(c[s].trim(),";"),"")}function O2(c){return c.size!==N.size||c.x!==N.x||c.y!==N.y||c.rotate!==N.rotate||c.flipX||c.flipY}function i4(c){let{transform:l,containerWidth:s,iconWidth:a}=c,e={transform:"translate(".concat(s/2," 256)")},n="translate(".concat(l.x*32,", ").concat(l.y*32,") "),o="scale(".concat(l.size/16*(l.flipX?-1:1),", ").concat(l.size/16*(l.flipY?-1:1),") "),t="rotate(".concat(l.rotate," 0 0)"),z={transform:"".concat(n," ").concat(o," ").concat(t)},r={transform:"translate(".concat(a/2*-1," -256)")};return{outer:e,inner:z,path:r}}function t4(c){let{transform:l,width:s=h2,height:a=h2,startCentered:e=!1}=c,n="";return e&&R1?n+="translate(".concat(l.x/P-s/2,"em, ").concat(l.y/P-a/2,"em) "):e?n+="translate(calc(-50% + ".concat(l.x/P,"em), calc(-50% + ").concat(l.y/P,"em)) "):n+="translate(".concat(l.x/P,"em, ").concat(l.y/P,"em) "),n+="scale(".concat(l.size/P*(l.flipX?-1:1),", ").concat(l.size/P*(l.flipY?-1:1),") "),n+="rotate(".concat(l.rotate,"deg) "),n}var f4=`:root, :host {
  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Free";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Free";
  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Pro";
  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Pro";
  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-regular: normal 400 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-light: normal 300 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-thin: normal 100 1em/1 "Font Awesome 6 Duotone";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";
  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-duotone-solid: normal 900 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-regular: normal 400 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-light: normal 300 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-thin: normal 100 1em/1 "Font Awesome 6 Sharp Duotone";
}

svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {
  overflow: visible;
  box-sizing: content-box;
}

.svg-inline--fa {
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285705em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left {
  margin-right: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-pull-right {
  margin-left: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  top: 0.25em;
}
.svg-inline--fa.fa-fw {
  width: var(--fa-fw-width, 1.25em);
}

.fa-layers svg.svg-inline--fa {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: 1em;
}
.fa-layers svg.svg-inline--fa {
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: 0.625em;
  line-height: 0.1em;
  vertical-align: 0.225em;
}

.fa-xs {
  font-size: 0.75em;
  line-height: 0.0833333337em;
  vertical-align: 0.125em;
}

.fa-sm {
  font-size: 0.875em;
  line-height: 0.0714285718em;
  vertical-align: 0.0535714295em;
}

.fa-lg {
  font-size: 1.25em;
  line-height: 0.05em;
  vertical-align: -0.075em;
}

.fa-xl {
  font-size: 1.5em;
  line-height: 0.0416666682em;
  vertical-align: -0.125em;
}

.fa-2xl {
  font-size: 2em;
  line-height: 0.03125em;
  vertical-align: -0.1875em;
}

.fa-fw {
  text-align: center;
  width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-left: var(--fa-li-margin, 2.5em);
  padding-left: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  left: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.08em);
  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);
}

.fa-pull-left {
  float: left;
  margin-right: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right {
  float: right;
  margin-left: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
.fa-bounce,
.fa-fade,
.fa-beat-fade,
.fa-flip,
.fa-pulse,
.fa-shake,
.fa-spin,
.fa-spin-pulse {
    animation-delay: -1ms;
    animation-duration: 1ms;
    animation-iteration-count: 1;
    transition-delay: 0s;
    transition-duration: 0s;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.fa-stack {
  display: inline-block;
  vertical-align: middle;
  height: 2em;
  position: relative;
  width: 2.5em;
}

.fa-stack-1x,
.fa-stack-2x {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: var(--fa-stack-z-index, auto);
}

.svg-inline--fa.fa-stack-1x {
  height: 1em;
  width: 1.25em;
}
.svg-inline--fa.fa-stack-2x {
  height: 2em;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.sr-only,
.fa-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:not(:focus),
.fa-sr-only-focusable:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}`;function Y1(){let c=U1,l=q1,s=f.cssPrefix,a=f.replacementClass,e=f4;if(s!==c||a!==l){let n=new RegExp("\\.".concat(c,"\\-"),"g"),o=new RegExp("\\--".concat(c,"\\-"),"g"),t=new RegExp("\\.".concat(l),"g");e=e.replace(n,".".concat(s,"-")).replace(o,"--".concat(s,"-")).replace(t,".".concat(a))}return e}var L1=!1;function L2(){f.autoAddCss&&!L1&&(e4(Y1()),L1=!0)}var r4={mixout(){return{dom:{css:Y1,insertCss:L2}}},hooks(){return{beforeDOMElementCreation(){L2()},beforeI2svg(){L2()}}}},y=T||{};y[w]||(y[w]={});y[w].styles||(y[w].styles={});y[w].hooks||(y[w].hooks={});y[w].shims||(y[w].shims=[]);var b=y[w],X1=[],$1=function(){p.removeEventListener("DOMContentLoaded",$1),s2=1,X1.map(c=>c())},s2=!1;k&&(s2=(p.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(p.readyState),s2||p.addEventListener("DOMContentLoaded",$1));function z4(c){k&&(s2?setTimeout(c,0):X1.push(c))}function K(c){let{tag:l,attributes:s={},children:a=[]}=c;return typeof c=="string"?V1(c):"<".concat(l," ").concat(o4(s),">").concat(a.map(K).join(""),"</").concat(l,">")}function M1(c,l,s){if(c&&c[l]&&c[l][s])return{prefix:l,iconName:s,icon:c[l][s]}}var m4=function(l,s){return function(a,e,n,o){return l.call(s,a,e,n,o)}},M2=function(l,s,a,e){var n=Object.keys(l),o=n.length,t=e!==void 0?m4(s,e):s,z,r,m;for(a===void 0?(z=1,m=l[n[0]]):(z=0,m=a);z<o;z++)r=n[z],m=t(m,l[r],r,l);return m};function L4(c){let l=[],s=0,a=c.length;for(;s<a;){let e=c.charCodeAt(s++);if(e>=55296&&e<=56319&&s<a){let n=c.charCodeAt(s++);(n&64512)==56320?l.push(((e&1023)<<10)+(n&1023)+65536):(l.push(e),s--)}else l.push(e)}return l}function S2(c){let l=L4(c);return l.length===1?l[0].toString(16):null}function M4(c,l){let s=c.length,a=c.charCodeAt(l),e;return a>=55296&&a<=56319&&s>l+1&&(e=c.charCodeAt(l+1),e>=56320&&e<=57343)?(a-55296)*1024+e-56320+65536:a}function p1(c){return Object.keys(c).reduce((l,s)=>{let a=c[s];return!!a.icon?l[a.iconName]=a.icon:l[s]=a,l},{})}function w2(c,l){let s=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},{skipHooks:a=!1}=s,e=p1(l);typeof b.hooks.addPack=="function"&&!a?b.hooks.addPack(c,p1(l)):b.styles[c]=i(i({},b.styles[c]||{}),e),c==="fas"&&w2("fa",l)}var{styles:X,shims:p4}=b,K1=Object.keys(H2),C4=K1.reduce((c,l)=>(c[l]=Object.keys(H2[l]),c),{}),U2=null,Q1={},J1={},Z1={},c3={},l3={};function u4(c){return~c4.indexOf(c)}function d4(c,l){let s=l.split("-"),a=s[0],e=s.slice(1).join("-");return a===c&&e!==""&&!u4(e)?e:null}var s3=()=>{let c=a=>M2(X,(e,n,o)=>(e[o]=M2(n,a,{}),e),{});Q1=c((a,e,n)=>(e[3]&&(a[e[3]]=n),e[2]&&e[2].filter(t=>typeof t=="number").forEach(t=>{a[t.toString(16)]=n}),a)),J1=c((a,e,n)=>(a[n]=n,e[2]&&e[2].filter(t=>typeof t=="string").forEach(t=>{a[t]=n}),a)),l3=c((a,e,n)=>{let o=e[2];return a[n]=n,o.forEach(t=>{a[t]=n}),a});let l="far"in X||f.autoFetchSvg,s=M2(p4,(a,e)=>{let n=e[0],o=e[1],t=e[2];return o==="far"&&!l&&(o="fas"),typeof n=="string"&&(a.names[n]={prefix:o,iconName:t}),typeof n=="number"&&(a.unicodes[n.toString(16)]={prefix:o,iconName:t}),a},{names:{},unicodes:{}});Z1=s.names,c3=s.unicodes,U2=o2(f.styleDefault,{family:f.familyDefault})};a4(c=>{U2=o2(c.styleDefault,{family:f.familyDefault})});s3();function q2(c,l){return(Q1[c]||{})[l]}function h4(c,l){return(J1[c]||{})[l]}function R(c,l){return(l3[c]||{})[l]}function a3(c){return Z1[c]||{prefix:null,iconName:null}}function x4(c){let l=c3[c],s=q2("fas",c);return l||(s?{prefix:"fas",iconName:s}:null)||{prefix:null,iconName:null}}function F(){return U2}var e3=()=>({prefix:null,iconName:null,rest:[]});function g4(c){let l=C,s=K1.reduce((a,e)=>(a[e]="".concat(f.cssPrefix,"-").concat(e),a),{});return I1.forEach(a=>{(c.includes(s[a])||c.some(e=>C4[a].includes(e)))&&(l=a)}),l}function o2(c){let l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{family:s=C}=l,a=$3[s][c];if(s===e2&&!c)return"fad";let e=m1[s][c]||m1[s][a],n=c in b.styles?c:null;return e||n||null}function N4(c){let l=[],s=null;return c.forEach(a=>{let e=d4(f.cssPrefix,a);e?s=e:a&&l.push(a)}),{iconName:s,rest:l}}function C1(c){return c.sort().filter((l,s,a)=>a.indexOf(l)===s)}function i2(c){let l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{skipLookups:s=!1}=l,a=null,e=d2.concat(H3),n=C1(c.filter(M=>e.includes(M))),o=C1(c.filter(M=>!d2.includes(M))),t=n.filter(M=>(a=M,!H1.includes(M))),[z=null]=t,r=g4(n),m=i(i({},N4(o)),{},{prefix:o2(z,{family:r})});return i(i(i({},m),y4({values:c,family:r,styles:X,config:f,canonical:m,givenPrefix:a})),b4(s,a,m))}function b4(c,l,s){let{prefix:a,iconName:e}=s;if(c||!a||!e)return{prefix:a,iconName:e};let n=l==="fa"?a3(e):{},o=R(a,e);return e=n.iconName||o||e,a=n.prefix||a,a==="far"&&!X.far&&X.fas&&!f.autoFetchSvg&&(a="fas"),{prefix:a,iconName:e}}var S4=I1.filter(c=>c!==C||c!==e2),w4=Object.keys(u2).filter(c=>c!==C).map(c=>Object.keys(u2[c])).flat();function y4(c){let{values:l,family:s,canonical:a,givenPrefix:e="",styles:n={},config:o={}}=c,t=s===e2,z=l.includes("fa-duotone")||l.includes("fad"),r=o.familyDefault==="duotone",m=a.prefix==="fad"||a.prefix==="fa-duotone";if(!t&&(z||r||m)&&(a.prefix="fad"),(l.includes("fa-brands")||l.includes("fab"))&&(a.prefix="fab"),!a.prefix&&S4.includes(s)&&(Object.keys(n).find(L=>w4.includes(L))||o.autoFetchSvg)){let L=v3.get(s).defaultShortPrefixId;a.prefix=L,a.iconName=R(a.prefix,a.iconName)||a.iconName}return(a.prefix==="fa"||e==="fa")&&(a.prefix=F()||"fas"),a}var y2=class{constructor(){this.definitions={}}add(){for(var l=arguments.length,s=new Array(l),a=0;a<l;a++)s[a]=arguments[a];let e=s.reduce(this._pullDefinitions,{});Object.keys(e).forEach(n=>{this.definitions[n]=i(i({},this.definitions[n]||{}),e[n]),w2(n,e[n]);let o=H2[C][n];o&&w2(o,e[n]),s3()})}reset(){this.definitions={}}_pullDefinitions(l,s){let a=s.prefix&&s.iconName&&s.icon?{0:s}:s;return Object.keys(a).map(e=>{let{prefix:n,iconName:o,icon:t}=a[e],z=t[2];l[n]||(l[n]={}),z.length>0&&z.forEach(r=>{typeof r=="string"&&(l[n][r]=t)}),l[n][o]=t}),l}},u1=[],U={},q={},k4=Object.keys(q);function A4(c,l){let{mixoutsTo:s}=l;return u1=c,U={},Object.keys(q).forEach(a=>{k4.indexOf(a)===-1&&delete q[a]}),u1.forEach(a=>{let e=a.mixout?a.mixout():{};if(Object.keys(e).forEach(n=>{typeof e[n]=="function"&&(s[n]=e[n]),typeof e[n]=="object"&&Object.keys(e[n]).forEach(o=>{s[n]||(s[n]={}),s[n][o]=e[n][o]})}),a.hooks){let n=a.hooks();Object.keys(n).forEach(o=>{U[o]||(U[o]=[]),U[o].push(n[o])})}a.provides&&a.provides(q)}),s}function k2(c,l){for(var s=arguments.length,a=new Array(s>2?s-2:0),e=2;e<s;e++)a[e-2]=arguments[e];return(U[c]||[]).forEach(o=>{l=o.apply(null,[l,...a])}),l}function H(c){for(var l=arguments.length,s=new Array(l>1?l-1:0),a=1;a<l;a++)s[a-1]=arguments[a];(U[c]||[]).forEach(n=>{n.apply(null,s)})}function D(){let c=arguments[0],l=Array.prototype.slice.call(arguments,1);return q[c]?q[c].apply(null,l):void 0}function A2(c){c.prefix==="fa"&&(c.prefix="fas");let{iconName:l}=c,s=c.prefix||F();if(l)return l=R(s,l)||l,M1(n3.definitions,s,l)||M1(b.styles,s,l)}var n3=new y2,v4=()=>{f.autoReplaceSvg=!1,f.observeMutations=!1,H("noAuto")},P4={i2svg:function(){let c=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return k?(H("beforeI2svg",c),D("pseudoElements2svg",c),D("i2svg",c)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){let c=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},{autoReplaceSvgRoot:l}=c;f.autoReplaceSvg===!1&&(f.autoReplaceSvg=!0),f.observeMutations=!0,z4(()=>{F4({autoReplaceSvgRoot:l}),H("watch",c)})}},T4={icon:c=>{if(c===null)return null;if(typeof c=="object"&&c.prefix&&c.iconName)return{prefix:c.prefix,iconName:R(c.prefix,c.iconName)||c.iconName};if(Array.isArray(c)&&c.length===2){let l=c[1].indexOf("fa-")===0?c[1].slice(3):c[1],s=o2(c[0]);return{prefix:s,iconName:R(s,l)||l}}if(typeof c=="string"&&(c.indexOf("".concat(f.cssPrefix,"-"))>-1||c.match(K3))){let l=i2(c.split(" "),{skipLookups:!0});return{prefix:l.prefix||F(),iconName:R(l.prefix,l.iconName)||l.iconName}}if(typeof c=="string"){let l=F();return{prefix:l,iconName:R(l,c)||c}}}},h={noAuto:v4,config:f,dom:P4,parse:T4,library:n3,findIconDefinition:A2,toHtml:K},F4=function(){let c=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},{autoReplaceSvgRoot:l=p}=c;(Object.keys(b.styles).length>0||f.autoFetchSvg)&&k&&f.autoReplaceSvg&&h.dom.i2svg({node:l})};function t2(c,l){return Object.defineProperty(c,"abstract",{get:l}),Object.defineProperty(c,"html",{get:function(){return c.abstract.map(s=>K(s))}}),Object.defineProperty(c,"node",{get:function(){if(!k)return;let s=p.createElement("div");return s.innerHTML=c.html,s.children}}),c}function D4(c){let{children:l,main:s,mask:a,attributes:e,styles:n,transform:o}=c;if(O2(o)&&s.found&&!a.found){let{width:t,height:z}=s,r={x:t/z/2,y:.5};e.style=n2(i(i({},n),{},{"transform-origin":"".concat(r.x+o.x/16,"em ").concat(r.y+o.y/16,"em")}))}return[{tag:"svg",attributes:e,children:l}]}function B4(c){let{prefix:l,iconName:s,children:a,attributes:e,symbol:n}=c,o=n===!0?"".concat(l,"-").concat(f.cssPrefix,"-").concat(s):n;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:i(i({},e),{},{id:o}),children:a}]}]}function W2(c){let{icons:{main:l,mask:s},prefix:a,iconName:e,transform:n,symbol:o,title:t,maskId:z,titleId:r,extra:m,watchable:M=!1}=c,{width:L,height:u}=s.found?s:l,A=B3.includes(a),B=[f.replacementClass,e?"".concat(f.cssPrefix,"-").concat(e):""].filter(O=>m.classes.indexOf(O)===-1).filter(O=>O!==""||!!O).concat(m.classes).join(" "),x={children:[],attributes:i(i({},m.attributes),{},{"data-prefix":a,"data-icon":e,class:B,role:m.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(L," ").concat(u)})},S=A&&!~m.classes.indexOf("fa-fw")?{width:"".concat(L/u*16*.0625,"em")}:{};M&&(x.attributes[E]=""),t&&(x.children.push({tag:"title",attributes:{id:x.attributes["aria-labelledby"]||"title-".concat(r||Y())},children:[t]}),delete x.attributes.title);let d=i(i({},x),{},{prefix:a,iconName:e,main:l,mask:s,maskId:z,transform:n,symbol:o,styles:i(i({},S),m.styles)}),{children:g,attributes:I}=s.found&&l.found?D("generateAbstractMask",d)||{children:[],attributes:{}}:D("generateAbstractIcon",d)||{children:[],attributes:{}};return d.children=g,d.attributes=I,o?B4(d):D4(d)}function d1(c){let{content:l,width:s,height:a,transform:e,title:n,extra:o,watchable:t=!1}=c,z=i(i(i({},o.attributes),n?{title:n}:{}),{},{class:o.classes.join(" ")});t&&(z[E]="");let r=i({},o.styles);O2(e)&&(r.transform=t4({transform:e,startCentered:!0,width:s,height:a}),r["-webkit-transform"]=r.transform);let m=n2(r);m.length>0&&(z.style=m);let M=[];return M.push({tag:"span",attributes:z,children:[l]}),n&&M.push({tag:"span",attributes:{class:"sr-only"},children:[n]}),M}function R4(c){let{content:l,title:s,extra:a}=c,e=i(i(i({},a.attributes),s?{title:s}:{}),{},{class:a.classes.join(" ")}),n=n2(a.styles);n.length>0&&(e.style=n);let o=[];return o.push({tag:"span",attributes:e,children:[l]}),s&&o.push({tag:"span",attributes:{class:"sr-only"},children:[s]}),o}var{styles:p2}=b;function v2(c){let l=c[0],s=c[1],[a]=c.slice(4),e=null;return Array.isArray(a)?e={tag:"g",attributes:{class:"".concat(f.cssPrefix,"-").concat(m2.GROUP)},children:[{tag:"path",attributes:{class:"".concat(f.cssPrefix,"-").concat(m2.SECONDARY),fill:"currentColor",d:a[0]}},{tag:"path",attributes:{class:"".concat(f.cssPrefix,"-").concat(m2.PRIMARY),fill:"currentColor",d:a[1]}}]}:e={tag:"path",attributes:{fill:"currentColor",d:a}},{found:!0,width:l,height:s,icon:e}}var E4={found:!1,width:512,height:512};function H4(c,l){!W1&&!f.showMissingIcons&&c&&console.error('Icon with name "'.concat(c,'" and prefix "').concat(l,'" is missing.'))}function P2(c,l){let s=l;return l==="fa"&&f.styleDefault!==null&&(l=F()),new Promise((a,e)=>{if(s==="fa"){let n=a3(c)||{};c=n.iconName||c,l=n.prefix||l}if(c&&l&&p2[l]&&p2[l][c]){let n=p2[l][c];return a(v2(n))}H4(c,l),a(i(i({},E4),{},{icon:f.showMissingIcons&&c?D("missingIconAbstract")||{}:{}}))})}var h1=()=>{},T2=f.measurePerformance&&J&&J.mark&&J.measure?J:{mark:h1,measure:h1},G='FA "6.7.2"',I4=c=>(T2.mark("".concat(G," ").concat(c," begins")),()=>o3(c)),o3=c=>{T2.mark("".concat(G," ").concat(c," ends")),T2.measure("".concat(G," ").concat(c),"".concat(G," ").concat(c," begins"),"".concat(G," ").concat(c," ends"))},_2={begin:I4,end:o3},c2=()=>{};function x1(c){return typeof(c.getAttribute?c.getAttribute(E):null)=="string"}function O4(c){let l=c.getAttribute?c.getAttribute(R2):null,s=c.getAttribute?c.getAttribute(E2):null;return l&&s}function U4(c){return c&&c.classList&&c.classList.contains&&c.classList.contains(f.replacementClass)}function q4(){return f.autoReplaceSvg===!0?l2.replace:l2[f.autoReplaceSvg]||l2.replace}function W4(c){return p.createElementNS("http://www.w3.org/2000/svg",c)}function _4(c){return p.createElement(c)}function i3(c){let l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{ceFn:s=c.tag==="svg"?W4:_4}=l;if(typeof c=="string")return p.createTextNode(c);let a=s(c.tag);return Object.keys(c.attributes||[]).forEach(function(n){a.setAttribute(n,c.attributes[n])}),(c.children||[]).forEach(function(n){a.appendChild(i3(n,{ceFn:s}))}),a}function G4(c){let l=" ".concat(c.outerHTML," ");return l="".concat(l,"Font Awesome fontawesome.com "),l}var l2={replace:function(c){let l=c[0];if(l.parentNode)if(c[1].forEach(s=>{l.parentNode.insertBefore(i3(s),l)}),l.getAttribute(E)===null&&f.keepOriginalSource){let s=p.createComment(G4(l));l.parentNode.replaceChild(s,l)}else l.remove()},nest:function(c){let l=c[0],s=c[1];if(~I2(l).indexOf(f.replacementClass))return l2.replace(c);let a=new RegExp("".concat(f.cssPrefix,"-.*"));if(delete s[0].attributes.id,s[0].attributes.class){let n=s[0].attributes.class.split(" ").reduce((o,t)=>(t===f.replacementClass||t.match(a)?o.toSvg.push(t):o.toNode.push(t),o),{toNode:[],toSvg:[]});s[0].attributes.class=n.toSvg.join(" "),n.toNode.length===0?l.removeAttribute("class"):l.setAttribute("class",n.toNode.join(" "))}let e=s.map(n=>K(n)).join(`
`);l.setAttribute(E,""),l.innerHTML=e}};function g1(c){c()}function t3(c,l){let s=typeof l=="function"?l:c2;if(c.length===0)s();else{let a=g1;f.mutateApproach===Y3&&(a=T.requestAnimationFrame||g1),a(()=>{let e=q4(),n=_2.begin("mutate");c.map(e),n(),s()})}}var G2=!1;function f3(){G2=!0}function F2(){G2=!1}var a2=null;function N1(c){if(!t1||!f.observeMutations)return;let{treeCallback:l=c2,nodeCallback:s=c2,pseudoElementsCallback:a=c2,observeMutationsRoot:e=p}=c;a2=new t1(n=>{if(G2)return;let o=F();_(n).forEach(t=>{if(t.type==="childList"&&t.addedNodes.length>0&&!x1(t.addedNodes[0])&&(f.searchPseudoElements&&a(t.target),l(t.target)),t.type==="attributes"&&t.target.parentNode&&f.searchPseudoElements&&a(t.target.parentNode),t.type==="attributes"&&x1(t.target)&&~Z3.indexOf(t.attributeName))if(t.attributeName==="class"&&O4(t.target)){let{prefix:z,iconName:r}=i2(I2(t.target));t.target.setAttribute(R2,z||o),r&&t.target.setAttribute(E2,r)}else U4(t.target)&&s(t.target)})}),k&&a2.observe(e,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}function j4(){a2&&a2.disconnect()}function V4(c){let l=c.getAttribute("style"),s=[];return l&&(s=l.split(";").reduce((a,e)=>{let n=e.split(":"),o=n[0],t=n.slice(1);return o&&t.length>0&&(a[o]=t.join(":").trim()),a},{})),s}function Y4(c){let l=c.getAttribute("data-prefix"),s=c.getAttribute("data-icon"),a=c.innerText!==void 0?c.innerText.trim():"",e=i2(I2(c));return e.prefix||(e.prefix=F()),l&&s&&(e.prefix=l,e.iconName=s),e.iconName&&e.prefix||(e.prefix&&a.length>0&&(e.iconName=h4(e.prefix,c.innerText)||q2(e.prefix,S2(c.innerText))),!e.iconName&&f.autoFetchSvg&&c.firstChild&&c.firstChild.nodeType===Node.TEXT_NODE&&(e.iconName=c.firstChild.data)),e}function X4(c){let l=_(c.attributes).reduce((e,n)=>(e.name!=="class"&&e.name!=="style"&&(e[n.name]=n.value),e),{}),s=c.getAttribute("title"),a=c.getAttribute("data-fa-title-id");return f.autoA11y&&(s?l["aria-labelledby"]="".concat(f.replacementClass,"-title-").concat(a||Y()):(l["aria-hidden"]="true",l.focusable="false")),l}function $4(){return{iconName:null,title:null,titleId:null,prefix:null,transform:N,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function b1(c){let l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},{iconName:s,prefix:a,rest:e}=Y4(c),n=X4(c),o=k2("parseNodeAttributes",{},c),t=l.styleParser?V4(c):[];return i({iconName:s,title:c.getAttribute("title"),titleId:c.getAttribute("data-fa-title-id"),prefix:a,transform:N,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:e,styles:t,attributes:n}},o)}var{styles:K4}=b;function r3(c){let l=f.autoReplaceSvg==="nest"?b1(c,{styleParser:!1}):b1(c);return~l.extra.classes.indexOf(G1)?D("generateLayersText",c,l):D("generateSvgReplacementMutation",c,l)}function Q4(){return[...T3,...d2]}function S1(c){let l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!k)return Promise.resolve();let s=p.documentElement.classList,a=m=>s.add("".concat(z1,"-").concat(m)),e=m=>s.remove("".concat(z1,"-").concat(m)),n=f.autoFetchSvg?Q4():H1.concat(Object.keys(K4));n.includes("fa")||n.push("fa");let o=[".".concat(G1,":not([").concat(E,"])")].concat(n.map(m=>".".concat(m,":not([").concat(E,"])"))).join(", ");if(o.length===0)return Promise.resolve();let t=[];try{t=_(c.querySelectorAll(o))}catch{}if(t.length>0)a("pending"),e("complete");else return Promise.resolve();let z=_2.begin("onTree"),r=t.reduce((m,M)=>{try{let L=r3(M);L&&m.push(L)}catch(L){W1||L.name==="MissingIcon"&&console.error(L)}return m},[]);return new Promise((m,M)=>{Promise.all(r).then(L=>{t3(L,()=>{a("active"),a("complete"),e("pending"),typeof l=="function"&&l(),z(),m()})}).catch(L=>{z(),M(L)})})}function J4(c){let l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;r3(c).then(s=>{s&&t3([s],l)})}function Z4(c){return function(l){let s=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=(l||{}).icon?l:A2(l||{}),{mask:e}=s;return e&&(e=(e||{}).icon?e:A2(e||{})),c(a,i(i({},s),{},{mask:e}))}}var c0=function(c){let l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{transform:s=N,symbol:a=!1,mask:e=null,maskId:n=null,title:o=null,titleId:t=null,classes:z=[],attributes:r={},styles:m={}}=l;if(!c)return;let{prefix:M,iconName:L,icon:u}=c;return t2(i({type:"icon"},c),()=>(H("beforeDOMElementCreation",{iconDefinition:c,params:l}),f.autoA11y&&(o?r["aria-labelledby"]="".concat(f.replacementClass,"-title-").concat(t||Y()):(r["aria-hidden"]="true",r.focusable="false")),W2({icons:{main:v2(u),mask:e?v2(e.icon):{found:!1,width:null,height:null,icon:{}}},prefix:M,iconName:L,transform:i(i({},N),s),symbol:a,title:o,maskId:n,titleId:t,extra:{attributes:r,styles:m,classes:z}})))},l0={mixout(){return{icon:Z4(c0)}},hooks(){return{mutationObserverCallbacks(c){return c.treeCallback=S1,c.nodeCallback=J4,c}}},provides(c){c.i2svg=function(l){let{node:s=p,callback:a=()=>{}}=l;return S1(s,a)},c.generateSvgReplacementMutation=function(l,s){let{iconName:a,title:e,titleId:n,prefix:o,transform:t,symbol:z,mask:r,maskId:m,extra:M}=s;return new Promise((L,u)=>{Promise.all([P2(a,o),r.iconName?P2(r.iconName,r.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(A=>{let[B,x]=A;L([l,W2({icons:{main:B,mask:x},prefix:o,iconName:a,transform:t,symbol:z,maskId:m,title:e,titleId:n,extra:M,watchable:!0})])}).catch(u)})},c.generateAbstractIcon=function(l){let{children:s,attributes:a,main:e,transform:n,styles:o}=l,t=n2(o);t.length>0&&(a.style=t);let z;return O2(n)&&(z=D("generateAbstractTransformGrouping",{main:e,transform:n,containerWidth:e.width,iconWidth:e.width})),s.push(z||e.icon),{children:s,attributes:a}}}},s0={mixout(){return{layer(c){let l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{classes:s=[]}=l;return t2({type:"layer"},()=>{H("beforeDOMElementCreation",{assembler:c,params:l});let a=[];return c(e=>{Array.isArray(e)?e.map(n=>{a=a.concat(n.abstract)}):a=a.concat(e.abstract)}),[{tag:"span",attributes:{class:["".concat(f.cssPrefix,"-layers"),...s].join(" ")},children:a}]})}}}},a0={mixout(){return{counter(c){let l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{title:s=null,classes:a=[],attributes:e={},styles:n={}}=l;return t2({type:"counter",content:c},()=>(H("beforeDOMElementCreation",{content:c,params:l}),R4({content:c.toString(),title:s,extra:{attributes:e,styles:n,classes:["".concat(f.cssPrefix,"-layers-counter"),...a]}})))}}}},e0={mixout(){return{text(c){let l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{transform:s=N,title:a=null,classes:e=[],attributes:n={},styles:o={}}=l;return t2({type:"text",content:c},()=>(H("beforeDOMElementCreation",{content:c,params:l}),d1({content:c,transform:i(i({},N),s),title:a,extra:{attributes:n,styles:o,classes:["".concat(f.cssPrefix,"-layers-text"),...e]}})))}}},provides(c){c.generateLayersText=function(l,s){let{title:a,transform:e,extra:n}=s,o=null,t=null;if(R1){let z=parseInt(getComputedStyle(l).fontSize,10),r=l.getBoundingClientRect();o=r.width/z,t=r.height/z}return f.autoA11y&&!a&&(n.attributes["aria-hidden"]="true"),Promise.resolve([l,d1({content:l.innerHTML,width:o,height:t,transform:e,title:a,extra:n,watchable:!0})])}}},n0=new RegExp('"',"ug"),w1=[1105920,1112319],y1=i(i(i(i({},{FontAwesome:{normal:"fas",400:"fas"}}),A3),j3),I3),D2=Object.keys(y1).reduce((c,l)=>(c[l.toLowerCase()]=y1[l],c),{}),o0=Object.keys(D2).reduce((c,l)=>{let s=D2[l];return c[l]=s[900]||[...Object.entries(s)][0][1],c},{});function i0(c){let l=c.replace(n0,""),s=M4(l,0),a=s>=w1[0]&&s<=w1[1],e=l.length===2?l[0]===l[1]:!1;return{value:S2(e?l[0]:l),isSecondary:a||e}}function t0(c,l){let s=c.replace(/^['"]|['"]$/g,"").toLowerCase(),a=parseInt(l),e=isNaN(a)?"normal":a;return(D2[s]||{})[e]||o0[s]}function k1(c,l){let s="".concat(V3).concat(l.replace(":","-"));return new Promise((a,e)=>{if(c.getAttribute(s)!==null)return a();let o=_(c.children).filter(L=>L.getAttribute(x2)===l)[0],t=T.getComputedStyle(c,l),z=t.getPropertyValue("font-family"),r=z.match(Q3),m=t.getPropertyValue("font-weight"),M=t.getPropertyValue("content");if(o&&!r)return c.removeChild(o),a();if(r&&M!=="none"&&M!==""){let L=t.getPropertyValue("content"),u=t0(z,m),{value:A,isSecondary:B}=i0(L),x=r[0].startsWith("FontAwesome"),S=q2(u,A),d=S;if(x){let g=x4(A);g.iconName&&g.prefix&&(S=g.iconName,u=g.prefix)}if(S&&!B&&(!o||o.getAttribute(R2)!==u||o.getAttribute(E2)!==d)){c.setAttribute(s,d),o&&c.removeChild(o);let g=$4(),{extra:I}=g;I.attributes[x2]=l,P2(S,u).then(O=>{let u3=W2(i(i({},g),{},{icons:{main:O,mask:e3()},prefix:u,iconName:d,extra:I,watchable:!0})),f2=p.createElementNS("http://www.w3.org/2000/svg","svg");l==="::before"?c.insertBefore(f2,c.firstChild):c.appendChild(f2),f2.outerHTML=u3.map(d3=>K(d3)).join(`
`),c.removeAttribute(s),a()}).catch(e)}else a()}else a()})}function f0(c){return Promise.all([k1(c,"::before"),k1(c,"::after")])}function r0(c){return c.parentNode!==document.head&&!~X3.indexOf(c.tagName.toUpperCase())&&!c.getAttribute(x2)&&(!c.parentNode||c.parentNode.tagName!=="svg")}function A1(c){if(k)return new Promise((l,s)=>{let a=_(c.querySelectorAll("*")).filter(r0).map(f0),e=_2.begin("searchPseudoElements");f3(),Promise.all(a).then(()=>{e(),F2(),l()}).catch(()=>{e(),F2(),s()})})}var z0={hooks(){return{mutationObserverCallbacks(c){return c.pseudoElementsCallback=A1,c}}},provides(c){c.pseudoElements2svg=function(l){let{node:s=p}=l;f.searchPseudoElements&&A1(s)}}},v1=!1,m0={mixout(){return{dom:{unwatch(){f3(),v1=!0}}}},hooks(){return{bootstrap(){N1(k2("mutationObserverCallbacks",{}))},noAuto(){j4()},watch(c){let{observeMutationsRoot:l}=c;v1?F2():N1(k2("mutationObserverCallbacks",{observeMutationsRoot:l}))}}}},P1=c=>{let l={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return c.toLowerCase().split(" ").reduce((s,a)=>{let e=a.toLowerCase().split("-"),n=e[0],o=e.slice(1).join("-");if(n&&o==="h")return s.flipX=!0,s;if(n&&o==="v")return s.flipY=!0,s;if(o=parseFloat(o),isNaN(o))return s;switch(n){case"grow":s.size=s.size+o;break;case"shrink":s.size=s.size-o;break;case"left":s.x=s.x-o;break;case"right":s.x=s.x+o;break;case"up":s.y=s.y-o;break;case"down":s.y=s.y+o;break;case"rotate":s.rotate=s.rotate+o;break}return s},l)},L0={mixout(){return{parse:{transform:c=>P1(c)}}},hooks(){return{parseNodeAttributes(c,l){let s=l.getAttribute("data-fa-transform");return s&&(c.transform=P1(s)),c}}},provides(c){c.generateAbstractTransformGrouping=function(l){let{main:s,transform:a,containerWidth:e,iconWidth:n}=l,o={transform:"translate(".concat(e/2," 256)")},t="translate(".concat(a.x*32,", ").concat(a.y*32,") "),z="scale(".concat(a.size/16*(a.flipX?-1:1),", ").concat(a.size/16*(a.flipY?-1:1),") "),r="rotate(".concat(a.rotate," 0 0)"),m={transform:"".concat(t," ").concat(z," ").concat(r)},M={transform:"translate(".concat(n/2*-1," -256)")},L={outer:o,inner:m,path:M};return{tag:"g",attributes:i({},L.outer),children:[{tag:"g",attributes:i({},L.inner),children:[{tag:s.icon.tag,children:s.icon.children,attributes:i(i({},s.icon.attributes),L.path)}]}]}}}},C2={x:0,y:0,width:"100%",height:"100%"};function T1(c){let l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return c.attributes&&(c.attributes.fill||l)&&(c.attributes.fill="black"),c}function M0(c){return c.tag==="g"?c.children:[c]}var p0={hooks(){return{parseNodeAttributes(c,l){let s=l.getAttribute("data-fa-mask"),a=s?i2(s.split(" ").map(e=>e.trim())):e3();return a.prefix||(a.prefix=F()),c.mask=a,c.maskId=l.getAttribute("data-fa-mask-id"),c}}},provides(c){c.generateAbstractMask=function(l){let{children:s,attributes:a,main:e,mask:n,maskId:o,transform:t}=l,{width:z,icon:r}=e,{width:m,icon:M}=n,L=i4({transform:t,containerWidth:m,iconWidth:z}),u={tag:"rect",attributes:i(i({},C2),{},{fill:"white"})},A=r.children?{children:r.children.map(T1)}:{},B={tag:"g",attributes:i({},L.inner),children:[T1(i({tag:r.tag,attributes:i(i({},r.attributes),L.path)},A))]},x={tag:"g",attributes:i({},L.outer),children:[B]},S="mask-".concat(o||Y()),d="clip-".concat(o||Y()),g={tag:"mask",attributes:i(i({},C2),{},{id:S,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[u,x]},I={tag:"defs",children:[{tag:"clipPath",attributes:{id:d},children:M0(M)},g]};return s.push(I,{tag:"rect",attributes:i({fill:"currentColor","clip-path":"url(#".concat(d,")"),mask:"url(#".concat(S,")")},C2)}),{children:s,attributes:a}}}},C0={provides(c){let l=!1;T.matchMedia&&(l=T.matchMedia("(prefers-reduced-motion: reduce)").matches),c.missingIconAbstract=function(){let s=[],a={fill:"currentColor"},e={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};s.push({tag:"path",attributes:i(i({},a),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});let n=i(i({},e),{},{attributeName:"opacity"}),o={tag:"circle",attributes:i(i({},a),{},{cx:"256",cy:"364",r:"28"}),children:[]};return l||o.children.push({tag:"animate",attributes:i(i({},e),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:i(i({},n),{},{values:"1;0;1;1;0;1;"})}),s.push(o),s.push({tag:"path",attributes:i(i({},a),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:l?[]:[{tag:"animate",attributes:i(i({},n),{},{values:"1;0;0;0;0;1;"})}]}),l||s.push({tag:"path",attributes:i(i({},a),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:i(i({},n),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:s}}}},u0={hooks(){return{parseNodeAttributes(c,l){let s=l.getAttribute("data-fa-symbol"),a=s===null?!1:s===""?!0:s;return c.symbol=a,c}}}},d0=[r4,l0,s0,a0,e0,z0,m0,L0,p0,C0,u0];A4(d0,{mixoutsTo:h});var E0=h.noAuto,z3=h.config,H0=h.library,m3=h.dom,L3=h.parse,I0=h.findIconDefinition,O0=h.toHtml,M3=h.icon,U0=h.layer,h0=h.text,x0=h.counter;var g0=["*"],N0=c=>{throw new Error(`Could not find icon with iconName=${c.iconName} and prefix=${c.prefix} in the icon library.`)},b0=()=>{throw new Error("Property `icon` is required for `fa-icon`/`fa-duotone-icon` components.")},C3=c=>c!=null&&(c===90||c===180||c===270||c==="90"||c==="180"||c==="270"),S0=c=>{let l=C3(c.rotate),s={[`fa-${c.animation}`]:c.animation!=null&&!c.animation.startsWith("spin"),"fa-spin":c.animation==="spin"||c.animation==="spin-reverse","fa-spin-pulse":c.animation==="spin-pulse"||c.animation==="spin-pulse-reverse","fa-spin-reverse":c.animation==="spin-reverse"||c.animation==="spin-pulse-reverse","fa-pulse":c.animation==="spin-pulse"||c.animation==="spin-pulse-reverse","fa-fw":c.fixedWidth,"fa-border":c.border,"fa-inverse":c.inverse,"fa-layers-counter":c.counter,"fa-flip-horizontal":c.flip==="horizontal"||c.flip==="both","fa-flip-vertical":c.flip==="vertical"||c.flip==="both",[`fa-${c.size}`]:c.size!==null,[`fa-rotate-${c.rotate}`]:l,"fa-rotate-by":c.rotate!=null&&!l,[`fa-pull-${c.pull}`]:c.pull!==null,[`fa-stack-${c.stackItemSize}`]:c.stackItemSize!=null};return Object.keys(s).map(a=>s[a]?a:null).filter(a=>a)},j2=new WeakSet,p3="fa-auto-css";function w0(c,l){if(!l.autoAddCss||j2.has(c))return;if(c.getElementById(p3)!=null){l.autoAddCss=!1,j2.add(c);return}let s=c.createElement("style");s.setAttribute("type","text/css"),s.setAttribute("id",p3),s.innerHTML=m3.css();let a=c.head.childNodes,e=null;for(let n=a.length-1;n>-1;n--){let o=a[n],t=o.nodeName.toUpperCase();["STYLE","LINK"].indexOf(t)>-1&&(e=o)}c.head.insertBefore(s,e),l.autoAddCss=!1,j2.add(c)}var y0=c=>c.prefix!==void 0&&c.iconName!==void 0,k0=(c,l)=>y0(c)?c:Array.isArray(c)&&c.length===2?{prefix:c[0],iconName:c[1]}:{prefix:l,iconName:c},A0=(()=>{class c{constructor(){this.defaultPrefix="fas",this.fallbackIcon=null,this._autoAddCss=!0}set autoAddCss(s){z3.autoAddCss=s,this._autoAddCss=s}get autoAddCss(){return this._autoAddCss}static{this.\u0275fac=function(a){return new(a||c)}}static{this.\u0275prov=r2({token:c,factory:c.\u0275fac,providedIn:"root"})}}return c})(),v0=(()=>{class c{constructor(){this.definitions={}}addIcons(...s){for(let a of s){a.prefix in this.definitions||(this.definitions[a.prefix]={}),this.definitions[a.prefix][a.iconName]=a;for(let e of a.icon[2])typeof e=="string"&&(this.definitions[a.prefix][e]=a)}}addIconPacks(...s){for(let a of s){let e=Object.keys(a).map(n=>a[n]);this.addIcons(...e)}}getIconDefinition(s,a){return s in this.definitions&&a in this.definitions[s]?this.definitions[s][a]:null}static{this.\u0275fac=function(a){return new(a||c)}}static{this.\u0275prov=r2({token:c,factory:c.\u0275fac,providedIn:"root"})}}return c})(),P0=(()=>{class c{constructor(){this.stackItemSize="1x"}ngOnChanges(s){if("size"in s)throw new Error('fa-icon is not allowed to customize size when used inside fa-stack. Set size on the enclosing fa-stack instead: <fa-stack size="4x">...</fa-stack>.')}static{this.\u0275fac=function(a){return new(a||c)}}static{this.\u0275dir=J2({type:c,selectors:[["fa-icon","stackItemSize",""],["fa-duotone-icon","stackItemSize",""]],inputs:{stackItemSize:"stackItemSize",size:"size"},features:[Q]})}}return c})(),T0=(()=>{class c{constructor(s,a){this.renderer=s,this.elementRef=a}ngOnInit(){this.renderer.addClass(this.elementRef.nativeElement,"fa-stack")}ngOnChanges(s){"size"in s&&(s.size.currentValue!=null&&this.renderer.addClass(this.elementRef.nativeElement,`fa-${s.size.currentValue}`),s.size.previousValue!=null&&this.renderer.removeClass(this.elementRef.nativeElement,`fa-${s.size.previousValue}`))}static{this.\u0275fac=function(a){return new(a||c)(v(K2),v(X2))}}static{this.\u0275cmp=z2({type:c,selectors:[["fa-stack"]],inputs:{size:"size"},features:[Q],ngContentSelectors:g0,decls:1,vars:0,template:function(a,e){a&1&&(l1(),s1(0))},encapsulation:2})}}return c})(),a6=(()=>{class c{constructor(s,a,e,n,o){this.sanitizer=s,this.config=a,this.iconLibrary=e,this.stackItem=n,this.document=Y2(a1),o!=null&&n==null&&console.error('FontAwesome: fa-icon and fa-duotone-icon elements must specify stackItemSize attribute when wrapped into fa-stack. Example: <fa-icon stackItemSize="2x"></fa-icon>.')}ngOnChanges(s){if(this.icon==null&&this.config.fallbackIcon==null){b0();return}if(s){let a=this.findIconDefinition(this.icon??this.config.fallbackIcon);if(a!=null){let e=this.buildParams();w0(this.document,this.config);let n=M3(a,e);this.renderedIconHTML=this.sanitizer.bypassSecurityTrustHtml(n.html.join(`
`))}}}render(){this.ngOnChanges({})}findIconDefinition(s){let a=k0(s,this.config.defaultPrefix);if("icon"in a)return a;let e=this.iconLibrary.getIconDefinition(a.prefix,a.iconName);return e??(N0(a),null)}buildParams(){let s={flip:this.flip,animation:this.animation,border:this.border,inverse:this.inverse,size:this.size||null,pull:this.pull||null,rotate:this.rotate||null,fixedWidth:typeof this.fixedWidth=="boolean"?this.fixedWidth:this.config.fixedWidth,stackItemSize:this.stackItem!=null?this.stackItem.stackItemSize:null},a=typeof this.transform=="string"?L3.transform(this.transform):this.transform,e={};return s.rotate!=null&&!C3(s.rotate)&&(e["--fa-rotate-angle"]=`${s.rotate}`),{title:this.title,transform:a,classes:S0(s),mask:this.mask!=null?this.findIconDefinition(this.mask):null,symbol:this.symbol,attributes:{role:this.a11yRole},styles:e}}static{this.\u0275fac=function(a){return new(a||c)(v(e1),v(A0),v(v0),v(P0,8),v(T0,8))}}static{this.\u0275cmp=z2({type:c,selectors:[["fa-icon"]],hostAttrs:[1,"ng-fa-icon"],hostVars:2,hostBindings:function(a,e){a&2&&(c1("innerHTML",e.renderedIconHTML,$2),Z2("title",e.title))},inputs:{icon:"icon",title:"title",animation:"animation",mask:"mask",flip:"flip",size:"size",pull:"pull",border:"border",inverse:"inverse",symbol:"symbol",rotate:"rotate",fixedWidth:"fixedWidth",transform:"transform",a11yRole:"a11yRole"},features:[Q],decls:0,vars:0,template:function(a,e){},encapsulation:2})}}return c})();var e6=(()=>{class c{static{this.\u0275fac=function(a){return new(a||c)}}static{this.\u0275mod=Q2({type:c})}static{this.\u0275inj=V2({})}}return c})();var o6={prefix:"fas",iconName:"calendar-days",icon:[448,512,["calendar-alt"],"f073","M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z"]};var i6={prefix:"fas",iconName:"paw",icon:[512,512,[],"f1b0","M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5l0 1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3l0-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"]};var t6={prefix:"fas",iconName:"notes-medical",icon:[512,512,[],"f481","M96 352L96 96c0-35.3 28.7-64 64-64l256 0c35.3 0 64 28.7 64 64l0 197.5c0 17-6.7 33.3-18.7 45.3l-58.5 58.5c-12 12-28.3 18.7-45.3 18.7L160 416c-35.3 0-64-28.7-64-64zM272 128c-8.8 0-16 7.2-16 16l0 48-48 0c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l48 0 0 48c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-48 48 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-48 0 0-48c0-8.8-7.2-16-16-16l-32 0zm24 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-160 0C60.9 512 0 451.1 0 376L0 152c0-13.3 10.7-24 24-24s24 10.7 24 24l0 224c0 48.6 39.4 88 88 88l160 0z"]};var f6={prefix:"fas",iconName:"user",icon:[448,512,[128100,62144],"f007","M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"]};var r6={prefix:"fas",iconName:"camera-retro",icon:[512,512,[128247],"f083","M220.6 121.2L271.1 96 448 96l0 96-114.8 0c-21.9-15.1-48.5-24-77.2-24s-55.2 8.9-77.2 24L64 192l0-64 128 0c9.9 0 19.7-2.3 28.6-6.8zM0 128L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L271.1 32c-9.9 0-19.7 2.3-28.6 6.8L192 64l-32 0 0-16c0-8.8-7.2-16-16-16L80 32c-8.8 0-16 7.2-16 16l0 16C28.7 64 0 92.7 0 128zM168 304a88 88 0 1 1 176 0 88 88 0 1 1 -176 0z"]};var z6={prefix:"fas",iconName:"envelope",icon:[512,512,[128386,9993,61443],"f0e0","M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"]};var m6={prefix:"fas",iconName:"shield-cat",icon:[512,512,[],"e572","M269.4 2.9C265.2 1 260.7 0 256 0s-9.2 1-13.4 2.9L54.3 82.8c-22 9.3-38.4 31-38.3 57.2c.5 99.2 41.3 280.7 213.6 363.2c16.7 8 36.1 8 52.8 0C454.7 420.7 495.5 239.2 496 140c.1-26.2-16.3-47.9-38.3-57.2L269.4 2.9zM160 154.4c0-5.8 4.7-10.4 10.4-10.4l.2 0c3.4 0 6.5 1.6 8.5 4.3l40 53.3c3 4 7.8 6.4 12.8 6.4l48 0c5 0 9.8-2.4 12.8-6.4l40-53.3c2-2.7 5.2-4.3 8.5-4.3l.2 0c5.8 0 10.4 4.7 10.4 10.4L352 272c0 53-43 96-96 96s-96-43-96-96l0-117.6zM216 288a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm96-16a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z"]};var L6={prefix:"fas",iconName:"store",icon:[576,512,[],"f54e","M547.6 103.8L490.3 13.1C485.2 5 476.1 0 466.4 0L109.6 0C99.9 0 90.8 5 85.7 13.1L28.3 103.8c-29.6 46.8-3.4 111.9 51.9 119.4c4 .5 8.1 .8 12.1 .8c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.2 0 49.3-11.4 65.2-29c16 17.6 39.1 29 65.2 29c4.1 0 8.1-.3 12.1-.8c55.5-7.4 81.8-72.5 52.1-119.4zM499.7 254.9c0 0 0 0-.1 0c-5.3 .7-10.7 1.1-16.2 1.1c-12.4 0-24.3-1.9-35.4-5.3L448 384l-320 0 0-133.4c-11.2 3.5-23.2 5.4-35.6 5.4c-5.5 0-11-.4-16.3-1.1l-.1 0c-4.1-.6-8.1-1.3-12-2.3L64 384l0 64c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-64 0-131.4c-4 1-8 1.8-12.3 2.3z"]};var M6={prefix:"fas",iconName:"check",icon:[448,512,[10003,10004],"f00c","M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"]};var F0=(s=>(s.User="user",s.Vet="vet",s))(F0||{});export{v0 as a,a6 as b,e6 as c,o6 as d,i6 as e,t6 as f,f6 as g,r6 as h,z6 as i,m6 as j,L6 as k,M6 as l,F0 as m};
