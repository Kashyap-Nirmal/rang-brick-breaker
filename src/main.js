(() => {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d", { alpha: false });
  const $ = (id) => document.getElementById(id);
  const screens = [
    "menu",
    "levels",
    "about",
    "feedback",
    "settings",
    "overlay",
  ];
  const scorePill = document.querySelector(".score-pill");

  const LEVELS = [
    {
      name: "Side by Side",
      sub: "Two clean walls. Find the gap.",
      shape: "sides",
    },
    { name: "Sky Hook", sub: "An arch with a way through.", shape: "invU" },
    { name: "U-Turn", sub: "Ride the curve and come back.", shape: "U" },
    {
      name: "Four Corners",
      sub: "A square with four chances.",
      shape: "square",
    },
    {
      name: "Moon Gate",
      sub: "Slip through the missing piece.",
      shape: "circle",
    },
    {
      name: "Twin Drift",
      sub: "The walls have started moving.",
      shape: "sidesMove",
    },
    {
      name: "Crosswind",
      sub: "A cross that refuses to stay still.",
      shape: "crossMove",
    },
    {
      name: "Orbit",
      sub: "Enter the ring. Stay in control.",
      shape: "circleMove",
    },
    { name: "Frostbite", sub: "Some tiles need two hits.", shape: "diamond" },
    {
      name: "Firefly",
      sub: "One hot hit can change everything.",
      shape: "Umove",
    },
    {
      name: "Blue Rush",
      sub: "Speed, water and colour collide.",
      shape: "diamondMove",
    },
    { name: "Rangstorm", sub: "Everything you have learned.", shape: "combo" },
  ];

  const TILE_COLORS = [
    "#ff5d73",
    "#ff9f43",
    "#ffd43b",
    "#35c978",
    "#22c7a7",
    "#35bdf5",
    "#4d7cff",
    "#9b63ff",
    "#f05bd8",
  ];
  const I18N = {
    en: {
      play: "PLAY",
      levels: "LEVELS",
      about: "ABOUT",
      liked: "♥ I LIKED IT",
      share: "↗ SHARE",
      feedback: "✎ FEEDBACK",
      touch: "Touch / drag to move the paddle",
      choose: "Choose your level",
      back: "Back",
      level: "LEVEL",
      best: "BEST",
      score: "SCORE",
      retry: "RETRY",
      next: "NEXT LEVEL",
      bonus: "BONUS ROUND",
      home: "HOME",
      close: "CLOSE",
      aboutTitle: "About Rang",
      feedbackTitle: "Make Rang better",
      copy: "SEND FEEDBACK",
      newBest: "NEW PERSONAL BEST",
      clear: "LEVEL CLEAR",
      runEnded: "RUN ENDED",
      crossed: "The line was crossed",
      bonusTitle: "Floating Skies",
      bonusSub: "Catch the floating tiles before they drift away.",
      bonusEarned: "A new best + a cleared level unlocked a bonus round.",
      bonusLost: "Bonus missed. Keep the run going.",
      bonusWin: "Bonus complete! +",
      loading: "Loading level",
      openSource: "Open-source MWeb brick breaker",
      vibe: "Vibe coded • built for the community",
      github: "GitHub",
      write: "Write a thought. It will open as a GitHub issue.",
      emptyFeedback: "Write a little feedback first.",
      feedbackSent: "Thanks! Your feedback was submitted.",
      feedbackFallback:
        "Feedback could not be submitted. It was copied instead.",
      settings: "SETTINGS",
      appearance: "APPEARANCE",
      language: "LANGUAGE",
      system: "SYSTEM",
      light: "LIGHT",
      dark: "DARK",
      pausedTitle: "GAME PAUSED",
      pausedText: "You paused the game. Do you want to return to Home?",
      stay: "STAY",
      goHome: "GO HOME",
    },

    hi: {
      play: "खेलें",
      levels: "लेवल",
      about: "हमारे बारे में",
      liked: "♥ पसंद आया",
      share: "↗ शेयर",
      feedback: "✎ प्रतिक्रिया",
      touch: "पैडल चलाने के लिए टच / ड्रैग करें",
      choose: "लेवल चुनें",
      back: "वापस",
      level: "लेवल",
      best: "सर्वश्रेष्ठ",
      score: "स्कोर",
      retry: "फिर से",
      next: "अगला लेवल",
      bonus: "बोनस राउंड",
      home: "होम",
      close: "बंद करें",
      aboutTitle: "Rang के बारे में",
      feedbackTitle: "Rang को बेहतर बनाएं",
      copy: "फीडबैक भेजें",
      newBest: "नया व्यक्तिगत रिकॉर्ड",
      clear: "लेवल पूरा",
      runEnded: "रन समाप्त",
      crossed: "लाइन पार हो गई",
      bonusTitle: "Floating Skies",
      bonusSub: "तैरती टाइलों को उनके बहने से पहले तोड़ें।",
      bonusEarned: "नए रिकॉर्ड और लेवल पूरा करने पर बोनस राउंड मिला।",
      bonusLost: "बोनस छूट गया। खेल जारी रखें।",
      bonusWin: "बोनस पूरा! +",
      loading: "लेवल लोड हो रहा है",
      openSource: "ओपन-सोर्स MWeb ब्रिक ब्रेकर",
      vibe: "Vibe coded • कम्युनिटी के लिए बनाया गया",
      github: "GitHub",
      write: "अपना विचार लिखें। यह GitHub issue के रूप में खुलेगा।",
      emptyFeedback: "पहले थोड़ा फीडबैक लिखें.",
      feedbackSent: "धन्यवाद! आपका फीडबैक सबमिट किया गया।",
      feedbackFallback: "फीडबैक सबमिट नहीं हो सका। इसे कॉपी कर दिया गया है।",
      settings: "सेटिंग्स",
      appearance: "दिखावट",
      language: "भाषा",
      system: "सिस्टम",
      light: "लाइट",
      dark: "डार्क",
      pausedTitle: "गेम थाम दिया गया",
      pausedText: "गेम थाम दिया है। क्या आप होम पर जाना चाहते हैं?",
      stay: "यहीं रहें",
      goHome: "होम पर जाएं",
    },

    gu: {
      play: "રમો",
      levels: "લેવલ્સ",
      about: "અમારા વિશે",
      liked: "♥ ગમ્યું",
      share: "↗ શેર",
      feedback: "✎ પ્રતિસાદ",
      touch: "પેડલ ચલાવવા ટચ / ડ્રેગ કરો",
      choose: "લેવલ પસંદ કરો",
      back: "પાછળ",
      level: "લેવલ",
      best: "શ્રેષ્ઠ",
      score: "સ્કોર",
      retry: "ફરી રમો",
      next: "આગળનું લેવલ",
      bonus: "બોનસ રાઉન્ડ",
      home: "હોમ",
      close: "બંધ",
      aboutTitle: "Rang વિશે",
      feedbackTitle: "Rang ને વધુ સારું બનાવો",
      copy: "પ્રતિસાદ મોકલો",
      newBest: "નવો વ્યક્તિગત રેકોર્ડ",
      clear: "લેવલ પૂર્ણ",
      runEnded: "રન સમાપ્ત",
      crossed: "લાઇન પાર થઈ",
      bonusTitle: "Floating Skies",
      bonusSub: "તરતી ટાઇલ્સને દૂર જતાં પહેલાં તોડો.",
      bonusEarned: "નવો રેકોર્ડ અને લેવલ પૂર્ણ કર્યા બદલ બોનસ રાઉન્ડ.",
      bonusLost: "બોનસ ચૂકી ગયા. રન ચાલુ રાખો.",
      bonusWin: "બોનસ પૂર્ણ! +",
      loading: "લેવલ લોડ થઈ રહ્યું છે",
      openSource: "ઓપન-સોર્સ MWeb બ્રિક બ્રેકર",
      vibe: "Vibe coded • કમ્યુનિટી માટે બનાવેલું",
      github: "GitHub",
      write: "તમારો વિચાર લખો. તે GitHub issue તરીકે ખુલશે.",
      emptyFeedback: "પહેલા થોડો પ્રતિસાદ લખો.",
      feedbackSent: "આભાર! તમારો પ્રતિસાદ સબમિટ થયો.",
      feedbackFallback:
        "પ્રતિસાદ સબમિટ થઈ શક્યો નહીં. તેને કૉપી કરવામાં આવ્યો છે.",
      settings: "સેટિંગ્સ",
      appearance: "દેખાવ",
      language: "ભાષા",
      system: "સિસ્ટમ",
      light: "લાઇટ",
      dark: "ડાર્ક",
      pausedTitle: "ગેમ થોભાવવામાં આવી",
      pausedText: "ગેમ થોભાવી છે. શું તમે હોમ પર જવા માંગો છો?",
      stay: "અહીં રહો",
      goHome: "હોમ પર જાઓ",
    },

    ja: {
      play: "プレイ",
      levels: "レベル",
      about: "Rangについて",
      liked: "♥ 気に入った",
      share: "↗ シェア",
      feedback: "✎ フィードバック",
      touch: "タッチ / ドラッグでパドルを動かす",
      choose: "レベルを選ぶ",
      back: "戻る",
      level: "LEVEL",
      best: "BEST",
      score: "SCORE",
      retry: "リトライ",
      next: "次のレベル",
      bonus: "ボーナス",
      home: "ホーム",
      close: "閉じる",
      aboutTitle: "Rangについて",
      feedbackTitle: "Rangをもっと良くする",
      copy: "フィードバック送信",
      newBest: "自己ベスト更新",
      clear: "レベルクリア",
      runEnded: "ゲーム終了",
      crossed: "ラインを越えました",
      bonusTitle: "Floating Skies",
      bonusSub: "漂うタイルを落ちる前に壊そう。",
      bonusEarned: "自己ベスト更新＋レベルクリアでボーナス！",
      bonusLost: "ボーナス失敗。次へ進もう。",
      bonusWin: "ボーナス成功！ +",
      loading: "レベルを読み込み中",
      openSource: "オープンソースのMWebブロック崩し",
      vibe: "Vibe coded • コミュニティで開発中",
      github: "GitHub",
      write: "感想を書いてください。GitHub issueとして開きます。",
      emptyFeedback: "まず感想を書いてください。",
      feedbackSent: "ありがとう！フィードバックを送信しました。",
      feedbackFallback: "送信できませんでした。コピーしました。",
      settings: "設定",
      appearance: "外観",
      language: "言語",
      system: "システム",
      light: "ライト",
      dark: "ダーク",
      pausedTitle: "ゲーム一時停止",
      pausedText: "ゲームを一時停止しました。ホームに戻りますか？",
      stay: "ゲームに戻る",
      goHome: "ホームへ",
    },

    es: {
      play: "JUGAR",
      levels: "NIVELES",
      about: "ACERCA DE",
      liked: "♥ ME GUSTÓ",
      share: "↗ COMPARTIR",
      feedback: "✎ OPINIÓN",
      touch: "Toca / arrastra para mover la pala",
      choose: "Elige tu nivel",
      back: "Volver",
      level: "NIVEL",
      best: "RÉCORD",
      score: "PUNTOS",
      retry: "REINTENTAR",
      next: "SIGUIENTE",
      bonus: "BONUS",
      home: "INICIO",
      close: "CERRAR",
      aboutTitle: "Sobre Rang",
      feedbackTitle: "Mejora Rang",
      copy: "ENVIAR OPINIÓN",
      newBest: "NUEVO RÉCORD",
      clear: "NIVEL COMPLETADO",
      runEnded: "PARTIDA TERMINADA",
      crossed: "Cruzaste la línea",
      bonusTitle: "Floating Skies",
      bonusSub: "Rompe las piezas flotantes antes de que se escapen.",
      bonusEarned: "Nuevo récord + nivel completado = bonus.",
      bonusLost: "Bonus perdido. Sigue jugando.",
      bonusWin: "¡Bonus completo! +",
      loading: "Cargando nivel",
      openSource: "Brick breaker MWeb de código abierto",
      vibe: "Vibe coded • hecho para la comunidad",
      github: "GitHub",
      write: "Escribe una idea. Se abrirá como GitHub issue.",
      emptyFeedback: "Escribe primero tu opinión.",
      feedbackSent: "¡Gracias! Tu opinión fue enviada.",
      feedbackFallback: "No se pudo enviar. La opinión fue copiada.",
      settings: "AJUSTES",
      appearance: "APARIENCIA",
      language: "IDIOMA",
      system: "SISTEMA",
      light: "CLARO",
      dark: "OSCURO",
      pausedTitle: "JUEGO EN PAUSA",
      pausedText: "Has pausado el juego. ¿Quieres volver al inicio?",
      stay: "QUEDARME",
      goHome: "IR AL INICIO",
    },
  };

  const FEEDBACK_CONFIG = {
    owner: "Kashyap-Nirmal",
    repo: "rang-brick-breaker",
  };

  let lang = "en";
  let W = 1,
    H = 1,
    DPR = 1,
    last = 0,
    raf = 0,
    best = Number(
      localStorage.getItem("rang.best.v015") ||
        localStorage.getItem("rang.best.v014") ||
        0,
    );
  let unlocked = Math.max(
    1,
    Number(
      localStorage.getItem("rang.unlocked.v015") ||
        localStorage.getItem("rang.unlocked.v014") ||
        1,
    ),
  );
  if (ENV.TEST_LEVELS === 0) {
    unlocked = LEVELS.length;
  }
  const S = {
    running: false,
    mode: "normal",
    level: 1,
    score: 0,
    bestCrossed: false,
    bricks: [],
    particles: [],
    floaters: [],
    moving: [],
    ball: { x: 0, y: 0, vx: 0, vy: 0, r: 7, color: "#fff" },
    paddle: { x: 0, y: 0, w: 92, h: 12 },
    lossY: 0,
    fireHits: 0,
    bounceTimer: 0,
    waterTimer: 0,
    elapsed: 0,
    bonusRespawns: 3,
    bonusReward: 0,
    previousLevel: 1,
  };

  const t = (k) => (I18N[lang] || I18N.en)[k] || I18N.en[k] || k;
  function isDark() {
    const f = document.documentElement.dataset.forcedTheme;
    if (f === "dark") return true;
    if (f === "light") return false;
    return matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function setText() {
    $("playBtn").textContent = t("play");
    $("levelsBtn").textContent = t("levels");
    $("aboutBtn").textContent = t("about");
    $("likedBtn").textContent = t("liked");
    $("shareBtn").textContent = t("share");
    $("feedbackBtn").textContent = t("feedback");
    $("touchHint").textContent = t("touch");
    $("levelsTitle").textContent = t("choose");
    $("backBtn").setAttribute("aria-label", t("back"));
    $("aboutTitle").textContent = t("aboutTitle");
    $("feedbackTitle").textContent = t("feedbackTitle");
    $("feedbackSaveBtn").textContent = t("copy");
    $("feedbackCloseBtn").textContent = t("close");
    $("githubLink").textContent = t("github");
    $("levelLabel").textContent = t("level");
    $("scoreLabel").textContent = t("score");
    $("bestLabel").textContent = t("best");
    $("homeBtn").setAttribute("aria-label", t("home"));
    $("aboutCloseBtn").textContent = t("close");
    $("feedbackCopyHint").textContent = t("write");

    if ($("settingsBtn")) {
      $("settingsBtn").setAttribute("aria-label", t("settings"));
      $("settingsBtn").textContent = "⚙";
    }

    $("resultHomeBtn").onclick = () => {
      S.running = false;
      S.mode = "normal";
      show("menu");
    };

    updateHud();
  }
  async function detectLanguage() {
    const saved = localStorage.getItem("rang.language");
    const browser = (navigator.language || "en").toLowerCase();
    if (saved && I18N[saved]) {
      lang = saved;
      setText();
      return;
    }
    if (browser.startsWith("hi")) lang = "hi";
    else if (browser.startsWith("gu")) lang = "gu";
    else if (browser.startsWith("ja")) lang = "ja";
    else if (browser.startsWith("es")) lang = "es";
    else lang = "en";
    setText();
    try {
      const c = new AbortController();
      setTimeout(() => c.abort(), 1200);
      const r = await fetch("https://ipapi.co/json/", {
        signal: c.signal,
        cache: "no-store",
      });
      if (r.ok) {
        const d = await r.json();
        const country = (d.country_code || "").toUpperCase();
        if (country === "JP") lang = "ja";
        else if (country === "ES" || country === "MX" || country === "AR")
          lang = "es";
        else if (country === "IN" && browser.startsWith("gu")) lang = "gu";
        else if (country === "IN" && browser.startsWith("hi")) lang = "hi";
        setText();
      }
    } catch (_) {
      /* browser language is the safe fallback */
    }
  }

  function show(id) {
    screens.forEach((x) => $(x).classList.remove("active"));
    if (id) $(id).classList.add("active");
  }
  function showLoader(title) {
    $("levelLoaderTitle").textContent = title || t("loading");
    $("levelLoader").classList.add("active");
  }
  function hideLoader() {
    setTimeout(() => $("levelLoader").classList.remove("active"), 260);
  }

  function resize() {
    const oldW = W,
      oldH = H,
      oldBall = { ...S.ball };
    W = Math.max(280, innerWidth);
    H = Math.max(420, innerHeight);
    DPR = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    S.paddle.w = Math.max(74, Math.min(118, W * 0.23));
    S.paddle.h = Math.max(10, Math.min(14, W * 0.028));
    S.paddle.y = H * 0.805;
    S.lossY = H + S.ball.r;
    if (oldW > 1 && oldH > 1 && S.running) {
      const sx = W / oldW,
        sy = H / oldH;
      S.ball.x = Math.min(W - S.ball.r, Math.max(S.ball.r, oldBall.x * sx));
      S.ball.y = Math.min(
        S.paddle.y - S.ball.r - 1,
        Math.max(S.ball.r, oldBall.y * sy),
      );
      S.paddle.x = Math.min(
        W - S.paddle.w / 2,
        Math.max(S.paddle.w / 2, S.paddle.x * sx),
      );
      for (const br of S.bricks) {
        br.x *= sx;
        br.baseX *= sx;
        br.w *= sx;
        br.y *= sy;
        br.baseY *= sy;
        br.h *= sy;
      }
    } else S.paddle.x = W / 2;
  }
  addEventListener("resize", resize, { passive: true });
  addEventListener("orientationchange", () => setTimeout(resize, 60), {
    passive: true,
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () =>
    draw(),
  );

  $("playBtn").onclick = () => start(1);
  $("levelsBtn").onclick = renderLevels;
  $("aboutBtn").onclick = () => show("about");
  $("settingsBtn") && ($("settingsBtn").onclick = () => show("settings"));
  $("backBtn").onclick = () => show("menu");
  $("homeBtn").onclick = () => requestHomeFromGame();
  $("aboutCloseBtn").onclick = () => show("menu");
  $("settingsCloseBtn") && ($("settingsCloseBtn").onclick = () => show("menu"));
  $("feedbackBtn").onclick = () => show("feedback");
  $("feedbackCloseBtn").onclick = () => show("menu");
  $("feedbackSaveBtn").onclick = async () => {
    const feedback = $("feedbackText").value.trim();

    if (!feedback) {
      $("homeStatus").textContent = t("emptyFeedback");
      show("menu");
      return;
    }

    const title = "Rang feedback";
    const body = [
      feedback,
      "",
      "---",
      `Language: ${lang}`,
      `Level: ${S.level}`,
      `Score: ${S.score}`,
      `User agent: ${navigator.userAgent}`,
    ].join("\n");

    const issueUrl =
      `https://github.com/${FEEDBACK_CONFIG.owner}/` +
      `${FEEDBACK_CONFIG.repo}/issues/new?` +
      `title=${encodeURIComponent(title)}&` +
      `body=${encodeURIComponent(body)}`;

    $("feedbackText").value = "";

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(body);
      }
    } catch (_) {
      // Clipboard is only a fallback.
    }

    window.open(issueUrl, "_blank", "noopener,noreferrer");

    $("homeStatus").textContent = t("feedbackSent");
    show("menu");
  };
  $("likedBtn").onclick = () => {
    localStorage.setItem("rang.liked.v015", "1");
    $("homeStatus").textContent = "♥ Thank you — saved on this device.";
  };
  $("shareBtn").onclick = async () => {
    const data = {
      title: "Rang",
      text: `I played Rang — ${levelName(S.level)} · ${S.score} points.`,
      url: location.href,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard?.writeText(`${data.text} ${data.url}`);
        $("homeStatus").textContent = "Share text copied.";
      }
    } catch (_) {}
  };
  $("retryBtn").onclick = () => start(1);
  $("nextBtn").onclick = () => start(Math.min(LEVELS.length, S.level + 1));
  $("bonusBtn").onclick = () => startBonus();

  function requestHomeFromGame() {
    if (!S.running) {
      show("menu");
      return;
    }
    S.running = false;
    const d = $("pauseDialog");
    if (d) {
      d.classList.add("active");
      setText();
    }
  }
  function closePauseDialog(resume) {
    const d = $("pauseDialog");
    if (d) d.classList.remove("active");
    if (resume) {
      S.running = true;
      last = performance.now();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    } else {
      S.mode = "normal";
      show("menu");
    }
  }
  if ($("pauseStayBtn"))
    $("pauseStayBtn").onclick = () => closePauseDialog(true);
  if ($("pauseHomeBtn"))
    $("pauseHomeBtn").onclick = () => closePauseDialog(false);

  function levelName(n) {
    return LEVELS[n - 1]?.name || `Level ${n}`;
  }
  function renderLevels() {
    const grid = $("levelGrid");
    grid.textContent = "";
    LEVELS.forEach((v, i) => {
      const n = i + 1,
        locked = n > unlocked,
        b = document.createElement("button");
      b.className = "level-card" + (locked ? " locked" : "");
      b.disabled = locked;
      const art = document.createElement("div");
      art.className = "card-art";
      const mini = document.createElement("canvas");
      mini.className = "preview-canvas";
      art.appendChild(mini);
      drawPreview(mini, v.shape, n);
      const meta = document.createElement("div");
      meta.className = "card-meta";
      const num = document.createElement("span");
      num.textContent = `${t("level")} ${String(n).padStart(2, "0")}`;
      const tag = document.createElement("span");
      tag.textContent = locked ? "🔒" : "●";
      meta.append(num, tag);
      const h = document.createElement("h3");
      h.textContent = v.name;
      const p = document.createElement("p");
      p.textContent = v.sub;
      const cta = document.createElement("span");
      cta.className = "card-cta";
      cta.textContent = locked ? "LOCKED" : "PLAY →";
      b.append(art, meta, h, p, cta);
      b.onclick = () => start(n);
      grid.append(b);
    });
    show("levels");
  }
  function drawPreview(canvasEl, shape, n) {
    const w = canvasEl.clientWidth || 280,
      h = canvasEl.clientHeight || 92,
      d = Math.min(2, devicePixelRatio || 1);
    canvasEl.width = w * d;
    canvasEl.height = h * d;
    const c = canvasEl.getContext("2d");
    c.setTransform(d, 0, 0, d, 0, 0);
    const dark = isDark();
    const g = c.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, dark ? "#122b45" : "#e6f5ff");
    g.addColorStop(1, dark ? "#081522" : "#cfeaff");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    const colors = TILE_COLORS;
    const bw = 22,
      bh = 7,
      gap = 4,
      cx = w / 2,
      cy = h / 2;
    const tile = (x, y, i) => {
      c.fillStyle = colors[i % colors.length];
      c.beginPath();
      c.roundRect(x, y, bw, bh, 3);
      c.fill();
    };
    if (shape === "sides" || shape === "sidesMove") {
      for (let i = 0; i < 5; i++) {
        tile(25, 15 + i * 12, i);
        tile(w - 47, 15 + i * 12, i + 5);
      }
    } else if (shape === "invU") {
      for (let i = 0; i < 6; i++) tile(32 + i * 28, 17, i);
      tile(32, 29, 6);
      tile(w - 54, 29, 7);
      tile(32, 41, 8);
      tile(w - 54, 41, 0);
    } else if (shape === "U") {
      for (let i = 0; i < 6; i++) tile(32 + i * 28, 17, i);
      tile(32, 29, 6);
      tile(32, 41, 7);
      tile(w - 54, 29, 8);
      tile(w - 54, 41, 0);
    } else if (shape === "square") {
      for (let i = 0; i < 6; i++) {
        tile(30 + i * 29, 16, i);
        tile(30 + i * 29, 48, i + 2);
      }
      tile(30, 28, 6);
      tile(30, 38, 7);
      tile(w - 52, 28, 8);
      tile(w - 52, 38, 0);
    } else if (shape.includes("circle")) {
      for (let i = 0; i < 11; i++) {
        const a = (i * Math.PI * 2) / 12;
        if (i === 5) continue;
        tile(cx + Math.cos(a) * 48 - bw / 2, cy + Math.sin(a) * 25 - bh / 2, i);
      }
    } else {
      for (let i = 0; i < 5; i++) tile(30 + i * 29, 40, i);
      for (let i = 0; i < 5; i++) tile(cx - bw / 2, 16 + i * 12, i + 5);
    }
    c.fillStyle = dark ? "#fff" : "#122033";
    c.beginPath();
    c.arc(cx, h - 15, 5, 0, Math.PI * 2);
    c.fill();
  }

  async function start(level) {
    const newRun = level === 1;
    S.mode = "normal";
    S.level = Math.max(1, Math.min(LEVELS.length, level));
    if (newRun) S.score = 0;
    S.bestCrossed = false;
    S.running = false;
    S.particles = [];
    S.floaters = [];
    S.fireHits = 0;
    S.bounceTimer = 0;
    S.waterTimer = 0;
    S.elapsed = 0;
    S.bonusRespawns = 3;
    buildLevel(S.level, false);
    show(null);
    showLoader(`${t("loading")} · ${levelName(S.level)}`);
    cancelAnimationFrame(raf);
    await new Promise((r) => setTimeout(r, 650));
    hideLoader();
    S.running = true;
    last = performance.now();
    raf = requestAnimationFrame(loop);
    beep(620, 0.045, "sine");
  }

  function layoutType(n) {
    return LEVELS[n - 1]?.shape || "combo";
  }
  function colorForIndex(i) {
    return TILE_COLORS[Math.abs(i) % TILE_COLORS.length];
  }
  function addBrick(x, y, w, h, type = "normal", color) {
    S.bricks.push({
      x,
      y,
      w,
      h,
      type,
      color: color || colorForIndex(S.bricks.length),
      hp: type === "ice" ? 2 : 1,
      maxHp: type === "ice" ? 2 : 1,
      alive: true,
      baseX: x,
      baseY: y,
      phase: Math.random() * Math.PI * 2,
    });
  }
  function buildLevel(n, preserveBall) {
    const oldBall = { ...S.ball };
    S.bricks = [];
    S.moving = [];
    const bw = Math.max(24, Math.min(42, W * 0.085)),
      bh = Math.max(14, Math.min(20, W * 0.042)),
      gap = Math.max(4, bw * 0.18),
      top = H * 0.2;
    const addRow = (count, y, startX) => {
      for (let i = 0; i < count; i++)
        addBrick(startX + i * (bw + gap), y, bw, bh, specialFor(n, i));
    };
    const specialFor = (lv, i) =>
      lv >= 6 && (i + lv) % 9 === 0
        ? "ice"
        : lv >= 7 && (i * 3 + lv) % 13 === 0
          ? "fire"
          : lv >= 8 && (i + 2 * lv) % 15 === 0
            ? "bounce"
            : lv >= 10 && (i + lv) % 11 === 0
              ? "water"
              : "normal";
    const type = layoutType(n);
    if (type === "sides" || type === "sidesMove") {
      const count = Math.max(5, Math.min(7, Math.floor(H / 125))),
        x1 = Math.max(18, W * 0.12),
        x2 = Math.min(W - bw - 18, W - W * 0.12 - bw);
      for (let i = 0; i < count; i++) {
        addBrick(x1, top + i * (bh + gap), bw, bh, specialFor(n, i));
        addBrick(x2, top + i * (bh + gap), bw, bh, specialFor(n, i + count));
      }
      if (type === "sidesMove")
        S.moving.push({
          kind: "side",
          x1,
          x2,
          amp: Math.min(35, W * 0.08),
          speed: 0.55,
        });
    } else if (type === "invU") {
      const c = Math.min(8, Math.max(5, Math.floor(W / (bw + gap))));
      addRow(c, top, W / 2 - (c * (bw + gap) - gap) / 2);
      for (let i = 1; i < 3; i++) {
        addBrick(
          W / 2 - (c * (bw + gap) - gap) / 2,
          top + i * (bh + gap),
          bw,
          bh,
          specialFor(n, i),
        );
        addBrick(
          W / 2 + (c * (bw + gap) - gap) / 2 - bw,
          top + i * (bh + gap),
          bw,
          bh,
          specialFor(n, i + c),
        );
      }
    } else if (type === "U") {
      const c = Math.min(8, Math.max(5, Math.floor(W / (bw + gap)))),
        sx = (W - (c * (bw + gap) - gap)) / 2;
      addRow(c, top, sx);
      for (let i = 1; i < 4; i++) {
        addBrick(sx, top + i * (bh + gap), bw, bh, specialFor(n, i));
        addBrick(
          sx + (c - 1) * (bw + gap),
          top + i * (bh + gap),
          bw,
          bh,
          specialFor(n, i + c),
        );
      }
    } else if (type === "square") {
      const c = Math.min(7, Math.max(4, Math.floor(W / (bw + gap))));
      const width = c * (bw + gap) - gap;
      const sx = (W - width) / 2;
      addRow(c, top, sx);
      addRow(c, top + 3 * (bh + gap), sx);
      for (let i = 1; i < 3; i++) {
        addBrick(sx, top + i * (bh + gap), bw, bh, specialFor(n, i));
        addBrick(
          sx + (c - 1) * (bw + gap),
          top + i * (bh + gap),
          bw,
          bh,
          specialFor(n, i + c),
        );
      }
    } else if (type.includes("circle")) {
      const cx = W / 2,
        cy = H * 0.31,
        rx = Math.min(W * 0.3, 145),
        ry = Math.min(H * 0.13, 92),
        count = 12;
      for (let i = 0; i < count; i++) {
        if (i === Math.floor(count / 2)) continue;
        const a = (i * Math.PI * 2) / count;
        addBrick(
          cx + Math.cos(a) * rx - bw / 2,
          cy + Math.sin(a) * ry - bh / 2,
          bw,
          bh,
          specialFor(n, i),
        );
      }
      if (type === "circleMove")
        S.moving.push({ kind: "ring", cx, cy, rx, ry, speed: 0.48 });
    } else if (type.includes("diamond")) {
      [2, 4, 6, 4, 2].forEach((c, r) =>
        addRow(c, top + r * (bh + gap), W / 2 - (c * (bw + gap) - gap) / 2),
      );
      if (type === "diamondMove")
        S.moving.push({
          kind: "row",
          y: top + 2 * (bh + gap),
          amp: Math.min(60, W * 0.15),
          speed: 0.55,
        });
    } else if (type.includes("cross")) {
      const c = Math.min(9, Math.max(5, Math.floor(W / (bw + gap))));
      for (let i = 0; i < c; i++)
        addBrick(
          W / 2 - (c * (bw + gap) - gap) / 2 + i * (bw + gap),
          top + 2 * (bh + gap),
          bw,
          bh,
          specialFor(n, i),
        );
      for (let i = 0; i < 5; i++)
        addBrick(
          W / 2 - bw / 2,
          top + i * (bh + gap),
          bw,
          bh,
          specialFor(n, i + 5),
        );
      S.moving.push({
        kind: "row",
        y: top + 2 * (bh + gap),
        amp: Math.min(65, W * 0.16),
        speed: 0.65,
      });
    } else {
      const c = Math.min(9, Math.max(5, Math.floor(W / (bw + gap))));
      for (let r = 0; r < 4; r++)
        addRow(c, top + r * (bh + gap), W / 2 - (c * (bw + gap) - gap) / 2);
      S.moving.push({
        kind: "row",
        y: top + bh * 2 + gap,
        amp: Math.min(70, W * 0.17),
        speed: 0.5,
      });
    }
    if (n >= 2 && S.bricks.length) {
      const idx = (n * 7) % S.bricks.length;
      S.bricks[idx].type = "star";
      S.bricks[idx].color = "#ffd43b";
    }
    if (n >= 9 && !S.bricks.some((b) => b.type === "ice")) {
      const x = S.bricks[Math.floor(S.bricks.length / 2)];
      x.type = "ice";
      x.hp = 2;
      x.maxHp = 2;
      x.color = "#5bc8ff";
    }
    if (n >= 12 && !S.bricks.some((b) => b.type === "water")) {
      const x = S.bricks[Math.floor(S.bricks.length / 3)];
      x.type = "water";
      x.color = "#20b8ee";
    }
    const speed = Math.min(560, 315 + n * 12),
      ang = n % 2 ? -0.68 : 0.62;
    S.ball = {
      x: W / 2,
      y: S.paddle.y - 40,
      vx: Math.sin(ang) * speed,
      vy: -Math.cos(ang) * speed,
      r: Math.max(6, Math.min(9, W * 0.018)),
      color: isDark() ? "#ffffff" : "#102033",
    };
    if (preserveBall)
      S.ball = {
        ...oldBall,
        x: Math.min(W - oldBall.r, Math.max(oldBall.r, oldBall.x)),
        y: Math.min(S.paddle.y - oldBall.r - 1, Math.max(oldBall.r, oldBall.y)),
      };
    updateHud();
  }

  async function startBonus() {
    S.mode = "bonus";
    S.running = false;
    S.level = S.previousLevel;
    S.score += 0;
    S.bonusRespawns = 3;
    S.bonusReward = 0;
    S.bestCrossed = false;
    S.particles = [];
    S.floaters = [];
    S.fireHits = 0;
    S.bounceTimer = 0;
    S.waterTimer = 0;
    S.elapsed = 0;
    buildBonus();
    show(null);
    showLoader(`${t("loading")} · ${t("bonusTitle")}`);
    cancelAnimationFrame(raf);
    await new Promise((r) => setTimeout(r, 700));
    hideLoader();
    S.running = true;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }
  function buildBonus() {
    S.bricks = [];
    S.moving = [];
    const count = Math.min(18, Math.max(10, Math.floor(W / 35)));
    for (let i = 0; i < count; i++) {
      const y = H * 0.2 + Math.random() * H * 0.3,
        x = 20 + Math.random() * (W - 60),
        size = Math.max(26, Math.min(40, W * 0.075));
      addBrick(x, y, size, size * 0.48, "bonus", colorForIndex(i));
      S.bricks[S.bricks.length - 1].vx = (Math.random() - 0.5) * 22;
      S.bricks[S.bricks.length - 1].vy = 10 + Math.random() * 18;
    }
    const speed = 350;
    S.ball = {
      x: W / 2,
      y: S.paddle.y - 40,
      vx: 120,
      vy: -speed,
      r: Math.max(6, Math.min(9, W * 0.018)),
      color: "#fff0a8",
    };
    updateHud();
  }

  function loop(now) {
    const dt = Math.min(0.022, (now - last) / 1000 || 0.016);
    last = now;
    if (S.running) {
      update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    }
  }
  function update(dt) {
    S.elapsed += dt;
    S.bounceTimer = Math.max(0, S.bounceTimer - dt);
    S.waterTimer = Math.max(0, S.waterTimer - dt);
    updateMoving();
    if (S.mode === "bonus") updateBonusTiles(dt);
    const b = S.ball,
      p = S.paddle;
    const boost = S.bounceTimer > 0 ? 1.12 : 1,
      slow = S.waterTimer > 0 ? 0.72 : 1;
    b.x += b.vx * dt * boost * slow;
    b.y += b.vy * dt * boost * slow;
    if (b.x - b.r <= 0) {
      b.x = b.r;
      b.vx = Math.abs(b.vx);
    }
    if (b.x + b.r >= W) {
      b.x = W - b.r;
      b.vx = -Math.abs(b.vx);
    }
    if (b.y - b.r <= 0) {
      b.y = b.r;
      b.vy = Math.abs(b.vy);
    }
    if (b.vy > 0 && circleRect(b.x, b.y, b.r, p.x - p.w / 2, p.y, p.w, p.h)) {
      b.y = p.y - b.r - 0.2;
      const rel = (b.x - p.x) / (p.w / 2),
        angle = Math.max(-1.08, Math.min(1.08, rel * 0.95)),
        sp = Math.max(320, Math.hypot(b.vx, b.vy));
      b.vx = Math.sin(angle) * sp;
      b.vy = -Math.cos(angle) * sp;
      beep(520, 0.025, "sine");
    }
    if (b.y + b.r >= S.lossY) {
      b.y = S.lossY - b.r;
      if (S.mode === "bonus") bonusFail();
      else endRun();
      return;
    }
    for (const br of S.bricks) {
      if (!br.alive) continue;
      if (hitBallBrick(br)) {
        if (S.mode === "bonus") {
          br.alive = false;
          S.bonusReward += 15;
          addScore(15);
          burst(br.x + br.w / 2, br.y + br.h / 2, "star");
        } else {
          if (br.type === "star") collectStar(br);
          else hitBrick(br);
        }
        break;
      }
    }
    S.particles = S.particles.filter((q) => (q.life -= dt) > 0);
    for (const q of S.particles) {
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      q.vy += q.g * dt;
    }
    S.floaters = S.floaters.filter((q) => (q.life -= dt) > 0);
    for (const q of S.floaters) q.y -= 25 * dt;
    if (S.bricks.every((b) => !b.alive)) {
      if (S.mode === "bonus") bonusComplete();
      else complete();
    }
  }
  function updateBonusTiles(dt) {
    for (const b of S.bricks)
      if (b.alive) {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.x < 8 || b.x + b.w > W - 8) b.vx *= -1;
        if (b.y < 90 || b.y > H * 0.68) b.vy *= -1;
      }
  }
  function updateMoving() {
    const t0 = S.elapsed;
    for (const m of S.moving) {
      if (m.kind === "row")
        for (const b of S.bricks)
          if (Math.abs(b.baseY - m.y) < 2)
            b.x = b.baseX + Math.sin(t0 * m.speed) * m.amp;
      if (m.kind === "side") {
        for (const b of S.bricks)
          if (Math.abs(b.baseX - m.x1) < 2)
            b.x = b.baseX + Math.sin(t0 * m.speed + b.phase) * m.amp;
        for (const b of S.bricks)
          if (Math.abs(b.baseX - m.x2) < 2)
            b.x = b.baseX + Math.sin(t0 * m.speed + b.phase) * m.amp;
      }
      if (m.kind === "ring") {
        const alive = S.bricks.filter((b) => b.alive);
        alive.forEach((b, i) => {
          const a = (i * Math.PI * 2) / Math.max(1, alive.length);
          b.x = m.cx + Math.cos(a + t0 * m.speed) * m.rx - b.w / 2;
          b.y = m.cy + Math.sin(a + t0 * m.speed) * m.ry - b.h / 2;
        });
      }
    }
  }
  function circleRect(cx, cy, r, rx, ry, rw, rh) {
    const x = Math.max(rx, Math.min(cx, rx + rw)),
      y = Math.max(ry, Math.min(cy, ry + rh));
    return (cx - x) ** 2 + (cy - y) ** 2 <= r * r;
  }
  function hitBallBrick(br) {
    return circleRect(S.ball.x, S.ball.y, S.ball.r, br.x, br.y, br.w, br.h);
  }
  function hitBrick(br) {
    const b = S.ball;
    b.color = br.color;
    const dl = Math.abs(b.x + b.r - br.x),
      dr = Math.abs(br.x + br.w - (b.x - b.r)),
      dt = Math.abs(b.y + b.r - br.y),
      db = Math.abs(br.y + br.h - (b.y - b.r));
    if (Math.min(dl, dr) < Math.min(dt, db)) b.vx *= -1;
    else b.vy *= -1;
    if (br.type === "ice" && br.hp > 1) {
      br.hp--;
      toast("ICE · 2 HITS");
      burst(br.x + br.w / 2, br.y + br.h / 2, "ice");
      beep(280, 0.035, "triangle");
      return;
    }
    br.alive = false;
    let points = 10;
    if (br.type === "fire") {
      S.fireHits = 1;
      points = 20;
      toast("FIRE · next hit bursts");
    }
    if (br.type === "bounce") {
      S.bounceTimer = 4;
      points = 20;
      toast("BOUNCE · pace up");
    }
    if (br.type === "water") {
      S.waterTimer = 3.5;
      points = 20;
      toast("WATER · slow flow");
    }
    addScore(points);
    burst(br.x + br.w / 2, br.y + br.h / 2, br.type);
    beep(
      br.type === "fire" ? 760 : br.type === "bounce" ? 680 : 430,
      0.035,
      "square",
    );
    if (S.fireHits > 0 && br.type !== "fire") {
      S.fireHits = 0;
      const nearby = S.bricks
        .filter(
          (x) =>
            x.alive &&
            x !== br &&
            Math.abs(x.x - br.x) < br.w * 1.7 &&
            Math.abs(x.y - br.y) < br.h * 1.9,
        )
        .slice(0, 4);
      for (const x of nearby) {
        x.alive = false;
        addScore(10);
        burst(x.x + x.w / 2, x.y + x.h / 2, "fire");
      }
      beep(900, 0.055, "sawtooth");
    }
  }
  function collectStar(br) {
    hitBrick(br);
    addScore(25);
    burst(br.x + br.w / 2, br.y + br.h / 2, "star");
    floatText("+25 ★", br.x + br.w / 2, br.y);
    beep(880, 0.07, "sine");
  }
  function addScore(n) {
    const before = S.score;
    S.score += n;
    scorePill.classList.add("pop");
    setTimeout(() => scorePill.classList.remove("pop"), 130);
    if (!S.bestCrossed && S.score > best && before <= best) {
      S.bestCrossed = true;
      confetti();
      floatText("NEW BEST!", W / 2, H * 0.14, 1.15);
      beep(760, 0.08, "sine");
      setTimeout(() => beep(1040, 0.12, "sine"), 80);
    }
    updateHud();
  }
  function persistBest() {
    if (S.score > best) {
      best = S.score;
      localStorage.setItem("rang.best.v015", String(best));
    }
    updateHud();
  }
  function updateHud() {
    scoreText.textContent = S.score;
    bestText.textContent = best;
    levelText.textContent =
      S.mode === "bonus" ? "BONUS" : `${t("level")} ${S.level}`;
  }
  function complete() {
    if (!S.running) return;

    S.running = false;
    S.previousLevel = S.level;

    if (S.level === LEVELS.length) {
      persistBest();
    }

    if (S.level === unlocked && unlocked < LEVELS.length) {
      unlocked++;
      localStorage.setItem("rang.unlocked.v015", String(unlocked));
    }

    beep(720, 0.08, "sine");
    setTimeout(() => beep(920, 0.11, "sine"), 70);

    const eligible = S.bestCrossed;

    $("resultCard")?.classList.remove("single-action");

    $("resultKicker").textContent = eligible ? t("newBest") : t("clear");

    $("resultTitle").textContent = levelName(S.level);

    $("resultBody").textContent = eligible
      ? `${LEVELS[S.level - 1].sub} ${t("bonusEarned")}`
      : `${t("level")} ${S.level} complete · ` +
        `${S.score.toLocaleString()} ` +
        `${t("score").toLowerCase()}`;

    $("bonusBtn").style.display = eligible ? "block" : "none";

    $("nextBtn").textContent = t("next");
    $("nextBtn").style.display = eligible ? "none" : "block";

    $("retryBtn").textContent = t("retry");

    $("resultHomeBtn").style.display = "block";

    $("nextBtn").onclick = () => {
      start(S.level < LEVELS.length ? S.level + 1 : 1);
    };

    show("overlay");
  }
  function endRun() {
    S.running = false;
    persistBest();

    beep(170, 0.12, "sawtooth");

    $("resultKicker").textContent = t("runEnded");
    $("resultTitle").textContent = t("crossed");

    $("resultBody").textContent =
      `${t("score")} ${S.score.toLocaleString()} · ` +
      `${t("level")} ${S.level}`;

    $("bonusBtn").style.display = "none";
    $("nextBtn").style.display = "none";

    $("retryBtn").textContent = t("retry");
    $("retryBtn").style.display = "block";

    $("resultHomeBtn").textContent = t("home");
    $("resultHomeBtn").style.display = "block";

    $("resultCard")?.classList.remove("single-action");

    show("overlay");
  }
  function bonusFail() {
    S.running = false;

    $("resultCard")?.classList.remove("single-action");

    $("resultKicker").textContent = "BONUS";
    $("resultTitle").textContent = t("bonusLost");

    $("resultBody").textContent = `${t("score")} ${S.score.toLocaleString()}`;

    $("bonusBtn").style.display = "none";
    $("nextBtn").style.display = "block";

    $("nextBtn").textContent = t("next");

    $("nextBtn").onclick = () => {
      start(S.previousLevel < LEVELS.length ? S.previousLevel + 1 : 1);
    };

    $("retryBtn").textContent = t("retry");
    $("resultHomeBtn").style.display = "block";

    show("overlay");
    persistBest();
  }
  function bonusComplete() {
    S.running = false;

    const reward = 50 + S.bonusReward;

    S.score += reward;
    persistBest();

    floatText(`${t("bonusWin")}${reward}`, W / 2, H * 0.2, 1.2);

    confetti();
    beep(820, 0.08, "sine");
    setTimeout(() => beep(1080, 0.12, "sine"), 80);

    $("resultCard")?.classList.remove("single-action");

    $("resultKicker").textContent = t("bonus");
    $("resultTitle").textContent = t("bonusTitle");

    $("resultBody").textContent =
      `${t("bonusWin")}${reward} ` + `${t("score").toLowerCase()}`;

    $("bonusBtn").style.display = "none";
    $("nextBtn").style.display = "block";

    $("nextBtn").textContent = t("next");

    $("nextBtn").onclick = () => {
      start(S.previousLevel < LEVELS.length ? S.previousLevel + 1 : 1);
    };

    $("retryBtn").textContent = t("retry");
    $("resultHomeBtn").style.display = "block";

    show("overlay");
  }
  function toast(text) {
    floatText(text, W / 2, H * 0.14, 1.1);
  }
  function floatText(text, x, y, life = 0.8) {
    S.floaters.push({ text, x, y, life, max: life });
  }
  function burst(x, y, type) {
    const n = type === "star" || type === "bonus" ? 16 : 8;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2,
        s = 40 + Math.random() * 120;
      S.particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        g: 80,
        life: 0.35 + Math.random() * 0.35,
        max: 0.7,
        type,
      });
    }
  }
  function confetti() {
    for (let i = 0; i < 34; i++)
      S.particles.push({
        x: Math.random() * W,
        y: -10 - Math.random() * 80,
        vx: (Math.random() - 0.5) * 120,
        vy: 50 + Math.random() * 130,
        g: 120,
        life: 1.3 + Math.random() * 0.8,
        max: 2,
        type: "confetti",
      });
  }

  function draw() {
    const dark = isDark(),
      bg = dark ? "#08111f" : "#eaf3fb";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, dark ? "#0d2036" : "#d9efff");
    grad.addColorStop(1, bg);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = dark ? "#fff" : "#3979a8";
    for (let i = 0; i < 22; i++) {
      const x = (i * 83) % W,
        y = 70 + ((i * 137) % Math.max(100, H * 0.6));
      ctx.beginPath();
      ctx.arc(x, y, (i % 3) + 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (const br of S.bricks) if (br.alive) drawBrick(br, dark);
    ctx.fillStyle = dark ? "#f4f8ff" : "#102033";
    roundRect(
      ctx,
      S.paddle.x - S.paddle.w / 2,
      S.paddle.y,
      S.paddle.w,
      S.paddle.h,
      7,
    );
    ctx.fill();
    const b = S.ball;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = S.fireHits
      ? "#ff6b35"
      : S.bounceTimer > 0
        ? "#b67cff"
        : S.waterTimer > 0
          ? "#38bdf8"
          : b.color;
    ctx.fill();
    if (S.fireHits) {
      ctx.strokeStyle = "#ffd166";
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (S.waterTimer > 0) {
      ctx.strokeStyle = "#bae6fd";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    for (const q of S.particles) {
      ctx.globalAlpha = Math.max(0, q.life / q.max);
      ctx.fillStyle =
        q.type === "star"
          ? "#ffd43b"
          : q.type === "ice"
            ? "#79c8ff"
            : q.type === "fire"
              ? "#ff7043"
              : q.type === "confetti"
                ? (q.life * 10) % 2
                  ? "#fff"
                  : "#72a9ff"
                : dark
                  ? "#fff"
                  : "#1769e0";
      ctx.fillRect(
        q.x,
        q.y,
        q.type === "confetti" ? 5 : 3,
        q.type === "confetti" ? 7 : 3,
      );
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = "center";
    for (const f of S.floaters) {
      ctx.globalAlpha = Math.min(1, f.life / f.max);
      ctx.fillStyle = dark ? "#fff" : "#102033";
      ctx.font = '800 14px system-ui,-apple-system,"Segoe UI",sans-serif';
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;
  }
  function drawBrick(br, dark) {
    let fill = br.color,
      stroke = "rgba(16,32,51,.22)";
    if (br.type === "ice") {
      fill = dark ? "#20628b" : "#9fe1ff";
      stroke = dark ? "#83d2ff" : "#2d87b8";
    } else if (br.type === "fire") {
      fill = dark ? "#9a3d21" : "#ffb39a";
      stroke = "#e85d2a";
    } else if (br.type === "bounce") {
      fill = dark ? "#67419a" : "#e4cfff";
      stroke = "#8b5cf6";
    } else if (br.type === "water") {
      fill = dark ? "#0b718f" : "#a9ecff";
      stroke = "#0891b2";
    } else if (br.type === "star") {
      fill = dark ? "#806b1f" : "#ffe681";
      stroke = "#d9a800";
    }
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.5;
    roundRect(ctx, br.x, br.y, br.w, br.h, 5);
    ctx.fill();
    ctx.stroke();
    if (br.type === "star") {
      ctx.fillStyle = dark ? "#fff2a8" : "#7a5700";
      ctx.font = "800 13px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("★", br.x + br.w / 2, br.y + br.h / 2 + 1);
      ctx.textBaseline = "alphabetic";
    }
    if (br.type === "ice" && br.hp === 1) {
      ctx.strokeStyle = dark ? "#bde7ff" : "#4a9dcc";
      ctx.beginPath();
      ctx.moveTo(br.x + br.w * 0.25, br.y + 2);
      ctx.lineTo(br.x + br.w * 0.48, br.y + br.h * 0.55);
      ctx.lineTo(br.x + br.w * 0.38, br.y + br.h - 2);
      ctx.stroke();
    }
  }
  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }
  function beep(freq, dur, type) {
    try {
      const A = window.AudioContext || window.webkitAudioContext;
      if (!A) return;
      const ac = beep.ac || (beep.ac = new A());
      if (ac.state === "suspended") ac.resume();
      const o = ac.createOscillator(),
        g = ac.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.035, ac.currentTime + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
      o.connect(g).connect(ac.destination);
      o.start();
      o.stop(ac.currentTime + dur + 0.01);
    } catch (_) {}
  }

  let dragging = false;
  function move(clientX) {
    S.paddle.x = Math.max(
      S.paddle.w / 2,
      Math.min(W - S.paddle.w / 2, clientX),
    );
  }
  canvas.addEventListener(
    "pointerdown",
    (e) => {
      dragging = true;
      canvas.setPointerCapture?.(e.pointerId);
      move(e.clientX);
    },
    { passive: true },
  );
  canvas.addEventListener(
    "pointermove",
    (e) => {
      if (dragging) move(e.clientX);
    },
    { passive: true },
  );
  canvas.addEventListener("pointerup", () => (dragging = false), {
    passive: true,
  });
  canvas.addEventListener("pointercancel", () => (dragging = false), {
    passive: true,
  });

  const savedAppearance = localStorage.getItem("rang.appearance") || "system";
  document.documentElement.dataset.forcedTheme =
    savedAppearance === "system" ? "" : savedAppearance;
  if ($("appearanceSelect")) {
    $("appearanceSelect").value = savedAppearance;
    $("appearanceSelect").onchange = (e) => {
      const v = e.target.value;
      localStorage.setItem("rang.appearance", v);
      document.documentElement.dataset.forcedTheme = v === "system" ? "" : v;
      draw();
    };
  }
  if ($("languageSelect")) {
    $("languageSelect").value = localStorage.getItem("rang.language") || "en";
    $("languageSelect").onchange = (e) => {
      lang = e.target.value;
      localStorage.setItem("rang.language", lang);
      setText();
      renderLevels();
    };
  }
  resize();
  setText();
  renderLevels();
  show("menu");
  setTimeout(() => splash.classList.remove("active"), 900);
  detectLanguage();
})();
