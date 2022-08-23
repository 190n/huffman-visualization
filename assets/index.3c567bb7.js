import{u as V}from"./vendor.2fabef96.js";const j=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const g of i.addedNodes)g.tagName==="LINK"&&g.rel==="modulepreload"&&o(g)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerpolicy&&(i.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?i.credentials="include":n.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}};j();const J={7:"'\\a'",8:"'\\b'",9:"'\\t'",10:"'\\n'",11:"'\\v'",12:"'\\f'",13:"'\\r'",39:"'\\''",92:"'\\\\'"};function N(A){return J.hasOwnProperty(A)?J[A]:32<=A&&A<=126?`'${String.fromCharCode(A)}'`:A<16?`0x0${A.toString(16)}`:`0x${A.toString(16)}`}var d={fonts:{ui:'"IBM Plex Sans", sans-serif',mono:'"Ubuntu Mono", monospace'},colors:{fg:"black",bg:"white",blue:"#4060ff",blue50:"#0000ff80",blue25:"#0000ff40",blue25Opaque:"#c0c0ff",tr:"white",trHover:"#d0d0d0",trZebra:"#e0e0e0",trZebraHover:"#b0b0b0",modalCover:"#00000080",lightGray:"#e0e0e0",buttonBottom:"#00000080",buttonHover:"#00000020",buttonActive:"#00000040"}};function _(A){const e=V.encode(A),t=new Map;t.set(0,1),t.set(255,1);for(let o=0;o<e.length;o+=1){const n=e.charCodeAt(o);t.has(n)?t.set(n,t.get(n)+1):t.set(n,1)}return t}function AA(A,e,t,o){e.replaceChildren();const n=[...A.keys()].sort((i,g)=>A.get(g)-A.get(i));for(const i of n){const g=document.createElement("tr"),s=document.createElement("td"),r=document.createElement("td");g.appendChild(s),g.appendChild(r),s.textContent=N(i),r.textContent=A.get(i).toString();const I=A.get(i)/A.get(n[0]);r.style.boxShadow=`-${I*t}px 0 ${d.colors.blue25} inset`,e.appendChild(g),o&&g.addEventListener("pointerover",()=>o(i),!1)}}var eA=async(A={},e)=>{let t;if(e.startsWith("data:")){const o=atob(e.replace(/^data:.*?base64,/,"")),n=new Uint8Array(o.length);for(let i=0;i<o.length;i++)n[i]=o.charCodeAt(i);t=await WebAssembly.instantiate(n,A)}else{const o=await fetch(e),n=o.headers.get("Content-Type")||"";if("instantiateStreaming"in WebAssembly&&n.startsWith("application/wasm"))t=await WebAssembly.instantiateStreaming(o,A);else{const i=await o.arrayBuffer();t=await WebAssembly.instantiate(i,A)}}return t.instance.exports},tA=A=>eA(A,"data:application/wasm;base64,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");function S(A,e){const t=new Uint32Array(A,e,4),o=t[0]?S(A,t[0]):void 0,n=t[1]?S(A,t[1]):void 0,i=t[2]&255,g=t[3];return{left:o,right:n,symbol:i,frequency:g}}const B=56,p=40;async function nA(A){var i;const e=[],t=await tA({env:{saveTreeSnapshot(g,s){const r=new Uint32Array(t.memory.buffer,g,s),I=[];for(let l=0;l<s;l+=1)I.push(S(t.memory.buffer,r[l]));e.push(I)}}}),o=t.histogram.value,n=new Uint32Array(t.memory.buffer,o,256);for(let g=0;g<256;g+=1)n[g]=(i=A.get(g))!=null?i:0;return t.buildTree(o),e}function h(A){return A.left&&A.right?1+Math.max(h(A.left),h(A.right)):A.left?1+h(A.left):A.right?1+h(A.right):1}function Y(A){let e=.5;for(const t in A){const o=A[t],n=2**(-t-2);o==0?e-=n:e+=n}return e}function*v(A,e=[]){A.left&&(yield*v(A.left,[...e,0])),A.right&&(yield*v(A.right,[...e,1])),yield[A,e]}function R(A,e,t){return[Y(A)*(e-B-6)+B/2+3,A.length*t+p/2+3]}var F;(function(A){A[A.None=0]="None",A[A.Normal=1]="Normal",A[A.Highlighted=2]="Highlighted"})(F||(F={}));function K(A,e,t,o,n,i=1,g=!1){const[s,r]=R(t,n,o);if(t.length>0&&i!=0){const I=t.slice(0,-1),[l,m]=R(I,n,o);A.beginPath(),[A.strokeStyle,A.lineWidth]=i==2?[d.colors.blue,3]:[d.colors.fg,1],A.moveTo(l,m),A.lineTo(s,r),A.stroke(),A.closePath()}A.beginPath(),[A.fillStyle,A.strokeStyle,A.lineWidth]=g?[d.colors.blue25Opaque,d.colors.blue,3]:[d.colors.bg,d.colors.fg,1],A.rect(s-B/2,r-p/2,B,p),A.fill(),A.stroke(),A.closePath(),A.fillStyle=d.colors.fg,A.font=`16px ${d.fonts.mono}`,A.textBaseline="middle",A.textAlign="center",e.left||e.right?A.fillText(e.frequency.toString(),s,r):(A.fillText(N(e.symbol),s,r-8),A.fillText(e.frequency.toString(),s,r+8))}function iA(A,e){for(const[{symbol:t},o]of v(A))if(t==e)return o}function oA(A,e,t){const o=A.canvas.width/window.devicePixelRatio,n=A.canvas.height/window.devicePixelRatio,i=Math.min((n-p-6)/(h(e)-1),80);let g,s;const r=typeof t=="number"?iA(e,t):void 0;let I=1/0,l=-1/0;for(const[u,w]of v(e)){u.symbol==t&&!u.left&&!u.right&&(g=u,s=w);const x=r?w.every((z,$)=>r[$]==z):!1;K(A,u,w,i,o,x?2:1);const y=Y(w);y<I&&(I=y),y>l&&(l=y)}g&&s&&K(A,g,s,i,o,0,!0),I*=o,l*=o;let m=I-B/2-3,L=0,q=l-I+B+6,G=n;return m*=window.devicePixelRatio,L*=window.devicePixelRatio,q*=window.devicePixelRatio,G*=window.devicePixelRatio,{image:A.getImageData(m,L,q,G),rootFrequency:e.frequency}}function gA(A,e,t){const o=e.map(g=>(A.resetTransform(),A.clearRect(0,0,A.canvas.width,A.canvas.height),A.scale(window.devicePixelRatio,window.devicePixelRatio),oA(A,g,t))).sort((g,s)=>g.rootFrequency-s.rootFrequency),n=o.reduce((g,s)=>g+s.image.width,0);A.canvas.width=n,A.canvas.style.width=`${n/window.devicePixelRatio}px`,A.resetTransform(),A.clearRect(0,0,A.canvas.width,A.canvas.height);let i=0;for(const{image:g}of o)A.putImageData(g,i,0),i+=g.width}const M=document.getElementById("input"),k=document.getElementById("histogram"),f=document.getElementById("huffman"),sA=f.getContext("2d"),C=document.getElementById("scrubber"),Q=document.getElementById("howto-container");let E,a=0;function c(A){const e=f.parentElement.clientWidth,t=f.parentElement.clientHeight;f.width=e*window.devicePixelRatio,f.height=t*window.devicePixelRatio,f.style.width=`${e}px`,f.style.height=`${t}px`,E&&gA(sA,E[a],A)}async function W(A){const e=_(M.value);AA(e,k,A,t=>c(t)),E=await nA(e),a=E.length-1,C.max=a.toString(),C.value=a.toString(),c()}const D=document.createElement("tr"),P=document.createElement("td"),rA=document.createElement("td");D.appendChild(P);D.appendChild(rA);k.appendChild(D);const T=P.getClientRects()[0].width;M.addEventListener("input",()=>W(T),!1);k.addEventListener("pointerout",()=>c(),!1);W(T);window.addEventListener("resize",()=>c(),!1);function X(){a=parseInt(C.value),c()}C.addEventListener("mousemove",X,!1);C.addEventListener("change",X,!1);document.getElementById("close").addEventListener("click",()=>{Q.classList.remove("visible")},!1);document.getElementById("dont-show").addEventListener("click",()=>{Q.classList.remove("visible"),window.localStorage.setItem("dont-show-howto","true")},!1);document.getElementById("show-howto").addEventListener("click",()=>{Q.classList.add("visible"),window.localStorage.removeItem("dont-show-howto")},!1);window.localStorage.getItem("dont-show-howto")||Q.classList.add("visible");document.addEventListener("keyup",A=>{A.key=="Escape"&&Q.classList.remove("visible")},!1);function H(){a=0,C.value="0",c()}function O(){a=Math.max(0,a-1),C.value=a.toString(),c()}function U(){a=Math.min(E.length-1,a+1),C.value=a.toString(),c()}function Z(){a=E.length-1,C.value=a.toString(),c()}function b(A,e){(e.key=="Enter"||e.key==" ")&&A()}document.getElementById("to-start").addEventListener("click",H,!1);document.getElementById("to-start").addEventListener("keypress",b.bind(null,H),!1);document.getElementById("step-back").addEventListener("click",O,!1);document.getElementById("step-back").addEventListener("keypress",b.bind(null,O),!1);document.getElementById("step-forward").addEventListener("click",U,!1);document.getElementById("step-forward").addEventListener("keypress",b.bind(null,U),!1);document.getElementById("to-end").addEventListener("click",Z,!1);document.getElementById("to-end").addEventListener("keypress",b.bind(null,Z),!1);