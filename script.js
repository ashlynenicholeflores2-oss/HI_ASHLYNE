(function(){
  var order=['home','personal','achievements','family'];
  var views=document.querySelectorAll('.view'),links=document.querySelectorAll('nav a');
  var prev=document.getElementById('prev'),next=document.getElementById('next');
  var calm=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* Typing effect on the home info lines */
  var lines=[].slice.call(document.querySelectorAll('.info p')),timer=0,token=0;
  lines.forEach(function(l){l.dataset.full=l.textContent});
  function typeInfo(){
    token++;var my=token;clearTimeout(timer);
    lines.forEach(function(l){l.classList.remove('typing');l.textContent=calm?l.dataset.full:''});
    if(calm)return;
    var li=0,ci=0;
    (function step(){
      if(my!==token||li>=lines.length)return;
      var l=lines[li];
      lines.forEach(function(x){x.classList.remove('typing')});
      l.classList.add('typing');
      if(ci<l.dataset.full.length){ci++;l.textContent=l.dataset.full.slice(0,ci);timer=setTimeout(step,40)}
      else{li++;ci=0;timer=setTimeout(step,280)}
    })();
  }

  /* Switch buttons (Curricular / Extracurricular) */
  [].forEach.call(document.querySelectorAll('.seg'),function(seg){
    var btns=[].slice.call(seg.querySelectorAll('.segbtn'));
    btns.forEach(function(b){
      b.addEventListener('click',function(){
        btns.forEach(function(x){
          var on=x===b;
          x.setAttribute('aria-selected',String(on));
          document.getElementById('panel-'+x.dataset.panel).hidden=!on;
        });
      });
    });
  });

  /* Achievements: click to enlarge, with previous / next */
  var lb=document.getElementById('lightbox'),lbImg=document.getElementById('lb-img'),opener=null;
  var lbPrev=document.getElementById('lb-prev'),lbNext=document.getElementById('lb-next');
  var set=[],idx=0;
  function show(i){
    var card=set[i];if(!card)return;
    idx=i;
    var img=card.querySelector('img');
    lbImg.src=img.src;lbImg.alt=img.alt;
    document.getElementById('lb-title').textContent=card.querySelector('b').textContent;
    document.getElementById('lb-meta').textContent=card.querySelector('small').textContent;
    document.getElementById('lb-desc').textContent=card.querySelector('.detail span').textContent;
    document.getElementById('lb-count').textContent=(i+1)+' of '+set.length;
    lbPrev.disabled=i===0;lbNext.disabled=i===set.length-1;
    opener=card;
  }
  function openLb(card){
    set=[].slice.call(document.querySelectorAll('#achievements .ach'));
    show(set.indexOf(card));
    lb.hidden=false;document.getElementById('lb-close').focus();
  }
  function closeLb(){lb.hidden=true;lbImg.removeAttribute('src');if(opener)opener.focus()}
  [].forEach.call(document.querySelectorAll('.ach'),function(c){c.addEventListener('click',function(){openLb(c)})});
  document.getElementById('lb-close').addEventListener('click',closeLb);
  lbPrev.addEventListener('click',function(){show(idx-1)});
  lbNext.addEventListener('click',function(){show(idx+1)});
  lb.addEventListener('click',function(e){if(e.target===lb)closeLb()});
  document.addEventListener('keydown',function(e){
    if(lb.hidden)return;
    if(e.key==='Escape')closeLb();
    else if(e.key==='ArrowLeft')show(Math.max(0,idx-1));
    else if(e.key==='ArrowRight')show(Math.min(set.length-1,idx+1));
  });
  window.addEventListener('hashchange',function(){if(!lb.hidden)closeLb()});

  /* Routing */
  function route(){
    var id=(location.hash||'#home').slice(1);
    if(order.indexOf(id)<0)id='home';
    views.forEach(function(v){v.classList.toggle('active',v.id===id)});
    links.forEach(function(a){
      if(a.dataset.view===id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });
    var i=order.indexOf(id);
    prev.hidden=i===0;next.hidden=i===order.length-1;
    if(i>0)prev.href='#'+order[i-1];
    if(i<order.length-1)next.href='#'+order[i+1];
    var active=[].filter.call(links,function(a){return a.dataset.view===id})[0];
    document.title=(id==='home'?'':active.textContent+' | ')+'Ashlyne Nichole Flores';
    window.scrollTo(0,0);
    if(id==='home')typeInfo();
  }
  window.addEventListener('hashchange',route);
  route();
})();
