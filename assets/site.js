/* 百味滷製 共用互動：header 捲動變色、手機選單、捲動淡入、按鈕追蹤 */
(function(){
  var top = document.querySelector(".top");
  function onScroll(){ if (top) top.classList.toggle("solid", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, {passive:true}); onScroll();

  /* 手機選單 */
  var menu = document.querySelector(".menu");
  document.addEventListener("click", function(e){
    if (!menu) return;
    if (e.target.closest(".burger")) { menu.classList.add("open"); document.body.style.overflow = "hidden"; }
    else if (e.target.closest(".menu .x") || e.target.closest(".menu a")) { menu.classList.remove("open"); document.body.style.overflow = ""; }
  });

  /* 捲動淡入 */
  var els = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, {rootMargin:"0px 0px -8% 0px"});
    els.forEach(function(el){ io.observe(el); });
  } else {
    els.forEach(function(el){ el.classList.add("in"); });
  }

  /* 追蹤：之後裝上 Meta Pixel，這段會把每個按鈕的點擊送成事件 */
  document.addEventListener("click", function(e){
    var a = e.target.closest("[data-cta]"); if (!a || !window.fbq) return;
    var name = a.getAttribute("data-cta");
    if (name.indexOf("line") === 0) fbq("track", "Contact", {cta:name});
    else if (name.indexOf("buy") === 0) fbq("track", "InitiateCheckout", {cta:name});
    else fbq("trackCustom", "CTAClick", {cta:name});
  });
})();

/* 背景影片：手機的低電量／省電模式會擋自動播放。
   捲到畫面中時再試一次播放（離開畫面就暫停、省電）；還是被擋的話，等使用者第一次點擊或滑動時再播 */
(function(){
  var vids = [].slice.call(document.querySelectorAll(".bg-video"));
  if (!vids.length) return;
  function tryPlay(v){ v.muted = true; var p = v.play(); if (p && p.catch) p.catch(function(){}); }
  vids.forEach(function(v){
    v.muted = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function(entries){
        entries.forEach(function(en){ if (en.isIntersecting) tryPlay(v); else v.pause(); });
      }, {threshold: .1}).observe(v);
    } else tryPlay(v);
  });
  function kick(){ vids.forEach(function(v){ if (v.paused && v.getBoundingClientRect().bottom > 0 && v.getBoundingClientRect().top < innerHeight) tryPlay(v); }); }
  ["touchend", "click", "scroll"].forEach(function(t){ window.addEventListener(t, kick, {passive: true}); });
})();

/* 首頁輪播：每 6 秒換一張；點圓點切換；設定「減少動態」時不自動換 */
(function(){
  document.querySelectorAll(".slides").forEach(function(box){
    var imgs = box.querySelectorAll("img"), dots = box.parentNode.querySelector(".dots");
    if (imgs.length < 2 || !dots) return;
    var cur = 0, timer;
    var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    imgs.forEach(function(img, i){
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("aria-label", "第 " + (i + 1) + " 張照片");
      b.addEventListener("click", function(){ show(i); restart(); });
      dots.appendChild(b);
    });
    function show(i){
      imgs[cur].classList.remove("on"); dots.children[cur].removeAttribute("aria-current");
      cur = i;
      imgs[cur].classList.add("on"); dots.children[cur].setAttribute("aria-current", "true");
    }
    function restart(){
      clearInterval(timer);
      if (!still) timer = setInterval(function(){ show((cur + 1) % imgs.length); }, 6000);
    }
    show(0); restart();
  });
})();
