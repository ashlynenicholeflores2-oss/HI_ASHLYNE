(function(){
  var page=document.body.dataset.page||'home';

  /* Highlight the current page in the nav */
  [].forEach.call(document.querySelectorAll('nav a'),function(a){
    if(a.dataset.view===page)a.setAttribute('aria-current','page');
  });

  /* Home: typing effect on the info lines */
  var lines=[].slice.call(document.querySelectorAll('.info p'));
  if(lines.length){
    var calm=window.matchMedia('(prefers-reduced-motion:reduce)').matches,timer=0;
    lines.forEach(function(l){l.dataset.full=l.textContent;if(!calm)l.textContent=''});
    if(!calm){
      var li=0,ci=0;
      (function step(){
        if(li>=lines.length){lines.forEach(function(x){x.classList.remove('typing')});return}
        var l=lines[li];
        lines.forEach(function(x){x.classList.remove('typing')});
        l.classList.add('typing');
        if(ci<l.dataset.full.length){ci++;l.textContent=l.dataset.full.slice(0,ci);timer=setTimeout(step,40)}
        else{li++;ci=0;timer=setTimeout(step,280)}
      })();
    }
  }

  /* Achievements: click to enlarge, with previous / next */
  var lb=document.getElementById('lightbox');
  if(!lb)return;
  var lbImg=document.getElementById('lb-img'),opener=null,set=[],idx=0;
  var lbPrev=document.getElementById('lb-prev'),lbNext=document.getElementById('lb-next');
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
    set=[].slice.call(document.querySelectorAll('.ach'));
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
})();
