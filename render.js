/* ============================================
   QU YAN · 曲焱 · 前台数据渲染脚本
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

  /* ===== 首屏轮播 + 鼠标聚光灯 ===== */
  function initHeroSlider(heroData){
    var hero=document.getElementById('hero');
    var slidesContainer=document.getElementById('heroSlides');
    var spotlight=document.getElementById('heroSpotlight');
    var dotsContainer=document.getElementById('heroDots');
    if(!hero||!slidesContainer)return;

    // 读取轮播图配置，过滤掉没有图片的空项
    var slides=(heroData.slides||[]).filter(function(s){return s&&s.image;});
    if(slides.length===0&&heroData.bgImage){
      slides=[{image:heroData.bgImage,title:''}];
    }

    var currentIndex=0;
    var slideTimer=null;
    var interval=heroData.slideInterval||7000;

    // 创建轮播图片
    function createSlides(){
      slidesContainer.innerHTML='';
      if(dotsContainer)dotsContainer.innerHTML='';
      if(slides.length===0){
        var ph=document.createElement('div');
        ph.className='hero-slide placeholder active';
        slidesContainer.appendChild(ph);
        return;
      }
      slides.forEach(function(s,i){
        var div=document.createElement('div');
        div.className='hero-slide'+(i===0?' active':'');
        div.style.backgroundImage='url('+s.image+')';
        slidesContainer.appendChild(div);
        if(dotsContainer){
          var dot=document.createElement('span');
          if(i===0)dot.classList.add('active');
          dot.onclick=function(){goToSlide(i);};
          dotsContainer.appendChild(dot);
        }
      });
    }

    function goToSlide(idx){
      if(slides.length===0)return;
      var slideEls=slidesContainer.querySelectorAll('.hero-slide');
      var dotEls=dotsContainer?dotsContainer.querySelectorAll('span'):[];
      if(slideEls[currentIndex])slideEls[currentIndex].classList.remove('active');
      if(dotEls[currentIndex])dotEls[currentIndex].classList.remove('active');
      currentIndex=(idx+slides.length)%slides.length;
      if(slideEls[currentIndex])slideEls[currentIndex].classList.add('active');
      if(dotEls[currentIndex])dotEls[currentIndex].classList.add('active');
      resetTimer();
    }

    function nextSlide(){goToSlide(currentIndex+1);}

    function resetTimer(){
      if(slideTimer)clearInterval(slideTimer);
      if(slides.length>1){
        slideTimer=setInterval(nextSlide,interval);
      }
    }

    // 鼠标聚光灯 + 克制版镜头光晕（带平滑跟随）
    var mouseX=window.innerWidth/2;
    var mouseY=window.innerHeight/2;
    var currentX=mouseX;  // 当前光晕位置（用于平滑过渡）
    var currentY=mouseY;
    var spotlightRAF=null;
    var flare=document.getElementById('heroFlare');
    var flareMain=flare?flare.querySelector('.flare-main'):null;
    var ambientLight=document.querySelector('.hero-ambient-light');
    var hasImages=slides.length>0;

    // 没有图片时隐藏所有光晕层
    if(!hasImages){
      if(ambientLight) ambientLight.style.display='none';
      if(flare) flare.style.display='none';
      if(spotlight) spotlight.style.display='none';
    }

    function updateSpotlight(){
      // 平滑跟随：当前位置向目标位置插值（0.08=平滑度，越小越顺滑）
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      // 聚光灯半径：桌面端为屏幕宽度的50%，手机端400px
      var spotRadius = window.innerWidth < 768 ? 400 : Math.round(window.innerWidth * 0.5);
      var spotDark = window.innerWidth < 768 ? 0.35 : 0.35;

      // 聚光灯遮罩（三段渐变：中心高亮区更大更亮，过渡更平缓）
      if(spotlight && hasImages){
        spotlight.style.background='radial-gradient(circle '+spotRadius+'px at '+currentX.toFixed(1)+'px '+currentY.toFixed(1)+'px, transparent 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,'+spotDark+') 100%)';
      }
      // 淡白色光晕平滑跟随鼠标
      if(flareMain && hasImages){
        flareMain.style.left=currentX.toFixed(1)+'px';
        flareMain.style.top=currentY.toFixed(1)+'px';
      }

      // 如果还没到达目标位置，继续动画
      if(Math.abs(mouseX - currentX) > 0.3 || Math.abs(mouseY - currentY) > 0.3){
        spotlightRAF=requestAnimationFrame(updateSpotlight);
      }else{
        currentX=mouseX;
        currentY=mouseY;
        spotlightRAF=null;
      }
    }

    hero.addEventListener('mousemove',function(e){
      if(!hasImages) return;  // 无图片时不响应
      var rect=hero.getBoundingClientRect();
      mouseX=e.clientX-rect.left;
      mouseY=e.clientY-rect.top;
      if(flare) flare.classList.add('active');
      if(!spotlightRAF){
        spotlightRAF=requestAnimationFrame(updateSpotlight);
      }
    });

    hero.addEventListener('mouseleave',function(){
      if(!hasImages) return;
      mouseX=window.innerWidth/2;
      mouseY=window.innerHeight/2;
      if(flare) flare.classList.remove('active');
      if(!spotlightRAF){
        spotlightRAF=requestAnimationFrame(updateSpotlight);
      }
    });

    // 初始化
    createSlides();
    resetTimer();
  }

  /* ===== 首页渲染 ===== */
  var heroSliderInited = false;
  function renderHome(){
    var h = D.home;
    // 首屏标题
    var words = document.querySelectorAll('.hero-title .word');
    if(words[0] && h.hero.title1) words[0].textContent = h.hero.title1;
    if(words[1] && h.hero.title2) words[1].textContent = h.hero.title2;
    // 首屏轮播图 + 鼠标聚光灯（只初始化一次）
    if(!heroSliderInited){
      heroSliderInited = true;
      initHeroSlider(h.hero);
    }
    // 介绍文字
    txtAll('.intro-quote p', [h.intro.line1, h.intro.line2]);
    // 视频标签
    txt('.video-label', h.video.label);
    // 视频播放 + 多视频轮换
    var videoEl = document.getElementById('showreelVideo');
    var playIcon = document.getElementById('videoPlayIcon');
    var videoList = (h.video.videos || []).filter(function(v){return v && v.src;});
    var currentVideoIdx = 0;

    if(videoEl && videoList.length > 0){
      if(playIcon) playIcon.style.display = 'none';
      var isFirstPlay = true;
      function playVideoAt(idx){
        currentVideoIdx = idx;
        var mask = document.querySelector('.video-fade-mask');
        if(isFirstPlay || !mask){
          videoEl.src = videoList[idx].src;
          if(videoList[idx].poster) videoEl.poster = videoList[idx].poster;
          var p = videoEl.play();
          if(p && p.catch) p.catch(function(){});
          isFirstPlay = false;
        }else{
          mask.style.opacity = '1';
          setTimeout(function(){
            videoEl.src = videoList[idx].src;
            if(videoList[idx].poster) videoEl.poster = videoList[idx].poster;
            var onCanPlay = function(){
              mask.style.opacity = '0';
              videoEl.removeEventListener('canplay', onCanPlay);
            };
            videoEl.addEventListener('canplay', onCanPlay);
            setTimeout(function(){
              mask.style.opacity = '0';
              videoEl.removeEventListener('canplay', onCanPlay);
            }, 3000);
            var p = videoEl.play();
            if(p && p.catch) p.catch(function(){});
          }, 800);
        }
      }
      playVideoAt(0);
      // 播放完自动切换下一个
      videoEl.onended = function(){
        playVideoAt((currentVideoIdx + 1) % videoList.length);
      };
      // 点击暂停/播放
      var vp = document.querySelector('.video-placeholder');
      if(vp){
        vp.onclick = function(){
          if(videoEl.paused){
            videoEl.play();
            if(playIcon) playIcon.style.display = 'none';
          }else{
            videoEl.pause();
            if(playIcon) playIcon.style.display = 'flex';
          }
        };
      }
    }else{
      // 没有视频时显示占位图标
      if(playIcon) playIcon.style.display = 'flex';
      if(videoEl) videoEl.style.display = 'none';
    }
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
        var bgStyle = item.image ? 'style="background-image:url(\''+item.image+'\')"' : '';
        gh += '<div class="direction-item fade-up '+(i%2===0?'delay-1':'delay-2')+'" '+bgStyle+'>'
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
    // 关于我们
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
    // 项目网格（全量渲染，分页通过 page-hidden 类控制显示）
    var grid = document.getElementById('projectGrid');
    if(grid){
      var gh = '';
      D.projects.forEach(function(p,i){
        var phClass = 'ph-'+((i%6)+1);
        var bgStyle = p.cover ? 'background-image:url('+p.cover+');background-size:cover;background-position:center' : '';
        gh += '<a class="project-card" data-category="'+p.category+'" href="project/'+p.id+'">'
          + '<div class="card-img '+phClass+'" style="'+bgStyle+'"></div>'
          + '<div class="card-overlay"></div>'
          + '<div class="card-info"><h3>'+p.title+'</h3><p>'+p.location+' · '+p.year+'</p></div></a>';
      });
      grid.innerHTML = gh;
      // 分页：默认显示前8个，超过的加 page-hidden
      window.projectVisibleCount = 8;
      var cards = grid.querySelectorAll('.project-card');
      cards.forEach(function(card,i){
        if(i >= 8) card.classList.add('page-hidden');
      });
      // 更新显示更多按钮状态
      updateLoadMoreBtn();
    }
  }

  // 分页：显示更多（每次增加8个）
  window.loadMoreProjects = function(){
    var grid = document.getElementById('projectGrid');
    if(!grid) return;
    var cards = grid.querySelectorAll('.project-card:not(.hidden)');
    var total = D.projects.length;
    window.projectVisibleCount = Math.min((window.projectVisibleCount || 8) + 8, total);
    // 重新应用分页隐藏
    var allCards = grid.querySelectorAll('.project-card');
    allCards.forEach(function(card,i){
      if(i >= window.projectVisibleCount) card.classList.add('page-hidden');
      else card.classList.remove('page-hidden');
    });
    updateLoadMoreBtn();
  };

  // 更新显示更多按钮状态
  function updateLoadMoreBtn(){
    var lm = document.getElementById('loadMoreBtn');
    if(!lm) return;
    var total = D.projects.length;
    if((window.projectVisibleCount || 8) >= total){
      lm.textContent = '已加载全部项目';
      lm.style.borderColor = '#333';
      lm.style.color = '#666';
      lm.style.cursor = 'default';
      lm.disabled = true;
    }else{
      lm.textContent = D.projectsPage.loadMoreText || '显示更多';
      lm.style.borderColor = '';
      lm.style.color = '';
      lm.style.cursor = '';
      lm.disabled = false;
    }
  }

  /* ===== 项目详情页渲染 ===== */
  function renderDetailPage(){
    var id = 1;
    var pathMatch = window.location.pathname.match(/\/project\/(\d+)/);
    if(pathMatch){
      id = parseInt(pathMatch[1]) || 1;
    }else{
      var params = new URLSearchParams(window.location.search);
      id = parseInt(params.get('id')) || 1;
    }
    var project = D.projects.find(function(p){return p.id===id;}) || D.projects[0];
    if(!project || !project.detail) return;
    var d = project.detail;

    // 首屏
    document.title = project.title + ' · QU YAN · 曲焱';
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
      function imgTag(url){
        return url ? '<img src="'+url+'" alt="">' : '<div class="img-placeholder '+ph()+'"></div>';
      }
      d.blocks.forEach(function(b){
        switch(b.type){
          case 'full-image':
            bh += '<div class="full-img">'+imgTag(b.image)+'</div>';
            break;
          case 'text-image':
            // 文左图右 = right-img
            bh += '<section class="gallery"><div class="row right-img">'
              + '<div class="text"><div class="label">'+(b.title||'')+'</div>'+(b.text||'')+'</div>'
              + '<div class="img">'+imgTag(b.image)+'</div></div></section>';
            break;
          case 'image-text':
            // 图左文右 = left-img
            bh += '<section class="gallery"><div class="row left-img">'
              + '<div class="img">'+imgTag(b.image)+'</div>'
              + '<div class="text"><div class="label">'+(b.title||'')+'</div>'+(b.text||'')+'</div></div></section>';
            break;
          case 'double-image':
            bh += '<section class="gallery"><div class="pair">'
              + '<div class="img">'+imgTag(b.image1)+'</div>'
              + '<div class="img">'+imgTag(b.image2)+'</div></div></section>';
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
    if(prevLink) prevLink.href = 'project/'+prev.id;
    if(nextLink) nextLink.href = 'project/'+next.id;
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

  /* ===== 隐藏单页渲染（和详情页同版式） ===== */
  function renderPage(){
    var slug = '';
    var m = window.location.pathname.match(/\/p\/([^\/\?#]+)/);
    if(m){ slug = m[1]; }
    else {
      var params = new URLSearchParams(window.location.search);
      slug = params.get('slug') || '';
    }
    if(!D.pages) D.pages = [];
    var page = D.pages.find(function(p){return p.slug===slug;});
    if(!page){
      document.body.innerHTML = '<div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0a0a0a;color:#fff;font-family:sans-serif"><h1 style="font-size:64px;margin-bottom:16px">404</h1><p style="color:#888">页面不存在或已删除</p><a href="/" style="color:#fff;margin-top:24px">返回首页</a></div>';
      return;
    }
    if(!page.detail) return;
    var d = page.detail;
    document.title = page.title + ' · QU YAN · 曲焱';
    txt('.hero-info h1', page.title);
    var heroMeta = document.querySelector('.hero-info p');
    if(heroMeta) heroMeta.style.display = 'none';
    if(d.heroImage) bg('.hero-img', d.heroImage);
    txt('.project-intro .desc', d.description);
    var rows = document.querySelectorAll('.meta .row');
    var infoData = [
      {label:'内容类型', value:d.info ? d.info.type : ''},
      {label:'日期', value:d.info ? d.info.date : ''}
    ];
    rows.forEach(function(row,i){
      if(infoData[i]){
        row.querySelector('.label').textContent = infoData[i].label;
        row.querySelector('.value').textContent = infoData[i].value;
        row.style.display = '';
      }else{
        row.style.display = 'none';
      }
    });
    var blocksContainer = document.querySelector('.detail-blocks');
    if(blocksContainer && d.blocks){
      var bh = '';
      var phIdx = 1;
      function ph(){ return 'ph-'+((phIdx++ %6)+1); }
      function imgTag(url){
        return url ? '<img src="'+url+'" alt="">' : '<div class="img-placeholder '+ph()+'"></div>';
      }
      d.blocks.forEach(function(b){
        switch(b.type){
          case 'full-image':
            bh += '<div class="full-img">'+imgTag(b.image)+'</div>';
            break;
          case 'text-image':
            bh += '<section class="gallery"><div class="row right-img">'
              + '<div class="text"><div class="label">'+(b.title||'')+'</div>'+(b.text||'')+'</div>'
              + '<div class="img">'+imgTag(b.image)+'</div></div></section>';
            break;
          case 'image-text':
            bh += '<section class="gallery"><div class="row left-img">'
              + '<div class="img">'+imgTag(b.image)+'</div>'
              + '<div class="text"><div class="label">'+(b.title||'')+'</div>'+(b.text||'')+'</div></div></section>';
            break;
          case 'double-image':
            bh += '<section class="gallery"><div class="pair">'
              + '<div class="img">'+imgTag(b.image1)+'</div>'
              + '<div class="img">'+imgTag(b.image2)+'</div></div></section>';
            break;
          case 'quote':
            bh += '<section class="quote-section"><blockquote>'+b.text+'</blockquote>'
              + '<div class="author">—— '+(b.author||'')+'</div></section>';
            break;
        }
      });
      blocksContainer.innerHTML = bh;
    }
    var prevLink = document.querySelector('.nav-arrow-fixed.left');
    var nextLink = document.querySelector('.nav-arrow-fixed.right');
    if(prevLink) prevLink.style.display = 'none';
    if(nextLink) nextLink.style.display = 'none';
  }

  /* ===== 启动 ===== */
  function init(){
    renderCommon();
    document.addEventListener('contextmenu', function(e){
      if(e.target.tagName === 'IMG') e.preventDefault();
    });
    document.addEventListener('dragstart', function(e){
      if(e.target.tagName === 'IMG') e.preventDefault();
    });
    var path = location.pathname;
    if(path.indexOf('/p/')>-1){
      renderPage();
    }else if((path.indexOf('projects')>-1 && path.indexOf('/project/')===-1)){
      renderProjectsPage();
    }else if(path.indexOf('project-detail')>-1 || path.indexOf('/project/')>-1){
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
