/* ============================================
   曲焱作品集 · 前台数据渲染脚本
   三个页面共用，从 data.js 读取内容
   ============================================ */
(function(){
  'use strict';
  var D = window.SITE_DATA;
  if(!D){console.warn('data.js 未加载');return;}

  /* 工具：设置文字 */
  function txt(sel, text){
    var el = document.querySelector(sel);
    if(el && text !== undefined && text !== null) el.textContent = text;
  }
  function txtAll(sel, texts){
    var els = document.querySelectorAll(sel);
    if(!texts) return;
    for(var i=0;i<els.length && i<texts.length;i++){
      els[i].textContent = texts[i];
    }
  }
  /* 工具：设置背景图 */
  function bg(sel, url){
    var el = document.querySelector(sel);
    if(el && url){ el.style.backgroundImage = 'url('+url+')'; el.style.backgroundSize='cover'; el.style.backgroundPosition='center'; }
  }
  /* 工具：设置二维码图片 */
  function qrCode(sel, url){
    var els = document.querySelectorAll(sel);
    els.forEach(function(el){
      if(url){
        el.innerHTML = '<img src="'+url+'" style="width:100%;height:100%;object-fit:contain;border-radius:6px" alt="微信二维码">';
        el.style.border='none';
      }
    });
  }

  /* ===== 通用：logo + 联系方式（所有页面） ===== */
  function renderCommon(){
    // logo
    document.querySelectorAll('.nav .logo, .footer .logo').forEach(function(el){
      el.textContent = D.site.logo;
    });
    // 联系方式文字
    var c = D.site.contact;
    var lines = document.querySelectorAll('.menu-contact .contact-line, .qr-card .contact-line');
    var data = [
      {label:'电话', value:c.phone},
      {label:'邮箱', value:c.email},
      {label:'地址', value:c.address}
    ];
    // 菜单联系面板
    var menuLines = document.querySelectorAll('.menu-contact .contact-line');
    menuLines.forEach(function(el,i){ if(data[i]) el.innerHTML = '<span>'+data[i].label+'</span>'+data[i].value; });
    // 弹窗联系
    var modalLines = document.querySelectorAll('.qr-card .contact-line');
    modalLines.forEach(function(el,i){ if(data[i]) el.innerHTML = '<span>'+data[i].label+'</span>'+data[i].value; });
    // 二维码
    if(c.wechatQr){
      qrCode('.menu-contact .qr-code', c.wechatQr);
      qrCode('.qr-card .qr-code', c.wechatQr);
    }
  }

  /* ===== 首页渲染 ===== */
  function renderHome(){
    var h = D.home;
    // 首屏标题
    var words = document.querySelectorAll('.hero-title .word');
    if(words[0] && h.hero.title1) words[0].textContent = h.hero.title1;
    if(words[1] && h.hero.title2) words[1].textContent = h.hero.title2;
    // 首屏背景
    if(h.hero.bgImage) bg('.hero-bg', h.hero.bgImage);
    // 介绍文字
    txtAll('.intro-quote p', [h.intro.line1, h.intro.line2]);
    // 视频标签
    txt('.video-label', h.video.label);
    // 视频背景/封面
    if(h.video.poster) bg('.video-placeholder', h.video.poster);
    // 空间叙事标题
    txt('#works .section-label', h.works.label);
    txt('#works .section-title', h.works.title);
    txt('#works .section-desc', h.works.subtitle);
    // 轮播动态渲染
    var carousel = document.querySelector('.work-carousel');
    if(carousel && h.works.slides.length){
      // 保留箭头按钮
      var arrows = carousel.querySelectorAll('.carousel-arrow');
      var total = h.works.slides.length;
      var html = '';
      arrows.forEach(function(a){ html += a.outerHTML; });
      h.works.slides.forEach(function(s,i){
        var num = String(i+1).padStart(2,'0') + ' / ' + String(total).padStart(2,'0');
        var bgStyle = s.image ? 'background-image:url('+s.image+');background-size:cover;background-position:center' : '';
        html += '<div class="slide'+(i===0?' active':'')+'">'
          + '<div class="slide-bg s'+((i%4)+1)+'" style="'+bgStyle+'"></div>'
          + '<div class="slide-info"><div class="tag">'+s.tag+'</div><h3>'+s.title+'</h3><p>'+s.desc+'</p></div>'
          + '<div class="page-num">'+num+'</div></div>';
      });
      carousel.innerHTML = html;
      // 重新绑定箭头事件
      var leftBtn = carousel.querySelector('.carousel-arrow.left');
      var rightBtn = carousel.querySelector('.carousel-arrow.right');
      if(leftBtn) leftBtn.onclick = function(){changeSlide(-1)};
      if(rightBtn) rightBtn.onclick = function(){changeSlide(1)};
    }
    // 设计理念
    txt('#philosophy .section-label', h.philosophy.label);
    txt('#philosophy h3', h.philosophy.title);
    txt('#philosophy p', h.philosophy.text);
    if(h.philosophy.image) bg('#philosophy .bg-placeholder', h.philosophy.image);
    // 服务内容
    txt('#services .section-label', h.services.label);
    txt('#services .section-title', h.services.title);
    var grid = document.querySelector('.direction-grid');
    if(grid && h.services.items.length){
      var gh = '';
      h.services.items.forEach(function(item,i){
        gh += '<div class="direction-item fade-up '+(i%2===0?'delay-1':'delay-2')+'">'
          + '<div class="num">'+item.num+'</div><h3>'+item.name+'</h3><p>'+item.desc+'</p></div>';
      });
      grid.innerHTML = gh;
    }
    // 工作流程
    txt('#process .section-label', h.process.label);
    txt('#process h3', h.process.title);
    txt('#process .text-side p', h.process.text);
    txt('#process .btn-outline', h.process.button);
    if(h.process.image) bg('#process .img-side', h.process.image);
    // 关于我
    txt('.footer-about .section-label', h.about.label);
    txt('.footer-about h2', h.about.title);
    var aboutPs = document.querySelectorAll('.footer-about p');
    h.about.paragraphs.forEach(function(p,i){
      if(aboutPs[i]) aboutPs[i].textContent = p;
    });
    txt('.footer-about .cta-btn', h.about.button);
  }

  /* ===== 项目列表页渲染 ===== */
  function renderProjectsPage(){
    var pp = D.projectsPage;
    txt('.page-header .section-label', pp.label);
    txt('.page-header h1', pp.title);
    txt('.page-header p', pp.subtitle);
    // 注意：分类筛选下拉菜单保留静态HTML（事件已在页面内联脚本绑定），不在此重渲染
    // 项目网格
    var grid = document.getElementById('projectGrid');
    if(grid){
      var gh = '';
      D.projects.forEach(function(p,i){
        var phClass = 'ph-'+((i%6)+1);
        var bgStyle = p.cover ? 'background-image:url('+p.cover+');background-size:cover;background-position:center' : '';
        gh += '<a class="project-card" data-category="'+p.category+'" href="project-detail.html?id='+p.id+'">'
          + '<div class="card-img '+phClass+'" style="'+bgStyle+'"></div>'
          + '<div class="card-overlay"></div>'
          + '<div class="card-info"><h3>'+p.title+'</h3><p>'+p.location+' · '+p.year+'</p></div></a>';
      });
      grid.innerHTML = gh;
    }
    var lm = document.getElementById('loadMoreBtn');
    if(lm && pp.loadMoreText) lm.textContent = pp.loadMoreText;
  }

  /* ===== 项目详情页渲染 ===== */
  function renderDetailPage(){
    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get('id')) || 1;
    var project = D.projects.find(function(p){return p.id===id;}) || D.projects[0];
    if(!project || !project.detail) return;
    var d = project.detail;

    // 首屏
    document.title = project.title + ' · 曲焱作品集';
    txt('.hero-info h1', project.title);
    var heroMeta = document.querySelector('.hero-info p');
    if(heroMeta) heroMeta.textContent = project.location + ' · ' + project.year + ' · ' + project.categoryName;
    if(d.heroImage) bg('.hero-img', d.heroImage);

    // 项目说明
    txt('.project-intro .desc', d.description);

    // 信息栏
    var rows = document.querySelectorAll('.meta .row');
    var infoData = [
      {label:'项目类型', value:d.info.type},
      {label:'项目地点', value:d.info.location},
      {label:'完成年份', value:d.info.year},
      {label:'项目面积', value:d.info.area},
      {label:'设计范围', value:d.info.scope}
    ];
    rows.forEach(function(row,i){
      if(infoData[i]){
        row.querySelector('.label').textContent = infoData[i].label;
        row.querySelector('.value').textContent = infoData[i].value;
      }
    });

    // 模块化内容区
    var blocksContainer = document.querySelector('.detail-blocks');
    if(blocksContainer && d.blocks){
      var bh = '';
      var phIdx = 1;
      function ph(){ return 'ph-'+((phIdx++ %6)+1); }
      function imgStyle(url){ return url ? 'background-image:url('+url+');background-size:cover;background-position:center' : ''; }
      d.blocks.forEach(function(b){
        switch(b.type){
          case 'full-image':
            bh += '<div class="full-img '+ph()+'" style="'+imgStyle(b.image)+'"></div>';
            break;
          case 'text-image':
            // 文左图右 = right-img
            bh += '<section class="gallery"><div class="row right-img">'
              + '<div class="text"><div class="label">'+(b.title||'')+'</div>'+(b.text||'')+'</div>'
              + '<div class="img '+ph()+'" style="'+imgStyle(b.image)+'"></div></div></section>';
            break;
          case 'image-text':
            // 图左文右 = left-img
            bh += '<section class="gallery"><div class="row left-img">'
              + '<div class="img '+ph()+'" style="'+imgStyle(b.image)+'"></div>'
              + '<div class="text"><div class="label">'+(b.title||'')+'</div>'+(b.text||'')+'</div></div></section>';
            break;
          case 'double-image':
            bh += '<section class="gallery"><div class="pair">'
              + '<div class="img '+ph()+'" style="'+imgStyle(b.image1)+'"></div>'
              + '<div class="img '+ph()+'" style="'+imgStyle(b.image2)+'"></div></div></section>';
            break;
          case 'quote':
            bh += '<section class="quote-section"><blockquote>'+b.text+'</blockquote>'
              + '<div class="author">—— '+(b.author||'')+'</div></section>';
            break;
        }
      });
      blocksContainer.innerHTML = bh;
    }

    // 上一个/下一个项目
    var idx = D.projects.findIndex(function(p){return p.id===project.id;});
    var prev = D.projects[idx-1] || D.projects[D.projects.length-1];
    var next = D.projects[idx+1] || D.projects[0];
    var prevLink = document.querySelector('.nav-arrow-fixed.left');
    var nextLink = document.querySelector('.nav-arrow-fixed.right');
    if(prevLink) prevLink.href = 'project-detail.html?id='+prev.id;
    if(nextLink) nextLink.href = 'project-detail.html?id='+next.id;
  }

  /* ===== 访问统计 ===== */
  function trackVisit(){
    if(location.protocol === 'file:') return; // 本地预览不计，部署后才统计
    var page = location.pathname.split('/').pop() || 'index.html';
    try{
      if(window.fetch){
        fetch('api.php?action=visit&page='+encodeURIComponent(page), {method:'GET'})
          .then(function(r){return r.json();})
          .then(function(data){
            if(data && data.total !== undefined){
              window.VISIT_TOTAL = data.total;
            }
          })
          .catch(function(){/* 无PHP时静默失败 */});
      }
    }catch(e){}
  }

  /* ===== 启动 ===== */
  function init(){
    renderCommon();
    var path = location.pathname;
    if(path.indexOf('projects.html')>-1){
      renderProjectsPage();
    }else if(path.indexOf('project-detail.html')>-1){
      renderDetailPage();
    }else{
      renderHome();
    }
    trackVisit();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }
})();
