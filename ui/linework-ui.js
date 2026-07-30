/* ============================================================
   LineWork UI — workspaces
   Drop-in. Load at the END of <body> in index.html, after the app's script:
       <script src="ui/linework-ui.js"></script>

   What it adds
     · a workspace — appearance, where the tools sit, where the takeoff sits and
       density — under one name, saved with the project
     · rows in Settings › View so the choices live where every other preference does
     · a ◫ button in the titleblock that opens the workspace manager
     · save / use / delete a named workspace, export it, upload one someone sent

   What it does NOT do
     · touch the sheets, markups, runs or the library. A workspace file holds only
       how the window is arranged, so applying one can never change a takeoff.
     · define any colour. The palettes live in ui/linework-ui.css; this file only
       sets the attributes that choose between them.

   It reads and writes P.ui through window.LW, and leans on the app's own
   applyTheme() for light and dark, so the ☀︎ button and the Appearance rows can
   never disagree.
   ============================================================ */
(function(){
  'use strict';

  var KEY   = 'linework.workspaces.v1';
  /* Integrated with density 'normal' rather than 'roomy' so a first load really is
     byte-for-byte the app people already know — the delivery notes promise that and
     the roomy paddings would have broken it. Change this one word to 'roomy' to make
     the airier spacing the default instead. */
  var LWDEF = {ws:'bench', tools:'top', takeoff:'side', density:'normal', tk:'open'};
  var FAMS  = [
    {v:'bench', t:'Bench',  d:'The warm drafting palette LineWork has today.'},
    {v:'paper', t:'Paper',  d:'The sheet is white, so the app is too. One ink accent.'},
    {v:'slate', t:'Slate',  d:'Neutral grey, so the amber is the only warm thing on screen.'},
    {v:'custom',t:'Custom', d:'Your own colours, started from any of the three above.'}
  ];
  /* The variables a palette is made of, in the order they are worth editing: the
     window, then the surfaces on it, then the lines, then the text, then the accent,
     then the colours that mean something — those last four are what a markup is
     drawn in, so they are the ones to leave alone unless you know why. */
  var VARS = [
    ['bg',     'Window',            'behind everything'],
    ['s1',     'Panel',             'rails, cards, the titleblock'],
    ['s2',     'Raised',            'a row that is picked, a dialog'],
    ['s3',     'Sunken',            'inputs, table headings, bars'],
    ['s4',     'Edge',              'the desk the sheet sits on'],
    ['line',   'Hairline',          'the quiet divider'],
    ['line2',  'Border',            'the one you are meant to see'],
    ['txt',    'Text',              ''],
    ['dim',    'Text, quieter',     'labels and secondary figures'],
    ['faint',  'Text, quietest',    'hints and units'],
    ['amber',  'Accent',            'this is the thing — buttons, the live figure'],
    ['amber2', 'Accent, muted',     'the same thing at rest'],
    ['measure','Measurement',       'dimensions on the sheet'],
    ['link',   'Link',              'links to shop drawings'],
    ['flag',   'Problem',           'anything wrong'],
    ['ok',     'Good',              'approved, within limits'],
    ['paper',  'Sheet',             'the drawing itself'],
    ['ovl',    'Overlay',           'behind a floating panel']
  ];
  var VARNAMES = VARS.map(function(v){ return v[0]; });
  var HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
  var PRESETS = {
    bench: {ws:'bench', tools:'top',  takeoff:'drawer', density:'roomy'},
    paper: {ws:'paper', tools:'top',  takeoff:'side',   density:'roomy'},
    slate: {ws:'slate', tools:'rail', takeoff:'side',   density:'roomy'}
  };

  var $  = function(s,r){ return (r||document).querySelector(s); };
  var $$ = function(s,r){ return [].slice.call((r||document).querySelectorAll(s)); };

  function LW(){ return window.LW || null; }
  function P(){ var l = LW(); return l && l.project ? l.project : null; }

  /* the app is the owner of light and dark; we only mirror it */
  function mode(){ return document.body.classList.contains('light') ? 'light' : 'dark'; }

  function ui(){
    var p = P();
    if(!p) return Object.assign({}, LWDEF);
    if(!p.ui || typeof p.ui !== 'object') p.ui = {};
    return p.ui;
  }

  /* A project file written by an older build, or edited by hand, must not be able
     to put nonsense on the body — the same rule the app applies to its own
     settings. Anything unrecognised falls back to the default. */
  function clean(u){
    u = u || {};
    var ok = function(v, list, dflt){ return list.indexOf(v) >= 0 ? v : dflt; };
    return {
      ws:      ok(u.ws,      ['bench','paper','slate','custom'], LWDEF.ws),
      colors:  cleanColors(u.colors),
      tools:   ok(u.tools,   ['top','rail'],             LWDEF.tools),
      takeoff: ok(u.takeoff, ['side','drawer'],          LWDEF.takeoff),
      density: ok(u.density, ['roomy','compact','normal'], LWDEF.density),
      tk:      ok(u.tk,      ['open','shut'],            LWDEF.tk)
    };
  }

  /* A hand-edited file must not be able to put anything but a colour into a colour,
     so every value is checked and anything else is dropped — the same rule the rest
     of the file follows for the arrangement. */
  function cleanColors(c){
    if(!c || typeof c !== 'object') return null;
    var out = null;
    ['light','dark'].forEach(function(m){
      var src = c[m];
      if(!src || typeof src !== 'object') return;
      var set = null;
      VARNAMES.forEach(function(k){
        var v = src[k];
        if(typeof v === 'string' && HEX.test(v.trim())){
          (set = set || {})[k] = v.trim();
        }
      });
      if(set) (out = out || {})[m] = set;
    });
    return out;
  }
  /* what the current palette computes to, so a custom one starts from something
     real rather than from nothing */
  function readPalette(){
    var cs = getComputedStyle(document.body), out = {};
    VARNAMES.forEach(function(k){
      var v = (cs.getPropertyValue('--' + k) || '').trim();
      out[k] = HEX.test(v) ? v : '#000000';
    });
    return out;
  }
  function paintColors(u, m){
    var st = document.body.style;
    VARNAMES.forEach(function(k){ st.removeProperty('--' + k); });
    if(u.ws !== 'custom') return;
    var set = u.colors && u.colors[m];
    if(!set) return;
    /* inline beats any stylesheet, so a custom palette needs nothing in the CSS */
    VARNAMES.forEach(function(k){ if(set[k]) st.setProperty('--' + k, set[k]); });
  }

  function apply(){
    var u = clean(ui()), b = document.body;
    b.dataset.ws      = u.ws;
    b.dataset.mode    = mode();
    b.dataset.tools   = u.tools;
    b.dataset.takeoff = u.takeoff;
    b.dataset.tk      = u.takeoff === 'drawer' ? u.tk : 'open';
    if(u.density === 'normal') delete b.dataset.density;
    else b.dataset.density = u.density;
    paintColors(u, b.dataset.mode);
    syncWsBtn();
  }

  function set(patch, quiet){
    var p = P();
    if(p){
      p.ui = Object.assign(clean(ui()), patch);
      try{ if(LW().saveProject) LW().saveProject(); }catch(e){}
    }
    apply();
    if(!quiet) redrawSettings();
  }

  /* Appearance goes through the app's own button so P.theme, the button glyph and
     the body class can never drift apart. */
  function setMode(want){
    if(mode() === want) return;
    var b = $('#btnTheme');
    if(b) b.click(); else document.body.classList.toggle('light', want === 'light');
    setTimeout(apply, 0);
  }

  /* ---------- saved workspaces ---------- */
  function saved(){
    try{ return JSON.parse(localStorage.getItem(KEY)) || []; }catch(e){ return []; }
  }
  function persist(list){
    try{ localStorage.setItem(KEY, JSON.stringify(list)); }catch(e){}
  }
  function summary(v){
    v = clean(v);
    if(v.ws === 'custom'){
      var sides = v.colors ? Object.keys(v.colors).sort() : [];
      return ['Custom' + (sides.length ? ' (' + sides.join(' and ') + ')' : ' (nothing set yet)'),
        v.mode || 'dark',
        v.tools === 'rail' ? 'side rail of tools' : 'top tool strip',
        v.takeoff === 'drawer' ? 'takeoff in a drawer' : 'takeoff beside the sheet',
        v.density].join(' · ');
    }
    return [
      (FAMS.filter(function(f){ return f.v === v.ws; })[0] || {}).t || v.ws,
      v.mode || 'dark',
      v.tools === 'rail' ? 'side rail of tools' : 'top tool strip',
      v.takeoff === 'drawer' ? 'takeoff in a drawer' : 'takeoff beside the sheet',
      v.density
    ].join(' · ');
  }
  function currentView(){
    var u = clean(ui());
    u.mode = mode();
    return u;
  }
  function useView(v){
    v = clean(v);
    if(v.mode) setMode(v.mode);
    set(v);
    toast('Now using this workspace');
  }

  function download(name, obj){
    try{
      var blob = new Blob([JSON.stringify(obj, null, 2)], {type:'application/json'});
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function(){ URL.revokeObjectURL(a.href); }, 1000);
      toast('Wrote ' + name);
    }catch(e){ toast('Could not write the file'); }
  }
  function readFile(file){
    var r = new FileReader();
    r.onload = function(){
      try{
        var data = JSON.parse(r.result);
        var list = Array.isArray(data) ? data : (data.workspaces || [data]);
        var add = list.filter(function(w){ return w && w.view; })
                      .map(function(w){ return {name:String(w.name || 'Imported view'), view:clean(w.view)}; });
        if(!add.length){ toast('That file holds no workspace — nothing applied'); return; }
        persist(saved().concat(add));
        drawManager();
        toast(add.length + (add.length === 1 ? ' workspace added' : ' workspaces added'));
      }catch(e){ toast('That file could not be read as a workspace'); }
    };
    r.readAsText(file);
  }

  function toast(t){
    try{ if(LW() && LW().toast){ LW().toast(t); return; } }catch(e){}
    var el = $('#toast');
    if(!el) return;
    el.textContent = t;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function(){ el.classList.remove('show'); }, 2200);
  }

  /* ---------- rows injected into Settings › View ---------- */
  function seg(opts, cur, fn){
    var wrap = document.createElement('div');
    wrap.className = 'lwws-seg';
    opts.forEach(function(o){
      var b = document.createElement('button');
      b.className = 'btn sm' + (o.v === cur ? ' ghost pri' : '');
      b.textContent = o.t;
      b.onclick = function(){ fn(o.v); };
      wrap.appendChild(b);
    });
    return wrap;
  }
  function row(name, hint, ctl){
    var r = document.createElement('div');
    r.className = 'setrow lwws-setrow';
    var lab = document.createElement('div');
    lab.className = 'lab';
    var b = document.createElement('b'); b.textContent = name;
    var s = document.createElement('span'); s.textContent = hint;
    lab.appendChild(b); lab.appendChild(s);
    var c = document.createElement('div');
    c.className = 'ctl';
    c.appendChild(ctl);
    r.appendChild(lab); r.appendChild(c);
    return r;
  }

  function injectSettings(){
    var body = $('#setBody');
    if(!body) return;
    if($('.lwws-setrow', body)) return;                 /* already on this render */
    /* only the View tab; every other tab is left exactly as it was */
    var first = $('.setgrp', body);
    if(!first) return;
    var heading = ($('h4', first) || {}).textContent || '';
    /* the app does not label the open tab on the body, so read it off the nav */
    var on = $('.setnav button.on');
    if(!(on && /view/i.test(on.textContent || '')) && !/view|appearance|display/i.test(heading)) return;
    var u = clean(ui());
    var grp = document.createElement('div');
    grp.className = 'setgrp lwws-setgrp';
    var h = document.createElement('h4');
    h.textContent = 'Workspace';
    grp.appendChild(h);

    grp.appendChild(row('Workspace', 'Three arrangements. Each one only sets the rows below — change any of them afterwards and the workspace is yours.',
      seg(FAMS.map(function(f){ return {v:f.v, t:f.t}; }), u.ws, function(v){
        set(PRESETS[v]);
        var f = FAMS.filter(function(x){ return x.v === v; })[0];
        toast('Workspace set to ' + ((f && f.t) || v) + ' — every part of it is still yours to change');
      })));

    grp.appendChild(row('Appearance', 'Light for printing and a sunlit site, dark for the office. Every workspace has both.',
      seg([{v:'light',t:'Light'},{v:'dark',t:'Dark'}], mode(), setMode)));

    grp.appendChild(row('Tools', 'A strip across the top of the sheet, or a rail of icons down the side.',
      seg([{v:'top',t:'Top strip'},{v:'rail',t:'Side rail'}], u.tools, function(v){ set({tools:v}); })));

    grp.appendChild(row('Takeoff panel', 'A column beside the sheet, or a full-width drawer under it where a run table can be read across.',
      seg([{v:'side',t:'Side rail'},{v:'drawer',t:'Bottom drawer'}], u.takeoff, function(v){ set({takeoff:v}); })));

    var cols = document.createElement('div');
    cols.className = 'lwws-seg';
    var edit = document.createElement('button');
    edit.className = 'btn sm' + (u.ws === 'custom' ? ' pri' : '');
    edit.textContent = u.ws === 'custom' ? 'Edit your colours…' : 'Make your own…';
    edit.onclick = openColours;
    cols.appendChild(edit);
    if(u.ws === 'custom'){
      var back = document.createElement('button');
      back.className = 'btn sm';
      back.textContent = 'Back to Bench';
      back.onclick = function(){ set({ws:'bench'}); toast('Back to the palette LineWork ships with'); };
      cols.appendChild(back);
    }
    grp.appendChild(row('Colours',
      u.ws === 'custom'
        ? 'Your own palette, one set for light and one for dark. It travels with the project and exports in a profile.'
        : 'Start from the palette on screen and change what you like. Light and dark keep their own colours.',
      cols));

    grp.appendChild(row('Density', 'Roomier gives every row more air; compact fits more on screen.',
      seg([{v:'compact',t:'Compact'},{v:'normal',t:'Normal'},{v:'roomy',t:'Roomy'}], u.density, function(v){ set({density:v}); })));

    var manage = document.createElement('button');
    manage.className = 'btn sm';
    manage.textContent = 'Save, export or upload…';
    manage.onclick = openManager;
    grp.appendChild(row('Saved workspaces', 'Keep this arrangement under a name, hand it to the office as a file, or load one you were sent.', manage));

    body.insertBefore(grp, body.firstChild);
  }

  function redrawSettings(){
    var body = $('#setBody');
    if(!body) return;
    var old = $('.lwws-setgrp', body);
    if(old){ old.remove(); injectSettings(); }
  }

  /* ---------- the colour editor ----------
     Eighteen variables and a live preview. Editing writes straight to the body, so
     what you see while you drag is the app itself rather than a swatch — and Cancel
     puts back exactly what was there, because a palette you cannot back out of is
     one nobody will try. */
  var COL = null, colBefore = null, colWork = null;
  function paletteOf(fam){
    /* the three palettes live in the stylesheet; borrow the body for a moment to
       read one rather than duplicating its values here */
    var keepWs = document.body.dataset.ws;
    VARNAMES.forEach(function(k){ document.body.style.removeProperty('--' + k); });
    document.body.dataset.ws = fam;
    var got = readPalette();
    document.body.dataset.ws = keepWs;
    return got;
  }
  function liveColours(){
    var st = document.body.style;
    VARNAMES.forEach(function(k){ if(colWork[k]) st.setProperty('--' + k, colWork[k]); });
  }
  function openColours(){
    var u = clean(ui()), m = mode();
    if(!colBefore) colBefore = {ws:u.ws, colors:u.colors ? JSON.parse(JSON.stringify(u.colors)) : null};
    if(!colWork) colWork = (u.ws === 'custom' && u.colors && u.colors[m])
      ? Object.assign({}, u.colors[m]) : readPalette();

    if(!COL){
      COL = document.createElement('div');
      COL.className = 'scrim';
      COL.style.zIndex = 81;
      COL.innerHTML =
        '<div class="dlg" style="width:min(640px,100%)">' +
          '<h3>Colours</h3>' +
          '<div class="bd" id="lwcolBd" style="padding:0;max-height:min(60vh,540px);overflow:auto"></div>' +
          '<div class="ft">' +
            '<button class="btn" id="lwcolX">Cancel</button>' +
            '<button class="btn pri" id="lwcolOK">Use these colours</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(COL);
      COL.addEventListener('click', function(e){ if(e.target === COL) cancelColours(); });
      $('#lwcolX', COL).onclick = cancelColours;
      $('#lwcolOK', COL).onclick = function(){
        var u2 = clean(ui());
        var cols = u2.colors ? JSON.parse(JSON.stringify(u2.colors)) : {};
        cols[mode()] = colWork;
        COL.classList.remove('show');
        colBefore = null; colWork = null;
        set({ws:'custom', colors:cols});
        toast('Custom palette saved with this project — export a profile to share it');
      };
    }
    drawColours(m);
    COL.classList.add('show');
    liveColours();
  }
  function drawColours(m){
    var bd = $('#lwcolBd', COL);
    bd.innerHTML = '';
    var head = document.createElement('div');
    head.className = 'hint';
    head.style.cssText = 'padding:12px 16px 6px';
    head.textContent = 'Editing the ' + m + ' side of your palette — the other side keeps its own colours, '
      + 'so light and dark stay separate. Changes show as you make them.';
    bd.appendChild(head);

    var from = document.createElement('div');
    from.className = 'lwws-seg';
    from.style.cssText = 'padding:0 16px 10px';
    ['bench','paper','slate'].forEach(function(f){
      var b = document.createElement('button');
      b.className = 'btn sm';
      b.textContent = 'Start from ' + (FAMS.filter(function(x){ return x.v === f; })[0] || {}).t;
      b.onclick = function(){ colWork = paletteOf(f); liveColours(); drawColours(m); };
      from.appendChild(b);
    });
    bd.appendChild(from);

    var wrap = document.createElement('div');
    wrap.className = 'lwws-list';
    VARS.forEach(function(v){
      var k = v[0];
      var r = document.createElement('div');
      r.className = 'lwws-row';
      var nm = document.createElement('div');
      nm.className = 'lwws-name';
      nm.innerHTML = '<b></b><span></span>';
      $('b', nm).textContent = v[1];
      $('span', nm).textContent = '--' + k + (v[2] ? ' · ' + v[2] : '');
      var col = document.createElement('input');
      col.type = 'color';
      col.value = (colWork[k] && colWork[k].length === 7) ? colWork[k] : '#000000';
      col.style.cssText = 'width:46px;height:28px;padding:0;border-radius:4px;flex:0 0 auto';
      var hex = document.createElement('input');
      hex.type = 'text';
      hex.value = colWork[k] || '';
      hex.setAttribute('aria-label', v[1] + ' hex');
      hex.style.cssText = 'width:96px;flex:0 0 auto;font-family:var(--mono)';
      col.oninput = function(){ colWork[k] = col.value; hex.value = col.value; liveColours(); };
      hex.oninput = function(){
        var v2 = hex.value.trim();
        if(!HEX.test(v2)) return;
        colWork[k] = v2;
        if(v2.length === 7) col.value = v2;
        liveColours();
      };
      r.appendChild(nm); r.appendChild(col); r.appendChild(hex);
      wrap.appendChild(r);
    });
    bd.appendChild(wrap);
  }
  function cancelColours(){
    if(COL) COL.classList.remove('show');
    var b = colBefore;
    colBefore = null; colWork = null;
    if(b){ set({ws:b.ws, colors:b.colors}, true); redrawSettings(); }
  }

  /* ---------- the workspace manager ---------- */
  var MGR = null;
  function openManager(){
    if(!MGR){
      MGR = document.createElement('div');
      MGR.className = 'scrim';
      MGR.style.zIndex = 80;
      MGR.innerHTML =
        '<div class="dlg" style="width:min(560px,100%)">' +
          '<h3>Workspaces</h3>' +
          '<div class="bd" id="lwwsBd" style="padding:0"></div>' +
          '<div class="ft">' +
            '<button class="btn" id="lwwsImport">Upload a workspace file</button>' +
            '<button class="btn" id="lwwsExportAll">Export every one</button>' +
            '<button class="btn pri" id="lwwsDone">Done</button>' +
          '</div>' +
        '</div>' +
        '<input type="file" id="lwwsFile" accept=".json,application/json" hidden>';
      document.body.appendChild(MGR);
      MGR.addEventListener('click', function(e){ if(e.target === MGR) closeManager(); });
      $('#lwwsDone', MGR).onclick = closeManager;
      $('#lwwsImport', MGR).onclick = function(){ $('#lwwsFile', MGR).click(); };
      $('#lwwsFile', MGR).onchange = function(e){
        var f = e.target.files && e.target.files[0];
        if(f) readFile(f);
        e.target.value = '';
      };
      $('#lwwsExportAll', MGR).onclick = function(){
        var list = saved();
        if(!list.length){ toast('Nothing saved to export yet'); return; }
        download('workspaces.linework-view.json', {kind:'linework-workspaces', version:1, workspaces:list});
      };
    }
    drawManager();
    MGR.classList.add('show');
  }
  function closeManager(){ if(MGR) MGR.classList.remove('show'); }

  function drawManager(){
    if(!MGR) return;
    var bd = $('#lwwsBd', MGR);
    bd.innerHTML = '';

    var grp = document.createElement('div');
    grp.className = 'lwws-grp';
    var h = document.createElement('h4');
    h.textContent = 'This window, right now';
    grp.appendChild(h);
    var now = document.createElement('div');
    now.className = 'hint';
    now.style.marginBottom = '8px';
    now.textContent = summary(currentView());
    grp.appendChild(now);

    var line = document.createElement('div');
    line.style.cssText = 'display:flex;gap:6px';
    var name = document.createElement('input');
    name.type = 'text';
    name.placeholder = 'Name it — e.g. Estimating desk';
    var save = document.createElement('button');
    save.className = 'btn pri';
    save.style.whiteSpace = 'nowrap';
    save.textContent = 'Save this view';
    save.onclick = function(){
      var list = saved();
      var n = (name.value || '').trim() || ('Workspace ' + (list.length + 1));
      list.push({name:n, view:currentView()});
      persist(list);
      name.value = '';
      drawManager();
      toast('Saved “' + n + '”');
    };
    var exp = document.createElement('button');
    exp.className = 'btn';
    exp.style.whiteSpace = 'nowrap';
    exp.textContent = 'Export';
    exp.onclick = function(){
      download('current.linework-view.json',
        {kind:'linework-workspace', version:1, name:(name.value || 'Current view').trim(), view:currentView()});
    };
    line.appendChild(name); line.appendChild(save); line.appendChild(exp);
    grp.appendChild(line);
    bd.appendChild(grp);

    var list = saved();
    var g2 = document.createElement('div');
    g2.className = 'lwws-grp';
    var h2 = document.createElement('h4');
    h2.textContent = 'Saved on this machine · ' + list.length;
    g2.appendChild(h2);
    bd.appendChild(g2);

    if(!list.length){
      var none = document.createElement('div');
      none.className = 'lwws-none';
      none.textContent = 'Nothing saved yet. Set the window up the way you want it, name it above, and it lands here.';
      bd.appendChild(none);
    }else{
      var wrap = document.createElement('div');
      wrap.className = 'lwws-list';
      list.forEach(function(w, i){
        var r = document.createElement('div');
        r.className = 'lwws-row';
        var nm = document.createElement('div');
        nm.className = 'lwws-name';
        nm.innerHTML = '<b></b><span></span>';
        $('b', nm).textContent = w.name;
        $('span', nm).textContent = summary(w.view);
        var use = document.createElement('button');
        use.className = 'btn sm pri';
        use.textContent = 'Use';
        use.onclick = function(){ useView(w.view); drawManager(); };
        var ex = document.createElement('button');
        ex.className = 'btn sm';
        ex.textContent = 'Export';
        ex.onclick = function(){
          download(String(w.name).replace(/[^\w-]+/g, '-').toLowerCase() + '.linework-view.json',
            {kind:'linework-workspace', version:1, name:w.name, view:w.view});
        };
        var del = document.createElement('button');
        del.className = 'btn sm';
        del.textContent = '✕';
        del.onclick = function(){
          var l = saved(); l.splice(i, 1); persist(l); drawManager();
          toast('“' + w.name + '” removed');
        };
        r.appendChild(nm); r.appendChild(use); r.appendChild(ex); r.appendChild(del);
        wrap.appendChild(r);
      });
      bd.appendChild(wrap);
    }

    var note = document.createElement('div');
    note.className = 'hint';
    note.style.cssText = 'padding:0 16px 14px';
    note.textContent = 'A .linework-view.json holds only how the window is arranged — never the sheets, markups or runs — so applying one can never change a takeoff.';
    bd.appendChild(note);
  }

  /* ---------- the titleblock button ---------- */
  function syncWsBtn(){
    var b = $('#btnWs');
    if(!b) return;
    var u = clean(ui());
    b.title = 'Workspace — ' + summary(currentView());
    b.classList.toggle('pri', u.ws !== LWDEF.ws);
  }
  function addButton(){
    if($('#btnWs')) return;
    var acts = $('.tb .acts');
    var theme = $('#btnTheme');
    if(!acts) return;
    var b = document.createElement('button');
    b.className = 'btn ghost';
    b.id = 'btnWs';
    b.textContent = '◫';
    b.onclick = openManager;
    if(theme && theme.parentNode === acts) acts.insertBefore(b, theme);
    else acts.appendChild(b);
    syncWsBtn();
  }

  /* ---------- wiring ---------- */
  function start(){
    apply();
    addButton();

    /* the app owns light and dark; follow whatever it does to the body */
    new MutationObserver(function(){
      if(document.body.dataset.mode !== mode()) apply();
    }).observe(document.body, {attributes:true, attributeFilter:['class']});

    /* Settings is rebuilt every time a tab is picked, so re-inject on each render */
    var sb = $('#setBody');
    if(sb) new MutationObserver(function(){ injectSettings(); })
      .observe(sb, {childList:true});
    var scrim = $('#setScrim');
    if(scrim) new MutationObserver(function(){
      if(scrim.classList.contains('show')) setTimeout(injectSettings, 0);
    }).observe(scrim, {attributes:true, attributeFilter:['class']});

    /* a project just opened brings its own P.ui with it */
    var lw = LW();
    if(lw && lw.applyProject){
      var orig = lw.applyProject;
      lw.applyProject = function(){
        var r = orig.apply(this, arguments);
        setTimeout(apply, 0);
        return r;
      };
    }

    /* ⌘⇧W / Ctrl-Shift-W opens the manager */
    addEventListener('keydown', function(e){
      if((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'w' || e.key === 'W')){
        e.preventDefault(); openManager();
      }
    });

    window.LWUI = {apply:apply, set:set, get:currentView, saved:saved, open:openManager,
      colours:openColours, vars:VARNAMES, palette:paletteOf};
  }

  if(document.readyState === 'loading') addEventListener('DOMContentLoaded', start);
  else start();
})();
