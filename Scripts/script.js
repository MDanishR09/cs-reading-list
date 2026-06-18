
  const STORAGE_KEY = 'cs_reading_done';

  function getRead() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
  }

  function saveRead(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }

  function updateProgress() {
    const total = document.querySelectorAll('.paper').length;
    const done = document.querySelectorAll('.done-btn.checked').length;
    document.getElementById('read-count').textContent = done;
    const pct = total ? Math.round((done / total) * 100) : 0;
    document.getElementById('progress-pct').textContent = pct + '%';
    document.getElementById('progress-fill').style.width = pct + '%';
  }

  function toggleDone(btn) {
    const paper = btn.closest('.paper');
    const key = paper.dataset.title;
    const read = getRead();
    const isChecked = btn.classList.toggle('checked');
    btn.querySelector('span').textContent = isChecked ? 'Read ✓' : 'Mark read';
    if (isChecked) { read[key] = true; } else { delete read[key]; }
    saveRead(read);
    updateProgress();
  }

  function toggleSection(header) {
    header.closest('.section').classList.toggle('open');
  }

  // Restore read state
  (function init() {
    const read = getRead();
    document.querySelectorAll('.paper').forEach(paper => {
      if (read[paper.dataset.title]) {
        const btn = paper.querySelector('.done-btn');
        btn.classList.add('checked');
        btn.querySelector('span').textContent = 'Read ✓';
      }
    });
    updateProgress();
    // Animate progress bar on load
    setTimeout(() => { updateProgress(); }, 100);
  })();

  // Search
  document.getElementById('search').addEventListener('input', function() {
    const q = this.value.toLowerCase().trim();
    let anyVisible = false;
    document.querySelectorAll('.section').forEach(section => {
      let sectionHasMatch = false;
      section.querySelectorAll('.paper').forEach(paper => {
        const title = (paper.dataset.title || '').toLowerCase();
        const author = (paper.dataset.author || '').toLowerCase();
        const year = paper.querySelector('.paper-year').textContent;
        const match = !q || title.includes(q) || author.includes(q) || year.includes(q);
        paper.style.display = match ? '' : 'none';
        if (match) sectionHasMatch = true;
      });
      section.style.display = sectionHasMatch ? '' : 'none';
      if (sectionHasMatch) {
        anyVisible = true;
        if (q) section.classList.add('open');
      }
    });
    document.getElementById('no-results').style.display = anyVisible ? 'none' : 'block';
  });


