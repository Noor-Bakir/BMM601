

document.addEventListener('DOMContentLoaded', () => {
 
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

 
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const form = e.target;
      const s = document.getElementById('formStatus');
      if (!form.checkValidity()) {
        if (s) s.textContent = 'يرجى إكمال الحقول بشكل صحيح.';
        return;
      }
      if (s) s.textContent = 'تم الاستلام محليًا (عرض فقط).';
      form.reset();
    });
  }

 
  const quizData = [
    { q: 'أي نموذج لون يُستخدم لعرض الألوان على الشاشات؟', options: ['RGB', 'CMYK', 'Lab'], answer: 0, ref: 'CH2' },
    { q: 'أي نموذج لون هو الأنسب للطباعة التجارية؟', options: ['RGB', 'CMYK', 'HSV'], answer: 1, ref: 'CH2' },
    { q: 'أي صيغة صور مناسبة للويب بضغط فعّال وجودة جيدة؟', options: ['BMP', 'WEBP', 'TIFF'], answer: 1, ref: 'CH2' },
    { q: 'لشعارات ورسوم مسطّحة مع شفافية، ما الصيغة الأنسب؟', options: ['PNG', 'JPEG', 'GIF'], answer: 0, ref: 'CH2' },
    { q: 'يعتمد JPEG على:', options: ['ضغط بلا خسارة', 'ضغط خساري', 'بدون ضغط'], answer: 1, ref: 'CH2' },
    { q: 'يعتمد PNG على:', options: ['ضغط خساري', 'ضغط بلا خسارة', 'لا يدعم الشفافية'], answer: 1, ref: 'CH2' },
    { q: 'في الفيديو الرقمي غالبًا ما يُستخدم فضاء اللون:', options: ['RGB', 'YCbCr', 'CMYK'], answer: 1, ref: 'CH2' },
    { q: 'PPI تشير إلى:', options: ['نقاط الحبر في الطابعة', 'بكسلات لكل إنش على الشاشة', 'عدد الإطارات في الثانية'], answer: 1, ref: 'CH2' },
    { q: 'أيٌّ مما يلي ليس عنصرًا من عناصر الوسائط المتعددة؟', options: ['نص', 'صوت', 'معالج الحاسوب'], answer: 2, ref: 'CH1' },
    { q: 'أي حاوية فيديو شائعة على الويب؟', options: ['MP4', 'WAV', 'PNG'], answer: 0, ref: 'CH1' }
  ];

 
  const root = document.getElementById('quiz');
  if (!root) return;

  function ensure(id, factory) {
    let el = document.getElementById(id);
    if (el) return el;
    el = factory();
    el.id = id;
    return el;
  }

  const qtext = ensure('qtext', () => {
    const e = document.createElement('h3');
    e.className = 'text';
    root.prepend(e);
    return e;
  });

  const form = ensure('quizForm', () => {
    const e = document.createElement('form');
    e.className = 'panel';
    e.style.clipPath = 'none';
    e.style.padding = '14px';
    root.appendChild(e);
    return e;
  });

  const feedback = ensure('feedback', () => {
    const e = document.createElement('p');
    root.appendChild(e);
    return e;
  });

  const progress = ensure('progress', () => {
    const e = document.createElement('p');
    e.className = 'muted';
    root.appendChild(e);
    return e;
  });

  let btnWrap = root.querySelector('[data-quiz-btns]');
  if (!btnWrap) {
    btnWrap = document.createElement('div');
    btnWrap.dataset.quizBtns = '1';
    btnWrap.style.display = 'flex';
    btnWrap.style.gap = '8px';
    btnWrap.style.marginTop = '8px';
    root.appendChild(btnWrap);
  }

  let submitBtn = document.getElementById('submitBtn');
  if (!submitBtn) {
    submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.id = 'submitBtn';
    submitBtn.className = 'button_check';
    submitBtn.textContent = 'تحقّق';
    btnWrap.appendChild(submitBtn);
  }

  let nextBtn = document.getElementById('nextBtn');
  if (!nextBtn) {
    nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.id = 'nextBtn';
    nextBtn.className = 'button_check';
    nextBtn.style.display = 'none';
    nextBtn.textContent = 'التالي';
    btnWrap.appendChild(nextBtn);
  }

  // منطق الاختبار
  let i = 0, score = 0, locked = false;

  function renderQuestion() {
    locked = false;
    feedback.textContent = '';
    feedback.className = '';
    submitBtn.style.display = '';
    nextBtn.style.display = 'none';

    const item = quizData[i];
    qtext.textContent = `السؤال ${i + 1}: ${item.q}`;
    progress.textContent = `(${i + 1} من ${quizData.length})`;

    form.innerHTML = '';
    item.options.forEach((opt, idx) => {
      const id = `opt-${i}-${idx}`;
      const wrap = document.createElement('div');
      wrap.style.margin = '6px 0';
      wrap.innerHTML = `
        <input type="radio" name="answer" id="${id}" value="${idx}">
        <label for="${id}">${opt}</label>
      `;
      form.appendChild(wrap);
    });
  }

  function getSelected() {
    const inputs = form.querySelectorAll('input[name="answer"]');
    for (const el of inputs) if (el.checked) return parseInt(el.value, 10);
    return null;
  }

  function lockOptions() {
    form.querySelectorAll('input[name="answer"]').forEach(el => el.disabled = true);
    locked = true;
  }

  submitBtn.addEventListener('click', () => {
    if (locked) return;

    const sel = getSelected();
    if (sel === null) {
      feedback.textContent = 'اختر إجابة.';
      return;
    }

    lockOptions();

    const correct = quizData[i].answer;
    if (sel === correct) {
      score++;
      feedback.textContent = '✔ إجابة صحيحة.';
      feedback.className = 'correct';
    } else {
      feedback.textContent = `✘ خطأ. الإجابة الصحيحة: ${quizData[i].options[correct]}`;
      feedback.className = 'wrong';
    }

    submitBtn.style.display = 'none';
    nextBtn.style.display = '';
    nextBtn.textContent = (i + 1 === quizData.length) ? 'إنهاء' : 'التالي';
  });

  nextBtn.addEventListener('click', () => {
    if (i + 1 < quizData.length) {
      i++;
      renderQuestion();
    } else {
      qtext.textContent = 'النتيجة النهائية';
      form.innerHTML = '';
      const pct = Math.round((score / quizData.length) * 100);
      feedback.textContent = `أحرزت ${score} من ${quizData.length} (${pct}%).`;
      feedback.className = '';
      submitBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      progress.textContent = '';
    }
  });

  // بدء
  renderQuestion();
});