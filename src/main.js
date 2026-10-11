import {
  applyThemePalette,
  getLocalClockParts,
  resetThemePreferencesForBuild,
  resolveAdaptiveTheme,
  resolveTimezone,
  THEME_NAMES,
} from "./adaptive-theme.js?v=20261011-theme-reset";
import { getDeviceLocationContext, getIpContext } from "./ip-context.js";
import { ENV } from "./env.js?v=20261011-theme-reset";

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
    "#2572c9",
    "#2d80dc",
    "#368fe9",
    "#429df2",
    "#52aaf5",
    "#3d8cde",
    "#5aa7eb",
    "#73b8f2",
    "#91c9f5",
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
      settingsTitle: "Settings",
      settingsDescription: "Make the game feel right for you.",
      personaliseTitle: "Personalise your Rang",
      personaliseDescription: "Themes, language and sound",
      appearance: "APPEARANCE",
      baseAppearance: "Base appearance",
      appearanceDescription: "Follow your device or choose a fixed mode.",
      language: "LANGUAGE",
      languageDescription: "Choose your preferred language.",
      timeThemeTitle: "TIME-OF-DAY THEME",
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
      night: "Night",
      morningDescription: "Fresh and airy",
      afternoonDescription: "Bright and clear",
      eveningDescription: "Warm and soft",
      nightDescription: "Quiet and deep",
      automaticTheme: "Automatic theme",
      automaticThemeDescription:
        "Follow local time, timezone and available daylight context.",
      natureTitle: "Nature accents",
      natureDescription: "Optional decorative colour variations.",
      soundTitle: "Game sound effects",
      soundDescription: "Enable or mute the game's sound effects.",
      themePrivacy:
        "Rang uses your system time zone and only uses device location if permission is already granted. If location is unavailable, it falls back to IPWHO, which may process your public IP. Nothing location-derived is saved.",
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
      settingsTitle: "सेटिंग्स",
      settingsDescription: "खेल को अपनी पसंद के अनुसार बनाएं।",
      personaliseTitle: "अपने Rang को पसंद के अनुसार बनाएं",
      personaliseDescription: "थीम, भाषा और ध्वनि",
      appearance: "दिखावट",
      baseAppearance: "मूल दिखावट",
      appearanceDescription: "डिवाइस का पालन करें या एक मोड चुनें।",
      language: "भाषा",
      languageDescription: "अपनी पसंदीदा भाषा चुनें।",
      timeThemeTitle: "दिन के समय की थीम",
      morning: "सुबह",
      afternoon: "दोपहर",
      evening: "शाम",
      night: "रात",
      morningDescription: "ताज़ा और हल्की",
      afternoonDescription: "उज्ज्वल और साफ़",
      eveningDescription: "गर्म और कोमल",
      nightDescription: "शांत और गहरी",
      automaticTheme: "स्वचालित थीम",
      automaticThemeDescription:
        "स्थानीय समय, समय-क्षेत्र और उपलब्ध दिन के प्रकाश के अनुसार।",
      natureTitle: "प्रकृति के रंग",
      natureDescription: "वैकल्पिक सजावटी रंग बदलाव।",
      soundTitle: "गेम ध्वनि प्रभाव",
      soundDescription: "गेम की ध्वनियां चालू या म्यूट करें।",
      themePrivacy:
        "Rang आपके सिस्टम समय-क्षेत्र का उपयोग करता है और डिवाइस स्थान तभी लेता है जब अनुमति पहले से मिली हो। स्थान उपलब्ध न हो तो IPWHO आपके सार्वजनिक IP को संसाधित कर सकता है। स्थान की जानकारी सहेजी नहीं जाती।",
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
      settingsTitle: "સેટિંગ્સ",
      settingsDescription: "રમતને તમારી પસંદ પ્રમાણે બનાવો.",
      personaliseTitle: "તમારા Rang ને વ્યક્તિગત બનાવો",
      personaliseDescription: "થીમ, ભાષા અને અવાજ",
      appearance: "દેખાવ",
      baseAppearance: "મૂળ દેખાવ",
      appearanceDescription: "ઉપકરણને અનુસરો અથવા એક મોડ પસંદ કરો.",
      language: "ભાષા",
      languageDescription: "તમારી પસંદગીની ભાષા પસંદ કરો.",
      timeThemeTitle: "દિવસના સમયની થીમ",
      morning: "સવાર",
      afternoon: "બપોર",
      evening: "સાંજ",
      night: "રાત",
      morningDescription: "તાજી અને હળવી",
      afternoonDescription: "ઉજળી અને સ્પષ્ટ",
      eveningDescription: "ગરમ અને સૌમ્ય",
      nightDescription: "શાંત અને ઘેરી",
      automaticTheme: "આપમેળે થીમ",
      automaticThemeDescription:
        "સ્થાનિક સમય, સમયક્ષેત્ર અને ઉપલબ્ધ દિવસના પ્રકાશને અનુસરે.",
      natureTitle: "કુદરતી રંગો",
      natureDescription: "વૈકલ્પિક શણગારના રંગ ફેરફારો.",
      soundTitle: "ગેમના અવાજ",
      soundDescription: "ગેમના અવાજ ચાલુ અથવા બંધ કરો.",
      themePrivacy:
        "Rang તમારા સિસ્ટમ સમયક્ષેત્રનો ઉપયોગ કરે છે અને મંજૂરી પહેલેથી હોય ત્યારે જ ઉપકરણનું સ્થાન લે છે. સ્થાન ઉપલબ્ધ ન હોય તો IPWHO તમારા જાહેર IP પર પ્રક્રિયા કરી શકે છે. સ્થાનની માહિતી સાચવાતી નથી.",
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
      settingsTitle: "設定",
      settingsDescription: "自分に合ったゲームに調整できます。",
      personaliseTitle: "Rangをカスタマイズ",
      personaliseDescription: "テーマ、言語、サウンド",
      appearance: "外観",
      baseAppearance: "基本の外観",
      appearanceDescription: "端末に合わせるか、固定モードを選びます。",
      language: "言語",
      languageDescription: "使用する言語を選びます。",
      timeThemeTitle: "時間帯のテーマ",
      morning: "朝",
      afternoon: "午後",
      evening: "夕方",
      night: "夜",
      morningDescription: "爽やかで軽やか",
      afternoonDescription: "明るくすっきり",
      eveningDescription: "暖かく穏やか",
      nightDescription: "静かで深みのある",
      automaticTheme: "テーマを自動選択",
      automaticThemeDescription:
        "現地時刻、タイムゾーン、利用可能な日照情報に合わせます。",
      natureTitle: "自然のアクセント",
      natureDescription: "任意の装飾的な色の変化です。",
      soundTitle: "ゲームの効果音",
      soundDescription: "ゲームの効果音をオンまたはミュートします。",
      themePrivacy:
        "Rangはシステムのタイムゾーンを使い、許可済みの場合のみ端末の位置情報を利用します。位置情報が使えない場合、IPWHOが公開IPを処理することがあります。位置情報は保存されません。",
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
      settingsTitle: "Ajustes",
      settingsDescription: "Adapta el juego a tu gusto.",
      personaliseTitle: "Personaliza tu Rang",
      personaliseDescription: "Temas, idioma y sonido",
      appearance: "APARIENCIA",
      baseAppearance: "Apariencia base",
      appearanceDescription: "Sigue tu dispositivo o elige un modo fijo.",
      language: "IDIOMA",
      languageDescription: "Elige tu idioma preferido.",
      timeThemeTitle: "TEMA SEGÚN LA HORA",
      morning: "Mañana",
      afternoon: "Tarde",
      evening: "Atardecer",
      night: "Noche",
      morningDescription: "Fresco y ligero",
      afternoonDescription: "Claro y luminoso",
      eveningDescription: "Cálido y suave",
      nightDescription: "Tranquilo y profundo",
      automaticTheme: "Tema automático",
      automaticThemeDescription:
        "Sigue la hora local, la zona horaria y la luz diurna disponible.",
      natureTitle: "Detalles naturales",
      natureDescription: "Variaciones decorativas de color opcionales.",
      soundTitle: "Efectos de sonido",
      soundDescription: "Activa o silencia los sonidos del juego.",
      themePrivacy:
        "Rang usa la zona horaria del sistema y solo accede a la ubicación del dispositivo si ya tiene permiso. Si no está disponible, IPWHO puede procesar tu IP pública. Los datos de ubicación no se guardan.",
      system: "SISTEMA",
      light: "CLARO",
      dark: "OSCURO",
      pausedTitle: "JUEGO EN PAUSA",
      pausedText: "Has pausado el juego. ¿Quieres volver al inicio?",
      stay: "QUEDARME",
      goHome: "IR AL INICIO",
    },
  };

  const GITHUB_CONFIG = {
    owner: "Kashyap-Nirmal",
    repo: "rang-brick-breaker",
  };

  let lang = "en";
  let ipContext = null;
  let activePalette = null;
  let autoTimeTheme = null;
  const reduceSkyMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let skyClockParts = getLocalClockParts();
  let skyClockUpdatedAt = Date.now();
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
    return activePalette?.dark || false;
  }
  function setText() {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
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
    $("githubLink").href =
      `https://github.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}`;
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
    $("themeOptions").setAttribute("aria-label", t("timeThemeTitle"));
    $("settingsCloseBtn").setAttribute("aria-label", t("close"));
    $("settingsCloseBtn").title = t("close");
    $("autoTimeTheme").setAttribute("aria-label", t("automaticTheme"));
    $("natureAccent").setAttribute("aria-label", t("natureTitle"));
    $("soundEnabled").setAttribute("aria-label", t("soundTitle"));

    $("resultHomeBtn").onclick = () => {
      S.running = false;
      S.mode = "normal";
      show("menu");
    };

    updateHud();
  }
  async function detectLanguage(contextRequest) {
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
    const context = await contextRequest;
    const country = (context?.country || "").toUpperCase();
    if (country === "JP") lang = "ja";
    else if (country === "ES" || country === "MX" || country === "AR")
      lang = "es";
    else if (country === "IN" && browser.startsWith("gu")) lang = "gu";
    else if (country === "IN" && browser.startsWith("hi")) lang = "hi";
    setText();
  }

  async function getPreferredThemeContext() {
    const deviceLocation = await getDeviceLocationContext();
    if (deviceLocation && resolveTimezone()) return deviceLocation;
    return getIpContext();
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
  matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
    updatePalette();
    draw();
  });

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
      `https://github.com/${GITHUB_CONFIG.owner}/` +
      `${GITHUB_CONFIG.repo}/issues/new?` +
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
  function renderLevels(showScreen = true) {
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
    if (showScreen) show("levels");
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

  function drawCloud(x, y, scale, opacity, cloudColor, shadowColor) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = shadowColor;
    ctx.beginPath();
    ctx.ellipse(x, y + 5 * scale, 45 * scale, 10 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = cloudColor;
    ctx.beginPath();
    ctx.moveTo(x - 48 * scale, y + 8 * scale);
    ctx.bezierCurveTo(
      x - 58 * scale,
      y - 5 * scale,
      x - 42 * scale,
      y - 18 * scale,
      x - 27 * scale,
      y - 14 * scale,
    );
    ctx.bezierCurveTo(
      x - 18 * scale,
      y - 39 * scale,
      x + 14 * scale,
      y - 39 * scale,
      x + 24 * scale,
      y - 14 * scale,
    );
    ctx.bezierCurveTo(
      x + 45 * scale,
      y - 21 * scale,
      x + 59 * scale,
      y - 2 * scale,
      x + 49 * scale,
      y + 9 * scale,
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawBird(x, y, scale, flap, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-9, 1);
    ctx.quadraticCurveTo(-5, -5 - flap, 0, 0);
    ctx.quadraticCurveTo(5, -5 - flap, 9, 1);
    ctx.stroke();
    ctx.restore();
  }

  function drawBirdFlocks(theme, timeSeconds, birdColor) {
    if (theme === "night") return;

    const flocks =
      theme === "morning"
        ? [
            { count: 5, speed: 0.035, y: 0.34, phase: 0.05 },
            { count: 4, speed: 0.027, y: 0.43, phase: 0.47 },
            { count: 4, speed: 0.031, y: 0.27, phase: 0.79 },
          ]
        : theme === "afternoon"
          ? [{ count: 3, speed: 0.014, y: 0.35, phase: 0.24 }]
          : [{ count: 5, speed: 0.019, y: 0.4, phase: 0.12 }];

    for (const flock of flocks) {
      const progress = (timeSeconds * flock.speed + flock.phase) % 1.35;
      const inbound = theme === "evening";
      const travel = progress - 0.15;
      const x = inbound ? (1.15 - travel) * W : travel * W;
      const scale = inbound
        ? 0.46 + Math.max(0, progress) * 0.32
        : 0.78 - Math.max(0, progress) * 0.3;
      const y = H * flock.y + (inbound ? progress * 13 : -progress * 19);
      const spacing = inbound ? 16 : 14;

      for (let index = 0; index < flock.count; index++) {
        const formation = index === 0 ? 0 : Math.ceil(index / 2);
        const side = index === 0 ? 0 : index % 2 ? -1 : 1;
        drawBird(
          x + side * formation * spacing * scale,
          y + formation * 7 * scale,
          scale,
          Math.sin(timeSeconds * 7 + index + flock.phase) * 3.5,
          birdColor,
        );
      }
    }
  }

  function drawNightSky(timeSeconds, moonColor, starColor) {
    const moonX = W * 0.78;
    const moonY = H * 0.17;
    const moonRadius = Math.min(35, W * 0.085);

    const moonGlow = ctx.createRadialGradient(
      moonX,
      moonY,
      moonRadius * 0.3,
      moonX,
      moonY,
      moonRadius * 3.5,
    );
    moonGlow.addColorStop(0, "rgba(160, 193, 255, .24)");
    moonGlow.addColorStop(1, "rgba(160, 193, 255, 0)");
    ctx.fillStyle = moonGlow;
    ctx.fillRect(
      moonX - moonRadius * 4,
      moonY - moonRadius * 4,
      moonRadius * 8,
      moonRadius * 8,
    );

    ctx.fillStyle = moonColor;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = activePalette["--canvas-top"];
    ctx.beginPath();
    ctx.arc(
      moonX + moonRadius * 0.46,
      moonY - moonRadius * 0.27,
      moonRadius * 0.88,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    for (let index = 0; index < 56; index++) {
      const x = ((index * 137.508) % 997) / 997 * W;
      const y = ((index * 73.71 + 21) % 491) / 491 * H * 0.62;
      const radius = index % 11 === 0 ? 1.8 : 0.7 + (index % 3) * 0.35;
      const twinkle = 0.42 + 0.48 * (0.5 + 0.5 * Math.sin(timeSeconds * 1.7 + index));

      ctx.globalAlpha = twinkle;
      ctx.fillStyle = starColor;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      if (index % 11 === 0) {
        ctx.globalAlpha = twinkle * 0.7;
        ctx.fillRect(x - 0.5, y - 4, 1, 8);
        ctx.fillRect(x - 4, y - 0.5, 8, 1);
      }
    }

    const shootingPhase = (timeSeconds % 17) / 17;
    if (shootingPhase < 0.09) {
      const progress = shootingPhase / 0.09;
      const startX = W * (0.2 + ((Math.floor(timeSeconds / 17) * 0.37) % 0.58));
      const startY = H * 0.12;
      const endX = startX + progress * W * 0.16;
      const endY = startY + progress * H * 0.11;
      const trail = ctx.createLinearGradient(startX, startY, endX, endY);
      trail.addColorStop(0, "rgba(255,255,255,0)");
      trail.addColorStop(1, "rgba(226,239,255,.95)");
      ctx.globalAlpha = Math.sin((progress / 0.09) * Math.PI);
      ctx.strokeStyle = trail;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function drawDaySky(theme, timeSeconds, sunColor, sunGlow, cloudColor, cloudShadow, birdColor) {
    const now = Date.now();
    if (now - skyClockUpdatedAt >= 1000) {
      skyClockParts = getLocalClockParts(new Date(now), ipContext);
      skyClockUpdatedAt = now;
    }
    const clock = skyClockParts;
    const hour =
      autoTimeTheme && !autoTimeTheme.checked
        ? { morning: 8, afternoon: 14, evening: 18.5 }[theme]
        : clock.hour + clock.minute / 60 + clock.second / 3600;
    const progress = Math.max(0, Math.min(1, (hour - 5) / 15));
    const sunX = W * Math.min(
      0.94,
      0.07 + progress * 0.86 + Math.sin(progress * Math.PI) * 0.18,
    );
    const sunY = H * (0.56 - Math.sin(progress * Math.PI) * 0.37);
    const sunRadius = Math.min(36, W * 0.083);
    const evening = theme === "evening";
    const midday = theme === "afternoon";
    const glowRadius = sunRadius * (evening ? 5 : midday ? 4 : 3.4);

    const glow = ctx.createRadialGradient(
      sunX,
      sunY,
      sunRadius * 0.5,
      sunX,
      sunY,
      glowRadius,
    );
    glow.addColorStop(0, sunGlow);
    glow.addColorStop(1, "rgba(255, 222, 170, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(
      sunX - glowRadius,
      sunY - glowRadius,
      glowRadius * 2,
      glowRadius * 2,
    );

    if (midday) {
      ctx.save();
      ctx.translate(sunX, sunY);
      ctx.strokeStyle = sunGlow;
      ctx.lineWidth = 2;
      for (let ray = 0; ray < 12; ray++) {
        const angle = (ray / 12) * Math.PI * 2 + timeSeconds * 0.025;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * (sunRadius + 6), Math.sin(angle) * (sunRadius + 6));
        ctx.lineTo(Math.cos(angle) * (sunRadius + 13), Math.sin(angle) * (sunRadius + 13));
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.fillStyle = sunColor;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    const cloudCount = evening ? 2 : midday ? 3 : 4;
    for (let index = 0; index < cloudCount; index++) {
      const phase = (timeSeconds * (0.007 + index * 0.0011) + index * 0.39) % 1.3;
      const x = (phase - 0.15) * W;
      const y = H * (0.22 + (index % 3) * 0.095);
      const scale = 0.7 + (index % 3) * 0.16;
      drawCloud(x, y, scale, evening ? 0.58 : 0.75, cloudColor, cloudShadow);
    }

    drawBirdFlocks(theme, timeSeconds, birdColor);
  }

  function draw() {
    const dark = isDark();
    const canvasTop = activePalette["--canvas-top"];
    const canvasBottom = activePalette["--canvas-bottom"];
    const canvasSpeck = activePalette["--canvas-speck"];
    const canvasPaddle = activePalette["--canvas-paddle"];
    const canvasInk = activePalette["--canvas-ink"];

    ctx.fillStyle = canvasBottom;
    ctx.fillRect(0, 0, W, H);

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, canvasTop);
    grad.addColorStop(1, canvasBottom);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const theme = root.dataset.timeTheme || "morning";
    const timeSeconds = reduceSkyMotion.matches ? 0 : performance.now() / 1000;
    if (theme === "night") {
      drawNightSky(
        timeSeconds,
        activePalette["--sky-moon"],
        activePalette["--sky-star"],
      );
    } else {
      drawDaySky(
        theme,
        timeSeconds,
        activePalette["--sky-sun"],
        activePalette["--sky-sun-glow"],
        activePalette["--sky-cloud"],
        activePalette["--sky-cloud-shadow"],
        activePalette["--sky-bird"],
      );
    }

    ctx.globalAlpha = 0.22;
    ctx.fillStyle = canvasSpeck;

    for (let i = 0; i < 22; i++) {
      const x = (i * 83) % W;
      const y = 70 + ((i * 137) % Math.max(100, H * 0.6));

      ctx.beginPath();
      ctx.arc(x, y, (i % 3) + 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    for (const br of S.bricks) if (br.alive) drawBrick(br, dark);
    ctx.fillStyle = canvasPaddle;
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
      ctx.fillStyle = canvasInk;
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
      if (localStorage.getItem("rang.soundEnabled") === "false") return;
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

  const root = document.documentElement;
  resetThemePreferencesForBuild(
    localStorage,
    ENV.THEME_PREFERENCES_RESET_VERSION,
  );
  let savedAppearance = localStorage.getItem("rang.appearance") || "system";
  autoTimeTheme = $("autoTimeTheme");
  const savedAutoTime = localStorage.getItem("rang.autoTimeTheme") !== "false";
  let themeTimer = null;

  function updatePalette(theme = root.dataset.timeTheme) {
    activePalette = applyThemePalette(
      root,
      theme || "morning",
      savedAppearance,
      matchMedia("(prefers-color-scheme: dark)").matches,
    );
  }

  if ($("appearanceSelect")) {
    $("appearanceSelect").value = savedAppearance;
    $("appearanceSelect").addEventListener("change", (event) => {
      savedAppearance = event.target.value;
      localStorage.setItem("rang.appearance", savedAppearance);
      updatePalette();
      draw();
    });
  }

  if ($("languageSelect")) {
    $("languageSelect").value = localStorage.getItem("rang.language") || "en";
    $("languageSelect").addEventListener("change", (event) => {
      lang = event.target.value;
      localStorage.setItem("rang.language", lang);
      setText();
      renderLevels(false);
    });
  }

  function applyTimeTheme(theme, redraw = true) {
    if (!THEME_NAMES.includes(theme)) return;

    updatePalette(theme);
    document.querySelectorAll("[data-time-theme]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.timeTheme === theme),
      );
    });
    if (redraw) draw();
  }

  function clearThemeTimer() {
    if (themeTimer !== null) {
      clearTimeout(themeTimer);
      themeTimer = null;
    }
  }

  function scheduleThemeUpdate() {
    clearThemeTimer();
    if (!autoTimeTheme.checked || document.hidden) return;

    const untilNextMinute = 60_000 - (Date.now() % 60_000);
    themeTimer = setTimeout(() => {
      themeTimer = null;
      refreshAutomaticTheme();
    }, untilNextMinute + 20);
  }

  function refreshAutomaticTheme() {
    if (!autoTimeTheme.checked) return;

    applyTimeTheme(resolveAdaptiveTheme(new Date(), ipContext));
    scheduleThemeUpdate();
  }

  function updateThemeFromIpContext(context) {
    ipContext = context;
    if (autoTimeTheme.checked) refreshAutomaticTheme();
  }

  autoTimeTheme.checked = savedAutoTime;
  autoTimeTheme.addEventListener("change", () => {
    localStorage.setItem("rang.autoTimeTheme", String(autoTimeTheme.checked));
    if (autoTimeTheme.checked) refreshAutomaticTheme();
    else clearThemeTimer();
  });

  document.querySelectorAll("[data-time-theme]").forEach((button) => {
    button.addEventListener("click", () => {
      autoTimeTheme.checked = false;
      localStorage.setItem("rang.autoTimeTheme", "false");
      localStorage.setItem("rang.timeTheme", button.dataset.timeTheme);
      clearThemeTimer();
      applyTimeTheme(button.dataset.timeTheme);
    });
  });

  const savedManualTheme = localStorage.getItem("rang.timeTheme");
  const initialTheme =
    savedAutoTime || !THEME_NAMES.includes(savedManualTheme)
      ? resolveAdaptiveTheme(new Date(), null)
      : savedManualTheme;
  applyTimeTheme(initialTheme, false);

  // Refresh on return from backgrounding; one minute-aligned timer handles transitions.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearThemeTimer();
    else if (autoTimeTheme.checked) refreshAutomaticTheme();
    else updatePalette();
  });
  window.addEventListener("pageshow", () => {
    if (autoTimeTheme.checked) refreshAutomaticTheme();
  });
  window.addEventListener("pagehide", clearThemeTimer);

  // Optional decorative accent preference
  const natureAccent = $("natureAccent");

  if (natureAccent) {
    natureAccent.value = localStorage.getItem("rang.natureAccent") || "none";

    root.dataset.natureAccent = natureAccent.value;

    natureAccent.addEventListener("change", () => {
      root.dataset.natureAccent = natureAccent.value;
      localStorage.setItem("rang.natureAccent", natureAccent.value);
      draw();
    });
  }

  // Sound effects toggle
  const soundEnabled = $("soundEnabled");
  const savedSound = localStorage.getItem("rang.soundEnabled");

  if (soundEnabled) {
    soundEnabled.checked = savedSound !== "false";

    soundEnabled.addEventListener("change", () => {
      localStorage.setItem("rang.soundEnabled", String(soundEnabled.checked));
    });
  }

  resize();
  setText();
  renderLevels();
  show("menu");
  setTimeout(() => splash.classList.remove("active"), 900);
  let lastAmbientDraw = 0;
  function ambientLoop(timestamp) {
    if (
      !document.hidden &&
      !S.running &&
      timestamp - lastAmbientDraw >= 33
    ) {
      draw();
      lastAmbientDraw = timestamp;
    }
    requestAnimationFrame(ambientLoop);
  }
  requestAnimationFrame(ambientLoop);

  // Resolve immediately from system time; use device location only when granted,
  // then IPWHO if device location is unavailable or blocked.
  const contextRequest = getPreferredThemeContext();
  void contextRequest.then(updateThemeFromIpContext);
  void detectLanguage(contextRequest);
  scheduleThemeUpdate();
})();
