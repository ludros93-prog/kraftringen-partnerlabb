(() => {
  'use strict';
  const P = window.Portal;
  if (!P) return;
  const categories = [
    { id: 'all', label: 'Alla utbildningar', icon: 'grid' },
    { id: 'electric', label: 'Elhandel', icon: 'bolt' },
    { id: 'sales', label: 'Sälj & kundmöte', icon: 'users' },
    { id: 'partner', label: 'Partnersamarbete', icon: 'handshake' },
    { id: 'bookmarked', label: 'Bokmärken', icon: 'bookmark' }
  ];
  const businessCourses = [
    {
      id: 'intro', category: 'partner', title: 'Kom igång med företagsaffären', description: 'Samla kundens underlag och följ dialogen med Kraftringen.', image: 'assets/office.jpg', duration: '6 min',
      lessons: [
        { id: 'intro-1', title: 'Din företagsarbetsyta', text: 'Savera säljer Kraftringens elhandelsavtal till företagskunder. I demoarbetsytan samlar du kundens behov, följer affären och läser återkoppling från Kraftringen.', bullets: ['Öppna en exempelaffär och granska kundens underlag.', 'Titta på nästa aktivitet i affären.', 'Anteckna vad du saknar för att fortsätta kunddialogen.'] },
        { id: 'intro-2', title: 'Följ en affär', text: 'I prototypen kan du testa hur en kunddialog dokumenteras och följs upp. Ett tydligt nästa steg hjälper både partnern och det interna teamet att fortsätta arbetet.', bullets: ['Beskriv kundens frågeställning med fiktiva uppgifter.', 'Lägg till nästa aktivitet och ett planerat datum.', 'Statusarna är ett förslag att diskutera med Ludwig och Håkan.'] },
        { id: 'intro-3', title: 'Testa tillsammans', text: 'Använd demovyerna för att prova samarbetet från båda sidor. Alla exempeluppgifter ligger i din webbläsare.', bullets: ['Byt demovy och prova intern återkoppling.', 'Kontrollera vad som visas i partnerns vy.', 'Två datorer delar ännu inte testdata.'] }
      ]
    },
    {
      id: 'dialogue', category: 'sales', title: 'Första kunddialogen', description: 'Förbered ett möte och fånga kundens viktigaste frågor.', image: 'assets/office.jpg', duration: '7 min',
      lessons: [
        { id: 'dialogue-1', title: 'Förbered mötet', text: 'Börja med vad kunden vill diskutera. I ett första möte behöver ni kunna enas om vilka frågor som ska tas vidare.', bullets: ['Vad vill företaget eller föreningen få hjälp med?', 'Vem behöver delta i nästa dialog?', 'Vilka uppgifter behöver ni klargöra tillsammans?'] },
        { id: 'dialogue-2', title: 'Dokumentera behovet', text: 'Sammanfatta kundens egna frågor och det ni faktiskt har kommit överens om. Undvik att fylla i antaganden som om de vore beslut.', bullets: ['Skriv en kort beskrivning av frågeställningen.', 'Skilj kundens önskemål från sådant som behöver undersökas.', 'I denna testmiljö använder du enbart påhittade kunduppgifter.'] },
        { id: 'dialogue-3', title: 'Enas om nästa steg', text: 'Gör det lätt att fortsätta efter mötet. Dokumentera nästa kontakt och vilket underlag som behöver tas fram.', bullets: ['Vad ska hända härnäst?', 'Vem behöver delta eller återkomma?', 'När vill kunden fortsätta dialogen?'] }
      ]
    },
    {
      id: 'electric', category: 'electric', title: 'Elhandel – samla kundens underlag', description: 'Testa hur frågor inför en elhandelsdialog kan samlas.', image: 'assets/wind.jpg', duration: '8 min',
      lessons: [
        { id: 'electric-1', title: 'Kundens frågeställning', text: 'Kraftringens B2B-team arbetar med elavtal, portföljlösningar och prissäkring. Den här demokursen hjälper dig att strukturera en fråga till teamet.', bullets: ['Vad vill kunden förstå eller diskutera om sin elhandel?', 'Gäller frågan en verksamhet, flera anläggningar eller en BRF?', 'Spara frågan i affären så att nästa deltagare får sammanhanget.'] },
        { id: 'electric-2', title: 'Skilj fakta från antaganden', text: 'Uppgifter om kundens behov och nuvarande situation behöver bygga på kundens underlag. Ett tomt fält är bättre än en uppgift som ser verifierad ut men är ett antagande.', bullets: ['Markera vad kunden har lämnat och vad som fortfarande saknas.', 'Beskriv vilken fråga du behöver hjälp att reda ut.', 'Produktbeskrivningar och villkor fylls i när godkänt underlag finns.'] },
        { id: 'electric-3', title: 'Ta frågan vidare', text: 'Förbered en tydlig sammanfattning inför fortsatt dialog. I prototypen går det att testa ett offertunderlag utan att lägga in verkliga priser eller avtalsvillkor.', bullets: ['Samla kundens frågor på ett ställe.', 'Gå igenom vad som behöver verifieras före en offert.', 'Partnerns befogenheter och godkännanden är öppna beslut.'] }
      ]
    },
    {
      id: 'collaboration', category: 'partner', title: 'Nästa steg tillsammans', description: 'Håll återkoppling och aktiviteter samlade i affären.', image: 'assets/solar.jpg', duration: '6 min',
      lessons: [
        { id: 'collaboration-1', title: 'Samlad återkoppling', text: 'Ett sammanhållet samarbete bygger på att deltagarna vet vad som har hänt och vad som väntar. I testflödet kan det interna teamet dela återkoppling till partnern.', bullets: ['Läs senaste återkopplingen i affären.', 'Svara med en genomförd aktivitet eller ett nytt nästa steg.', 'Testa vilken information ni vill kunna dela mellan rollerna.'] },
        { id: 'collaboration-2', title: 'Tydligt ansvar', text: 'Portalen kan stödja ansvar och uppföljning, men den avgör inte hur ert partnersamarbete ska organiseras. Använd prototypen för att pröva ett arbetssätt.', bullets: ['Vem samordnar nästa kundkontakt?', 'När behövs en intern avstämning?', 'Vilka aktiviteter får partnern göra på egen hand?'] },
        { id: 'collaboration-3', title: 'Förbättra arbetsflödet', text: 'Avsluta testet med ett konkret exempel på vad som fungerade och vad som behöver ändras. Det ger Ludwig och Håkan underlag för nästa version.', bullets: ['Vilken uppgift blev enklare att utföra?', 'Var behövde du mer information?', 'Vilken förändring skulle göra störst skillnad nästa gång?'] }
      ]
    }
  ];
  const consumerContent = {
    intro: {
      title: 'Kom igång med konsumentförsäljning', description: 'Registrera ett testunderlag och följ återkopplingen.',
      lessons: [
        { title: 'Din konsumentarbetsyta', text: 'Face2face säljer Kraftringens elhandelsavtal till konsumenter. I demoarbetsytan kan du samla ett kundunderlag, följa registreringen och läsa återkoppling från Kraftringen.', bullets: ['Öppna en exempelregistrering och se vilka uppgifter som finns.', 'Titta på vad som behöver följas upp.', 'Anteckna vad du saknar i ett kundmöte.'] },
        { title: 'Följ en registrering', text: 'I demoövningen håller du kundens frågor och nästa aktivitet samlade. En registrering visar vad som har dokumenterats och vad som återstår att reda ut.', bullets: ['Beskriv kundens fråga med fiktiva uppgifter.', 'Lägg till nästa aktivitet och ett planerat datum.', 'Statusarna i övningen är förslag att pröva tillsammans.'] },
        { title: 'Testa återkopplingen', text: 'Använd demovyerna för att prova återkoppling mellan Face2face och Kraftringen. Alla exempeluppgifter ligger i din webbläsare.', bullets: ['Byt demovy och lägg till intern återkoppling.', 'Kontrollera vad partnern kan läsa och följa upp.', 'Två datorer delar ännu inte testdata.'] }
      ]
    },
    dialogue: {
      title: 'Tydlig dialog med konsumenten', description: 'Fånga kundens frågor och gör nästa steg tydligt.',
      lessons: [
        { title: 'Lyssna på kundens fråga', text: 'Börja med vad kunden vill förstå om sin elhandel. Ta reda på vilka frågor som behöver förklaras innan kunden går vidare.', bullets: ['Vad vill kunden få hjälp att förstå?', 'Gäller frågan nuvarande bostad eller en flytt?', 'Vilken information behöver kunden inför nästa steg?'] },
        { title: 'Beskriv nästa steg tydligt', text: 'Skilj mellan information, ett insamlat underlag och ett ingånget avtal. Använd godkända produktuppgifter när sådant underlag har lämnats; demot innehåller inga skarpa villkor.', bullets: ['Sammanfatta vad kunden vill gå vidare med.', 'Markera frågor som du behöver få svar på från Kraftringen.', 'Använd enbart påhittade kontaktuppgifter i testet.'] },
        { title: 'Följ upp kunddialogen', text: 'Samla det ni har pratat om och det kunden fortfarande vill veta. En tydlig anteckning hjälper nästa person att fortsätta utan att kunden behöver börja om.', bullets: ['Vad behöver följas upp?', 'Hur vill kunden bli kontaktad?', 'Vilket nästa steg har ni pratat om?'] }
      ]
    },
    electric: {
      title: 'Elhandel – konsumentunderlag', description: 'Samla testuppgifter och upptäck vad som saknas.',
      lessons: [
        { title: 'Samla kundens uppgifter', text: 'Ett tydligt kundunderlag ger sammanhang för fortsatt hantering. I demoövningen samlar du bostadsadress, önskat datum, kontaktuppgifter och kundens fråga.', bullets: ['Använd en fiktiv kund och adress.', 'Skilj önskat datum från ett bekräftat avtalsdatum.', 'Spara kundens fråga tillsammans med registreringen.'] },
        { title: 'Granska underlaget', text: 'För in det kunden har lämnat och markera vad som är oklart. Fyll inte i gissningar som om de vore bekräftade uppgifter.', bullets: ['Kontrollera att adress och kontaktuppgifter stämmer i testexemplet.', 'Markera vilken uppgift som behöver kompletteras.', 'Priser och produktvillkor behöver godkänt underlag.'] },
        { title: 'Ta registreringen vidare', text: 'Gå igenom sammanfattningen innan du fortsätter demoövningen. Här testar du hanteringen av ett underlag; ingen registrering skapar ett verkligt elavtal.', bullets: ['Läs igenom vad som har sparats.', 'Kontrollera vad som behöver återkoppling från Kraftringen.', 'Dokumentera ett tydligt nästa steg.'] }
      ]
    },
    collaboration: {
      title: 'Återkoppling och komplettering', description: 'Följ upp registreringen tillsammans med Kraftringen.',
      lessons: [
        { title: 'Läs återkopplingen', text: 'I demoarbetsytan kan Kraftringen återkoppla på ett kundunderlag. Läs vad som har hänt och vilken uppgift som behöver följas upp.', bullets: ['Öppna senaste återkopplingen i en exempelregistrering.', 'Se vilken fråga eller uppgift återkopplingen gäller.', 'Anteckna vad du behöver göra härnäst.'] },
        { title: 'Komplettera med rätt uppgift', text: 'Utgå från den fråga som behöver redas ut och dokumentera det nya underlaget. Ett genomfört teststeg är inte ett besked om ett verkligt avtal.', bullets: ['Ange den fiktiva uppgift som saknades.', 'Beskriv vad du har följt upp med kunden.', 'Markera vad som fortfarande behöver svar.'] },
        { title: 'Förbättra arbetsflödet', text: 'Avsluta övningen med ett konkret exempel på vad som fungerade och vad som behöver ändras. Det hjälper Ludwig och Håkan att utveckla stödet för konsumentförsäljning.', bullets: ['Var kunde du snabbt förstå nästa steg?', 'Vilken återkoppling behövde vara tydligare?', 'Vilken förändring skulle hjälpa mest i ett kundmöte?'] }
      ]
    }
  };
  const consumerCourses = businessCourses.map(course => {
    const content = consumerContent[course.id];
    return { ...course, ...content, lessons: course.lessons.map((lesson, index) => ({ ...lesson, ...content.lessons[index] })) };
  });
  const coursesForPartner = () => P.partner === 'vast' ? consumerCourses : businessCourses;
  const paths = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/><circle cx="9" cy="7" r="4"/>',
    handshake: '<path d="m2 8 4-4 4 2h4l4-2 4 4-3 10-3-1-4 3-3-2-3-1-4-9Z"/><path d="m10 6-4 5 3 2 4-4 5 5m-7 3 3 2m0-5 3 2"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4V3Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    book: '<path d="M12 5v16M3 3l9 2 9-2v16l-9 2-9-2V3Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    certificate: '<circle cx="12" cy="9" r="6"/><path d="m8 14-2 7 6-3 6 3-2-7m-7-5 2 2 4-4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
    play: '<path d="m9 5 10 7-10 7V5Z" fill="currentColor" stroke="none"/>'
  };
  const icon = (name) => `<svg class="ac-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.book}</svg>`;
  let filter = 'all';
  const courseById = (id) => coursesForPartner().find(course => course.id === id);
  function training() {
    if (!P.state.training || typeof P.state.training !== 'object' || Array.isArray(P.state.training)) P.state.training = {};
    const key = P.partner || 'syd';
    let progress = P.state.training[key];
    if (!progress || typeof progress !== 'object' || Array.isArray(progress)) {
      progress = { completed: key === 'syd' ? { intro: ['intro-1', 'intro-2', 'intro-3'], dialogue: ['dialogue-1'], electric: [], collaboration: [] } : {}, bookmarks: key === 'syd' ? ['electric'] : [], webinarBooked: false };
      P.state.training[key] = progress;
    }
    if (!progress.completed || typeof progress.completed !== 'object' || Array.isArray(progress.completed)) progress.completed = {};
    if (!Array.isArray(progress.bookmarks)) progress.bookmarks = [];
    coursesForPartner().forEach(course => {
      if (!Array.isArray(progress.completed[course.id])) progress.completed[course.id] = [];
      progress.completed[course.id] = [...new Set(progress.completed[course.id].filter(id => course.lessons.some(lesson => lesson.id === id)))];
    });
    progress.bookmarks = [...new Set(progress.bookmarks.filter(id => courseById(id)))];
    return progress;
  }
  const completed = (course) => training().completed[course.id].length;
  const percent = (course) => Math.round(completed(course) / course.lessons.length * 100);
  P.academyStats = () => {
    const courses = coursesForPartner();
    const progress = training();
    const totalMoments = courses.reduce((count, course) => count + course.lessons.length, 0);
    const completedMoments = courses.reduce((count, course) => count + progress.completed[course.id].length, 0);
    return { totalMoments, completedMoments, percent: Math.round(completedMoments / totalMoments * 100), completedCourses: courses.filter(course => completed(course) === course.lessons.length).length, ongoingCourses: courses.filter(course => completed(course) > 0 && completed(course) < course.lessons.length).length, bookmarkedCourses: progress.bookmarks.length };
  };
  function courseCard(course) {
    const marked = training().bookmarks.includes(course.id);
    const progress = percent(course);
    const category = categories.find(item => item.id === course.category);
    return `<article class="ac-course"><div class="ac-course-image"><img src="${course.image}" alt="" loading="lazy"><span class="ac-course-type">${P.e(category.label)}</span><button class="ac-bookmark" data-ac-bookmark="${course.id}" aria-pressed="${marked}" aria-label="${marked ? 'Ta bort bokmärke för' : 'Bokmärk'} ${P.e(course.title)}">${icon('bookmark')}</button><button class="ac-course-play" data-ac-course="${course.id}" aria-label="Öppna ${P.e(course.title)}">${icon('play')}</button></div><div class="ac-course-body"><h3>${P.e(course.title)}</h3><p class="ac-course-description">${P.e(course.description)}</p><div class="ac-course-meta"><span>${icon('clock')}${course.duration} · demo</span><span>${icon('book')}${course.lessons.length} moment</span></div><div class="ac-progress-line" aria-label="${progress} procent klarmarkerat i demo"><span class="ac-progress-track"><span style="width:${progress}%"></span></span><b>${progress}%</b></div><button class="ac-button" data-ac-course="${course.id}">${progress === 100 ? 'Repetera kursen' : progress > 0 ? 'Fortsätt utbildningen' : 'Öppna utbildningen'} ${icon('arrow')}</button></div></article>`;
  }
  function render() {
    const courses = coursesForPartner();
    const consumer = P.partner === 'vast';
    const subtitle = consumer ? 'Kunddialog och underlag för konsumentelhandel.' : 'Kunddialog och underlag för företagsaffärer.';
    const heroCopy = consumer ? 'Öva på kunddialogen, registrera testunderlag och följ Kraftringens återkoppling.' : 'Förbered företagskundens underlag och följ nästa steg i affären med Kraftringen.';
    const stats = P.academyStats();
    const progress = training();
    const visible = courses.filter(course => filter === 'all' || course.category === filter || (filter === 'bookmarked' && progress.bookmarks.includes(course.id)));
    return `<section class="academy-page" aria-labelledby="ac-title"><div class="ac-header"><div><span class="ac-eyebrow">Partner Academy</span><h1 id="ac-title">Utbildning</h1><p>${P.e(subtitle)}</p></div><span class="ac-demo-chip">Demoinnehåll · lokala framsteg</span></div><div class="ac-layout"><div class="ac-main"><section class="ac-hero" aria-label="Dina utbildningsframsteg"><img class="ac-hero-photo" src="assets/wind.jpg" alt="" fetchpriority="high"><div class="ac-hero-copy"><span class="ac-eyebrow">Kunskap. Dialog. Samarbete.</span><h2>Utveckla din kompetens.<br>Skapa värde i mötet.</h2><p>${P.e(heroCopy)}</p><button class="ac-button primary" id="ac-explore">Utforska utbildningar ${icon('arrow')}</button></div><div class="ac-hero-ring"><span>Dina demoframsteg</span><div class="ac-ring" style="--progress:${stats.percent}" aria-label="${stats.percent} procent av demomomenten klarmarkerade"><b>${stats.percent}%</b></div><small>${stats.completedMoments} av ${stats.totalMoments} moment<br>klarmarkerade i demo</small></div></section><div class="ac-section-title"><h2>Utbildningskategorier</h2><small>Välj vad du vill utforska</small></div><div class="ac-filters" aria-label="Filtrera utbildningar">${categories.map(category => `<button class="ac-filter" data-ac-filter="${category.id}" aria-pressed="${filter === category.id}">${icon(category.icon)}${P.e(category.label)}</button>`).join('')}</div><div class="ac-section-title" id="ac-course-heading"><h2>${filter === 'bookmarked' ? 'Dina bokmärken' : 'Utvalda utbildningar'}</h2><small>${visible.length} utbildningar · demoinnehåll</small></div><div class="ac-course-grid">${visible.length ? visible.map(courseCard).join('') : '<div class="ac-empty"><strong>Inga bokmärken ännu</strong>Tryck på bokmärket i ett kurskort för att spara kursen här.</div>'}</div><div class="ac-note">${icon('info')}<p>Kurserna visar hur utbildningsdelen kan fungera. Innehåll, tider och framsteg är exempel. Godkända utbildningar och eventuella certifieringskrav behöver ni lämna underlag för.</p></div></div><aside class="ac-side" aria-label="Utbildningsöversikt"><section class="ac-panel"><h2>Mina framsteg</h2><dl class="ac-stats-list"><div><dt>${icon('check')}Klarmarkerade kurser</dt><dd>${stats.completedCourses}</dd></div><div><dt>${icon('clock')}Påbörjade kurser</dt><dd>${stats.ongoingCourses}</dd></div><div><dt>${icon('book')}Klarmarkerade moment</dt><dd>${stats.completedMoments} / ${stats.totalMoments}</dd></div><div><dt>${icon('bookmark')}Bokmärken</dt><dd>${stats.bookmarkedCourses}</dd></div></dl><p>Gäller ${P.e(P.partners[P.partner] || 'vald exempelpartner')} i denna webbläsare.</p></section><section class="ac-panel" id="ac-certifications"><h2>Certifieringar</h2><span class="ac-certificate-icon">${icon('certificate')}</span><span class="ac-cert-state">Underlag återstår</span><p>Här kan partnerns certifieringar samlas när ni har bestämt innehåll, bedömning och giltighet.</p><p class="ac-future">Klarmarkerade demomoment är inga kunskapsintyg och ger ingen certifiering.</p></section><section class="ac-panel"><h2>Kommande genomgång</h2><div class="ac-webinar"><div class="ac-calendar-date" aria-hidden="true"><b>21</b><span>OKT</span></div><div><h3>Upptäck partnerportalen</h3><p>21 oktober 2026<br>10:00–10:30 · exempelaktivitet</p><button class="ac-button" id="ac-webinar" aria-pressed="${!!progress.webinarBooked}">${progress.webinarBooked ? `${icon('check')} Markerad i demo` : 'Testa anmälan'}</button></div></div><p class="ac-future">Anmälan sparas lokalt som ett test. Ingen mötesbokning skickas.</p></section></aside></div></section>`;
  }
  function openCourse(id) {
    const course = courseById(id);
    if (!course) return;
    let activeLesson = course.lessons.findIndex(lesson => !training().completed[id].includes(lesson.id));
    if (activeLesson < 0) activeLesson = 0;
    const mountHtml = '<div class="academy-page"><p class="ac-dialog-intro">Läs ett kort demomoment och testa att markera det klart.</p><div id="academy-dialog-mount"></div><p class="ac-dialog-note">Demoinnehåll för att testa portalen. Framsteg sparas i denna webbläsare för vald exempelpartner. Klarmarkering ger inget kunskapsintyg eller certifikat.</p></div>';
    const mount = () => {
      const holder = document.querySelector('#academy-dialog-mount');
      if (!holder) return;
      const progress = training();
      const lesson = course.lessons[activeLesson];
      const done = progress.completed[id].includes(lesson.id);
      holder.innerHTML = `<div class="ac-dialog-body"><div><nav class="ac-lesson-menu" aria-label="Moment i utbildningen">${course.lessons.map((item, index) => `<button class="ac-lesson-nav ${index === activeLesson ? 'active' : ''}" data-ac-lesson="${index}" ${index === activeLesson ? 'aria-current="step"' : ''}><span class="ac-lesson-number ${progress.completed[id].includes(item.id) ? 'complete' : ''}">${progress.completed[id].includes(item.id) ? '✓' : index + 1}</span>${P.e(item.title)}</button>`).join('')}</nav><p class="ac-dialog-progress">${completed(course)} av ${course.lessons.length} moment klarmarkerade</p></div><article class="ac-lesson-copy"><span class="ac-demo-chip">Moment ${activeLesson + 1} av ${course.lessons.length} · demoinnehåll</span><h3 tabindex="-1" id="ac-lesson-title">${P.e(lesson.title)}</h3><p>${P.e(lesson.text)}</p><ul>${lesson.bullets.map(text => `<li>${P.e(text)}</li>`).join('')}</ul>${done ? '<p class="ac-completion">✓ Du har markerat detta demomoment klart.</p>' : ''}<div class="ac-lesson-actions"><button class="ac-button ${done ? '' : 'primary'}" id="ac-complete">${done ? 'Ångra klarmarkering' : `${icon('check')} Markera momentet klart`}</button>${activeLesson < course.lessons.length - 1 ? `<button class="ac-button" id="ac-next-lesson">Nästa moment ${icon('arrow')}</button>` : '<button class="ac-button" id="ac-close-course">Till utbildningarna</button>'}</div></article></div>`;
      holder.querySelectorAll('[data-ac-lesson]').forEach(button => button.addEventListener('click', () => {
        activeLesson = Number(button.dataset.acLesson); mount(); document.querySelector('#ac-lesson-title')?.focus();
      }));
      holder.querySelector('#ac-complete').addEventListener('click', () => {
        const values = training().completed[id];
        training().completed[id] = done ? values.filter(value => value !== lesson.id) : [...values, lesson.id];
        P.save(); P.render(); mount();
        document.querySelector('#ac-complete')?.focus();
        P.toast(done ? 'Klarmarkeringen borttagen i demo.' : 'Demomomentet klarmarkerat. Dina framsteg har sparats lokalt.');
      });
      holder.querySelector('#ac-next-lesson')?.addEventListener('click', () => {
        activeLesson += 1; mount(); document.querySelector('#ac-lesson-title')?.focus();
      });
      holder.querySelector('#ac-close-course')?.addEventListener('click', () => P.closeDialog());
    };
    P.openDialog(course.title, mountHtml, mount);
    document.querySelector('#portal-dialog')?.addEventListener('close', () => {
      document.querySelector(`[data-ac-course="${id}"]`)?.focus();
    }, { once: true });
  }
  function bind() {
    const view = document.querySelector('#view');
    if (!view) return;
    view.querySelectorAll('[data-ac-filter]').forEach(button => button.addEventListener('click', () => {
      filter = button.dataset.acFilter; P.render();
      document.querySelector(`[data-ac-filter="${filter}"]`)?.focus();
    }));
    view.querySelectorAll('[data-ac-course]').forEach(button => button.addEventListener('click', () => openCourse(button.dataset.acCourse)));
    view.querySelectorAll('[data-ac-bookmark]').forEach(button => button.addEventListener('click', () => {
      const id = button.dataset.acBookmark;
      const progress = training();
      const hasBookmark = progress.bookmarks.includes(id);
      progress.bookmarks = hasBookmark ? progress.bookmarks.filter(value => value !== id) : [...progress.bookmarks, id];
      P.save(); P.render();
      const restored = document.querySelector(`[data-ac-bookmark="${id}"]`);
      (restored || document.querySelector('[data-ac-filter="bookmarked"]'))?.focus();
      P.toast(hasBookmark ? 'Bokmärket borttaget.' : 'Utbildningen bokmärkt i denna webbläsare.');
    }));
    view.querySelector('#ac-explore')?.addEventListener('click', () => {
      const heading = document.querySelector('#ac-course-heading');
      heading.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      document.querySelector('[data-ac-filter="all"]')?.focus({ preventScroll: true });
    });
    view.querySelector('#ac-webinar')?.addEventListener('click', () => {
      training().webinarBooked = !training().webinarBooked;
      P.save(); P.render(); document.querySelector('#ac-webinar')?.focus();
      P.toast(training().webinarBooked ? 'Exempelaktiviteten markerad. Ingen mötesbokning har skickats.' : 'Testanmälan borttagen.');
    });
  }
  P.register('academy', { render, bind });
})();
