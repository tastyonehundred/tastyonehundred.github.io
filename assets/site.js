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

/* 背景影片：使用者設定「減少動態」時停在第一格 */
(function(){
  if (!window.matchMedia || !matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".bg-video").forEach(function(v){ v.removeAttribute("autoplay"); v.pause(); });
})();
