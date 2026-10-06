var cart=JSON.parse(sessionStorage.getItem("mp-cart")||"[]"),current=null,grid=document.getElementById("grid");
function render(filter){var out="";products.forEach(function(p,i){if(filter!=="Todos"&&p.cat!==filter)return;out+='<article class="card" data-i="'+i+'"><div class="card-media"><img src="'+p.img+'" alt="'+p.name+'" loading="lazy"></div><div class="card-body"><div class="tag">'+p.cat+'</div><h3>'+p.name+'</h3><p>Consultar disponibilidade</p></div></article>'});grid.innerHTML=out;initProduct3D();if(window.scrollRevealObserver)initScrollReveal(grid)}
function save(){sessionStorage.setItem("mp-cart",JSON.stringify(cart));renderCart();document.getElementById("cartCount").textContent=cart.reduce(function(s,x){return s+x.qty},0)}
function renderCart(){var el=document.getElementById("cartItems");if(!cart.length){el.innerHTML='<div class="empty">Seu carrinho está vazio.<br>Escolha algumas peças para começar.</div>';return}var out="";cart.forEach(function(x,i){out+='<div class="cart-item"><img src="'+x.img+'" alt=""><div><b>'+x.name+'</b><div class="small">'+x.cat+'</div><div class="qty"><button data-act="minus" data-i="'+i+'">−</button><span>'+x.qty+'</span><button data-act="plus" data-i="'+i+'">+</button></div></div><button class="close" data-act="remove" data-i="'+i+'">×</button></div>'});el.innerHTML=out}
grid.addEventListener("click",function(e){var c=e.target.closest(".card");if(!c)return;current=products[Number(c.dataset.i)];document.getElementById("pmImage").src=current.img;document.getElementById("pmName").textContent=current.name;document.getElementById("pmTag").textContent=current.cat;document.getElementById("pmDesc").textContent=current.desc;document.getElementById("productOverlay").classList.add("show")});
document.querySelectorAll(".filter").forEach(function(b){b.onclick=function(){document.querySelectorAll(".filter").forEach(function(x){x.classList.remove("active")});b.classList.add("active");render(b.dataset.filter)}});
document.getElementById("addProduct").onclick=function(){var old=cart.find(function(x){return x.name===current.name});if(old)old.qty++;else cart.push({name:current.name,cat:current.cat,img:current.img,qty:1});save();document.getElementById("productOverlay").classList.remove("show");document.getElementById("cartOverlay").classList.add("show")};
document.getElementById("cartBtn").onclick=function(){document.getElementById("cartOverlay").classList.add("show")};document.getElementById("closeCart").onclick=function(){document.getElementById("cartOverlay").classList.remove("show")};document.getElementById("closeProduct").onclick=function(){document.getElementById("productOverlay").classList.remove("show")};
document.getElementById("cartOverlay").addEventListener("click",function(e){var b=e.target.closest("[data-act]");if(!b)return;var i=Number(b.dataset.i),a=b.dataset.act;if(a==="plus")cart[i].qty++;if(a==="minus"){cart[i].qty--;if(cart[i].qty<1)cart.splice(i,1)}if(a==="remove")cart.splice(i,1);save()});
document.getElementById("clearCart").onclick=function(){cart=[];save()};
document.getElementById("sendOrder").onclick=function(){if(!cart.length)return;var lines=cart.map(function(x){return "• "+x.name+" — quantidade: "+x.qty}).join("\n");var msg="Olá! Quero fazer um pedido na MP Boutique:\n\n"+lines+"\n\nGostaria de confirmar disponibilidade, tamanhos, cores e valores.";window.open("https://wa.me/559182777239?text="+encodeURIComponent(msg),"_blank")};
document.getElementById("year").textContent=new Date().getFullYear();render("Todos");save();

function initProduct3D(){
  if(!window.matchMedia("(hover:hover) and (pointer:fine)").matches)return;
  document.querySelectorAll(".card").forEach(function(card){
    card.addEventListener("mousemove",function(e){
      var r=card.getBoundingClientRect();
      var x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
      var ry=(x-.5)*10, rx=(.5-y)*10;
      card.style.setProperty("--mx",(x*100)+"%");
      card.style.setProperty("--my",(y*100)+"%");
      card.style.transform="perspective(900px) rotateX("+rx+"deg) rotateY("+ry+"deg) translateY(-7px)";
    });
    card.addEventListener("mouseleave",function(){
      card.style.transform="";
      card.style.removeProperty("--mx");
      card.style.removeProperty("--my");
    });
  });
}


function initHero3D(){
  var stage=document.getElementById("heroStage");
  if(!stage||!window.matchMedia("(hover:hover) and (pointer:fine)").matches||window.matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  var photo=stage.querySelector(".hero-photo");
  stage.addEventListener("mousemove",function(e){
    var r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    photo.style.transform="rotateY("+(-5+x*9)+"deg) rotateX("+(2-y*7)+"deg) translate3d("+(x*8)+"px,"+(y*8)+"px,12px)";
  });
  stage.addEventListener("mouseleave",function(){photo.style.transform=""});
}
initHero3D();


function initHeroCarousel(){
  var box=document.getElementById("heroSlides"),dots=document.getElementById("heroProgress"),prev=document.getElementById("heroPrev"),next=document.getElementById("heroNext");
  if(!box||!products||!products.length)return;
  var slides=products.map(function(p){return {img:p.img,name:p.name}});
  var seen={},unique=slides.filter(function(s){if(seen[s.img])return false;seen[s.img]=true;return true}),index=0,busy=false,touchX=0;
  box.innerHTML=unique.map(function(s,i){return '<img class="hero-slide'+(i===0?' active':'')+'" src="'+s.img+'" alt="'+s.name+'" '+(i?'loading="lazy"':'')+'>'}).join("");
  dots.innerHTML=unique.map(function(_,i){return '<button type="button" class="hero-dot'+(i===0?' active':'')+'" data-slide="'+i+'" aria-label="Ir para foto '+(i+1)+'"></button>'}).join("");
  var els=box.querySelectorAll(".hero-slide"),ds=dots.querySelectorAll(".hero-dot");
  function go(n){
    if(busy||n===index)return;busy=true;var old=index;index=(n+unique.length)%unique.length;
    els[old].classList.remove("active");els[old].classList.add("leaving");els[index].classList.add("active");
    ds[old].classList.remove("active");ds[index].classList.add("active");
    setTimeout(function(){els[old].classList.remove("leaving");busy=false},720);
  }
  prev.addEventListener("click",function(e){e.stopPropagation();go(index-1)});
  next.addEventListener("click",function(e){e.stopPropagation();go(index+1)});
  dots.addEventListener("click",function(e){var d=e.target.closest("[data-slide]");if(d)go(Number(d.dataset.slide))});
  box.addEventListener("touchstart",function(e){touchX=e.changedTouches[0].clientX},{passive:true});
  box.addEventListener("touchend",function(e){var dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>45)go(index+(dx<0?1:-1))},{passive:true});
}
initHeroCarousel();


function initScrollReveal(root){
  if(window.matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  var scope=root||document,selectors=root?".card":".section-head > *, .filters, .editorial > *, #contato .cta, footer .foot > *";
  var items=scope.querySelectorAll(selectors);
  items.forEach(function(el,i){
    if(el.dataset.revealReady)return;
    el.dataset.revealReady="1";el.classList.add("reveal-scroll");
    if(!root&&i%3===0)el.classList.add("reveal-left");
    else if(!root&&i%3===1)el.classList.add("reveal-right");
    el.style.setProperty("--reveal-delay",((root?i%4:i%3)*85)+"ms");
    scrollRevealObserver.observe(el);
  });
}
var scrollRevealObserver=new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if(entry.isIntersecting){entry.target.classList.add("is-visible");scrollRevealObserver.unobserve(entry.target)}
  });
},{threshold:.12,rootMargin:"0px 0px -7% 0px"});
initScrollReveal();
initScrollReveal(grid);


function initCinematicUI(){
  var intro=document.getElementById("intro"),skip=document.getElementById("skipIntro"),header=document.querySelector("header"),lastY=window.scrollY;
  function closeIntro(){if(intro)intro.classList.add("hide")}
  if(skip)skip.addEventListener("click",closeIntro);
  setTimeout(closeIntro,2200);
  window.addEventListener("scroll",function(){
    var y=window.scrollY;
    if(header){if(y>120&&y>lastY+4)header.classList.add("header-hidden");else if(y<lastY-4)header.classList.remove("header-hidden")}
    lastY=y;
  },{passive:true});
  var manifesto=document.querySelector(".manifesto-text");
  if(manifesto&&!window.matchMedia("(prefers-reduced-motion:reduce)").matches){
    window.addEventListener("scroll",function(){
      var r=manifesto.getBoundingClientRect(),vh=window.innerHeight,p=Math.max(-1,Math.min(1,(vh/2-(r.top+r.height/2))/vh));
      manifesto.style.transform="translate3d("+(p*14)+"px,0,0)";
    },{passive:true});
  }
}
initCinematicUI();
