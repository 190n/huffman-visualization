import{u as W}from"./vendor.72fe9b6a.js";const G=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function A(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerpolicy&&(i.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?i.credentials="include":n.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(n){if(n.ep)return;n.ep=!0;const i=A(n);fetch(n.href,i)}};G();const v={7:"'\\a'",8:"'\\b'",9:"'\\t'",10:"'\\n'",11:"'\\v'",12:"'\\f'",13:"'\\r'",39:"'\\''",92:"'\\\\'"};function N(e){return v.hasOwnProperty(e)?v[e]:32<=e&&e<=126?`'${String.fromCharCode(e)}'`:e<16?`0x0${e.toString(16)}`:`0x${e.toString(16)}`}var I={fonts:{ui:'"IBM Plex Sans", sans-serif',mono:'"Ubuntu Mono", monospace'},colors:{fg:"black",bg:"white",blue:"#4060ff",blue50:"#0000ff80",blue25:"#0000ff40",blue25Opaque:"#c0c0ff",tr:"white",trHover:"#d0d0d0",trZebra:"#e0e0e0",trZebraHover:"#b0b0b0",modalCover:"#00000080",lightGray:"#e0e0e0",buttonBottom:"black",buttonHover:"#00000020",buttonActive:"#00000040"}};function M(e){const t=W.encode(e),A=new Map;A.set(0,1),A.set(255,1);for(let o=0;o<t.length;o+=1){const n=t.charCodeAt(o);A.has(n)?A.set(n,A.get(n)+1):A.set(n,1)}return A}function q(e,t,A,o){t.replaceChildren();const n=[...e.keys()].sort((i,s)=>e.get(s)-e.get(i));for(const i of n){const s=document.createElement("tr"),g=document.createElement("td"),r=document.createElement("td");s.appendChild(g),s.appendChild(r),g.textContent=N(i),r.textContent=e.get(i).toString();const l=e.get(i)/e.get(n[0]);r.style.boxShadow=`-${l*A}px 0 ${I.colors.blue25} inset`,t.appendChild(s),o&&s.addEventListener("pointerover",()=>o(i),!1)}}var H=async(e={},t)=>{let A;if(t.startsWith("data:")){const o=atob(t.replace(/^data:.*?base64,/,"")),n=new Uint8Array(o.length);for(let i=0;i<o.length;i++)n[i]=o.charCodeAt(i);A=await WebAssembly.instantiate(n,e)}else{const o=await fetch(t),n=o.headers.get("Content-Type")||"";if("instantiateStreaming"in WebAssembly&&n.startsWith("application/wasm"))A=await WebAssembly.instantiateStreaming(o,e);else{const i=await o.arrayBuffer();A=await WebAssembly.instantiate(i,e)}}return A.instance.exports},T=e=>H(e,"data:application/wasm;base64,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");function y(e,t){const A=new Uint32Array(e,t,4),o=A[0]?y(e,A[0]):void 0,n=A[1]?y(e,A[1]):void 0,i=A[2],s=A[3];return{left:o,right:n,symbol:i,frequency:s}}const C=56,u=40;async function X(e){var i;const t=[],A=await T({env:{save_tree_snapshot(s,g){const r=new Uint32Array(A.memory.buffer,s,g),l=[];for(let a=0;a<g;a+=1)l.push(y(A.memory.buffer,r[a]));t.push(l)}}}),o=A.calloc(256,4),n=new Uint32Array(A.memory.buffer,o,256);for(let s=0;s<256;s+=1)n[s]=(i=e.get(s))!=null?i:0;return A.build_tree(o),t}function c(e){return e.left&&e.right?1+Math.max(c(e.left),c(e.right)):e.left?1+c(e.left):e.right?1+c(e.right):1}function P(e){let t=.5;for(const A in e){const o=e[A],n=2**(-A-2);o==0?t-=n:t+=n}return t}function*B(e,t=[]){e.left&&(yield*B(e.left,[...t,0])),e.right&&(yield*B(e.right,[...t,1])),yield[e,t]}function D(e,t,A){return[P(e)*(t-C)+C/2,e.length*A+u/2]}var S;(function(e){e[e.None=0]="None",e[e.Normal=1]="Normal",e[e.Highlighted=2]="Highlighted"})(S||(S={}));function k(e,t,A,o,n,i=1,s=!1){const[g,r]=D(A,n,o);if(A.length>0&&i!=0){const l=A.slice(0,-1),[a,w]=D(l,n,o);e.beginPath(),[e.strokeStyle,e.lineWidth]=i==2?[I.colors.blue,3]:[I.colors.fg,0],e.moveTo(a,w),e.lineTo(g,r),e.stroke(),e.closePath()}e.beginPath(),[e.fillStyle,e.strokeStyle,e.lineWidth]=s?[I.colors.blue25Opaque,I.colors.blue,3]:[I.colors.bg,I.colors.fg,1],e.rect(g-C/2,r-u/2,C,u),e.fill(),e.stroke(),e.closePath(),e.fillStyle=I.colors.fg,e.font=`16px ${I.fonts.mono}`,e.textBaseline="middle",e.textAlign="center",t.left||t.right?e.fillText(t.frequency.toString(),g,r):(e.fillText(N(t.symbol),g,r-8),e.fillText(t.frequency.toString(),g,r+8))}function Z(e,t){for(const[{symbol:A},o]of B(e))if(A==t)return o}function j(e,t,A){const o=e.canvas.width/window.devicePixelRatio,n=e.canvas.height/window.devicePixelRatio,i=Math.min((n-u)/(c(t)-1),80);let s,g;const r=typeof A=="number"?Z(t,A):void 0;for(const[l,a]of B(t)){l.symbol==A&&!l.left&&!l.right&&(s=l,g=a);const w=r?a.every((K,Y)=>r[Y]==K):!1;k(e,l,a,i,o,w?2:1)}s&&g&&k(e,s,g,i,o,0,!0)}function O(e,t,A){e.clearRect(0,0,e.canvas.width,e.canvas.height),e.resetTransform(),e.scale(window.devicePixelRatio,window.devicePixelRatio),e.translate(-C*t.length/2,0);for(const o of t)e.translate(C,0),j(e,o,A)}const R=document.getElementById("input"),b=document.getElementById("histogram"),d=document.getElementById("huffman"),z=d.getContext("2d"),h=document.getElementById("scrubber"),Q=document.getElementById("howto-container");let m,f=0;function E(e){const t=d.parentElement.clientWidth,A=d.parentElement.clientHeight;d.width=t*window.devicePixelRatio,d.height=A*window.devicePixelRatio,d.style.width=`${t}px`,d.style.height=`${A}px`,m&&O(z,m[f],e)}async function L(e){const t=M(R.value);q(t,b,e,A=>E(A)),m=await X(t),f=m.length-1,h.max=f.toString(),h.value=f.toString(),E()}const p=document.createElement("tr"),F=document.createElement("td"),U=document.createElement("td");p.appendChild(F);p.appendChild(U);b.appendChild(p);const J=F.getClientRects()[0].width;R.addEventListener("input",()=>L(J),!1);b.addEventListener("pointerout",()=>E(),!1);L(J);window.addEventListener("resize",()=>E(),!1);h.addEventListener("mousemove",()=>{f=parseInt(h.value),E()},!1);document.getElementById("close").addEventListener("click",()=>{Q.classList.remove("visible")},!1);document.getElementById("dont-show").addEventListener("click",()=>{Q.classList.remove("visible"),window.localStorage.setItem("dont-show-howto","true")},!1);document.getElementById("show-howto").addEventListener("click",()=>{Q.classList.add("visible"),window.localStorage.removeItem("dont-show-howto")},!1);window.localStorage.getItem("dont-show-howto")||Q.classList.add("visible");
