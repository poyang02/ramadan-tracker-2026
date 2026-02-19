const startDate = new Date(2026, 1, 19);
const container = document.getElementById("daysContainer");

// Get today's date and reset time to midnight for accurate comparison
const today = new Date();
today.setHours(0, 0, 0, 0);

let totalPages = 0;
let totalSadaqah = 0;
let totalTaraweehDays = 0;
let totalTaraweehRakaat = 0;
let totalGantiPuasa = 0;

function formatDateMalay(date) {
  const days = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
  const months = ["Januari", "Februari", "Mac", "April", "Mei", "Jun",
                  "Julai", "Ogos", "September", "Oktober", "November", "Disember"];

  const dayName = days[date.getDay()];
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year} (${dayName})`;
}

function updateStats() {
  document.getElementById("statPages").innerText = `${totalPages}/604`;
  document.getElementById("statSadaqah").innerText = `RM${totalSadaqah}`;
  document.getElementById("statTaraweeh").innerText = `${totalTaraweehDays} hari/${totalTaraweehRakaat} rakaat`;
  document.getElementById("statGanti").innerText = `${totalGantiPuasa} hari`;
}

function getQuranDots(day) {
  if (day === 1) return 21;
  if (day === 30) return 23;
  return 20;
}

function getPageStart(day) {
  let start = 1;
  for (let d = 1; d < day; d++) {
    start += getQuranDots(d);
  }
  return start;
}

/* ===== Sticky Header ===== */
const statsBar = document.createElement("div");
statsBar.className = "stats-bar";
statsBar.innerHTML = `
  <div class="stats-content">
    <div>📖 Muka Surat: <strong id="statPages">0/604</strong></div>
    <div>💰 Sedekah: <strong id="statSadaqah">RM0</strong></div>
    <div>🌙 Tarawih: <strong id="statTaraweeh">0 hari/0 rakaat</strong></div>
    <div>🔄 Ganti Puasa: <strong id="statGanti">0 hari</strong></div>
  </div>
`;
document.body.appendChild(statsBar);

/* ===== Load saved data from localStorage ===== */
const savedData = JSON.parse(localStorage.getItem("ramadan2026Data") || "{}");

/* ===== Build Days ===== */
for (let i = 0; i < 30; i++) {
  const dayNumber = i + 1;
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + i);
  
  // Normalize loop date for comparison
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  const card = document.createElement("div");
  card.className = "day-card";
  
  // Detect if this card is for Today
  if (compareDate.getTime() === today.getTime()) {
    card.classList.add("today-highlight");
  }

  /* ===== Header with Fasting button ===== */
  const header = document.createElement("div");
  header.className = "day-header";

  const left = document.createElement("div");
  left.className = "day-header-left";
  left.innerHTML = `<strong>Hari ${dayNumber}</strong><small>${formatDateMalay(date)}</small>`;

  const fastingToggle = document.createElement("div");
  fastingToggle.className = "fasting-toggle on";

  const right = document.createElement("div");
  right.className = "day-header-right";

  const dayStats = document.createElement("span");
  dayStats.className = "day-summary-text";

  /* Load fasting state */
  if (savedData[dayNumber]?.fasting === false) {
    fastingToggle.classList.add("off");
    totalGantiPuasa++;
  }

  fastingToggle.onclick = (e) => {
    e.stopPropagation();
    if (fastingToggle.classList.contains("off")) {
      fastingToggle.classList.remove("off");
      totalGantiPuasa--;
      saveDay(dayNumber, { fasting: true });
    } else {
      fastingToggle.classList.add("off");
      totalGantiPuasa++;
      saveDay(dayNumber, { fasting: false });
    }
    updateStats();
  };

  right.appendChild(fastingToggle);
  header.appendChild(left);
  right.appendChild(dayStats);
  header.appendChild(right);

  /* ===== Expandable Content ===== */
  const content = document.createElement("div");
  // Expand if today, otherwise hide (except Day 1 if no today found)
  if (compareDate.getTime() !== today.getTime() && dayNumber !== 1) {
      content.classList.add("hidden");
  }
  
  header.onclick = () => content.classList.toggle("hidden");

  /* ===== Flex container for Solat + Tarawih ===== */
  const flexContainer = document.createElement("div");
  flexContainer.style.display = "flex";
  flexContainer.style.gap = "20px";

  /* ===== Solat Jemaah ===== */
  const prayersSection = document.createElement("div");
  prayersSection.className = "section";
  prayersSection.innerHTML = "<h3>🕌Solat Jemaah</h3>";

  const solat = ["Subuh", "Zuhur", "Asar", "Maghrib", "Isyak"];
  solat.forEach(p => {
    const btn = document.createElement("button");
    btn.textContent = p;
    if (savedData[dayNumber]?.prayers?.includes(p)) btn.classList.add("active");
    btn.onclick = () => {
      btn.classList.toggle("active");
      saveDay(dayNumber, { prayers: Array.from(prayersSection.querySelectorAll("button.active")).map(b => b.textContent) });
    };
    prayersSection.appendChild(btn);
  });

  /* ===== Tarawih ===== */
  const taraSection = document.createElement("div");
  taraSection.className = "section";
  taraSection.innerHTML = "<h3>🌙Tarawih</h3>";

  const tara8 = document.createElement("button");
  tara8.textContent = "8 Rakaat";
  const tara20 = document.createElement("button");
  tara20.textContent = "20 Rakaat";

  let selectedRakaat = 0;

  function updateDayStats() {
      const quranActive = dotsContainer.querySelectorAll(".active").length;
      const sedekahVal = input.value || 0;
      dayStats.innerText = `📖: ${quranActive}, 💰: ${sedekahVal}, 🌙: ${selectedRakaat}`;
  }

  function selectTaraweeh(rakaat, isInitialLoad = false) {
    if (selectedRakaat === 0 && rakaat > 0) totalTaraweehDays++;
    
    totalTaraweehRakaat -= selectedRakaat;
    selectedRakaat = rakaat;
    totalTaraweehRakaat += rakaat;

    tara8.classList.remove("active");
    tara20.classList.remove("active");

    if (rakaat === 8) tara8.classList.add("active");
    if (rakaat === 20) tara20.classList.add("active");

    updateDayStats();
    if (!isInitialLoad) {
        saveDay(dayNumber, { taraweeh: rakaat });
        updateStats();
    }
  }

  tara8.onclick = () => selectTaraweeh(8);
  tara20.onclick = () => selectTaraweeh(20);

  taraSection.appendChild(tara8);
  taraSection.appendChild(tara20);

  /* ===== Quran ===== */
  const quranSection = document.createElement("div");
  quranSection.className = "section";
  quranSection.innerHTML = "<h3>📖Quran</h3>";

  const dotsContainer = document.createElement("div");
  dotsContainer.className = "quran-dots";

  const startPage = getPageStart(dayNumber);
  const dotsCount = getQuranDots(dayNumber);
  let isDragging = false;

  for (let d = 0; d < dotsCount; d++) {
    const dot = document.createElement("div");
    dot.className = "dot";
    const pageNum = (startPage + d).toString();
    dot.innerText = pageNum;

    if (savedData[dayNumber]?.quranPages?.includes(pageNum)) {
      dot.classList.add("active");
      totalPages++;
    }

    dot.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      isDragging = true;
      toggleDot(dot);
    });

    dot.addEventListener("mouseover", () => {
      if (isDragging) toggleDot(dot);
    });

    function toggleDot(dot) {
      if (!dot.classList.contains("active")) {
        dot.classList.add("active");
        totalPages++;
      } else {
        dot.classList.remove("active");
        totalPages--;
      }
      updateDayStats();
      saveDay(dayNumber, { quranPages: Array.from(dotsContainer.querySelectorAll(".active")).map(d => d.innerText) });
      updateStats();
    }
    dotsContainer.appendChild(dot);
  }
  document.addEventListener("mouseup", () => { isDragging = false; });
  quranSection.appendChild(dotsContainer);

  /* ===== Sedekah ===== */
  const sadaqahSection = document.createElement("div");
  sadaqahSection.className = "section";
  sadaqahSection.innerHTML = "<h3>💰Sedekah</h3>";

  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = "Jumlah(RM)";
  let previousAmount = 0;
  
  const label = document.createElement("span");
  label.innerText = "RM ";
  sadaqahSection.appendChild(label);
  sadaqahSection.appendChild(input);

  if (savedData[dayNumber]?.sadaqah) {
    input.value = savedData[dayNumber].sadaqah;
    previousAmount = Number(input.value);
    totalSadaqah += previousAmount;
  }

  input.oninput = () => {
    totalSadaqah -= previousAmount;
    previousAmount = Number(input.value) || 0;
    totalSadaqah += previousAmount;
    updateDayStats();
    saveDay(dayNumber, { sadaqah: previousAmount });
    updateStats();
  };

  /* Initialize Taraweeh from saved data */
  if (savedData[dayNumber]?.taraweeh) {
    selectTaraweeh(savedData[dayNumber].taraweeh, true);
  } else {
    updateDayStats();
  }

  /* ===== Append sections ===== */
  flexContainer.appendChild(prayersSection);
  flexContainer.appendChild(taraSection);
  content.appendChild(flexContainer);
  content.appendChild(quranSection);
  content.appendChild(sadaqahSection);
  card.appendChild(header);
  card.appendChild(content);
  container.appendChild(card);
}

function saveDay(day, data) {
  const allData = JSON.parse(localStorage.getItem("ramadan2026Data") || "{}");
  if (!allData[day]) allData[day] = {};
  Object.assign(allData[day], data);
  localStorage.setItem("ramadan2026Data", JSON.stringify(allData));
}

updateStats();

/* ===== WhatsApp Share Logic ===== */
const shareBtn = document.getElementById("shareBtn");

if (shareBtn) {
  shareBtn.onclick = () => {
    const text = "Jom track ibadah Ramadan 2026 sama-sama! Guna tracker ni, senang nak pantau Quran, Sedekah & Tarawih: ";
    const url = window.location.href; // Automatically gets your deployed URL
    
    // Create the WhatsApp link
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + url)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };
}