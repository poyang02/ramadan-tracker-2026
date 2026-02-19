// tutorial.js

if (localStorage.getItem("ramadanTutorialSeen") === "true") {
  // Tutorial skipped
} else {
  showTutorial();
}

function showTutorial() {
  const prev = document.getElementById("tutorialOverlay");
  if (prev) prev.remove();

  const overlay = document.createElement("div");
  overlay.id = "tutorialOverlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-color: rgba(0,0,0,0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
    padding: 20px;
    box-sizing: border-box;
  `;

  setTimeout(() => overlay.style.opacity = "1", 50);

  const popup = document.createElement("div");
  popup.style.cssText = `
    background: #1c2128;
    color: #e4e6eb;
    border-radius: 20px;
    padding: 24px;
    width: 100%;
    max-width: 380px;
    max-height: 90vh;
    overflow-y: auto;
    font-family: system-ui, -apple-system, sans-serif;
    box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    box-sizing: border-box;
    border: 1px solid #30363d;
  `;

  const welcome = document.createElement("h2");
  welcome.innerText = "Selamat Datang!";
  welcome.style.cssText = "text-align: center; margin: 0 0 20px 0; font-size: 1.4rem; color: #58a6ff;";
  popup.appendChild(welcome);

  // Switch Preview
  const switchBox = document.createElement("div");
  switchBox.style.cssText = `
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    padding: 15px;
    background: #21262d;
    border-radius: 12px;
    align-items: center;
    border: 1px solid #30363d;
  `;

  const exampleSwitch = document.createElement("div");
  exampleSwitch.className = "fasting-toggle on"; 
  exampleSwitch.onclick = () => exampleSwitch.classList.toggle("off");

  const switchText = document.createElement("span");
  switchText.innerHTML = "<strong>Tanda Puasa:</strong> Klik suis ini. <br><small style='color:#8b949e'>OFF = Perlu Ganti Puasa.</small>";
  switchText.style.fontSize = "0.9rem";

  switchBox.appendChild(exampleSwitch);
  switchBox.appendChild(switchText);
  popup.appendChild(switchBox);

  // Instructions
  const steps = [
    "🕌 <b>Solat:</b> Tandakan solat berjemaah anda.",
    "📖 <b>Quran:</b> Klik atau seret untuk tanda mukasurat.",
    "💰 <b>Sedekah:</b> Masukkan nilai RM sedekah harian.",
    "🌙 <b>Tarawih:</b> Pilih bilangan rakaat (8 atau 20).",
    "📈 <b>Statistik:</b> Data sebulan akan dikumpul dan dipaparkan pada <b>Sticky Header</b> di bahagian atas skrin."
  ];

  steps.forEach(text => {
    const p = document.createElement("p");
    p.innerHTML = text;
    p.style.cssText = "margin-bottom: 14px; font-size: 0.95rem; line-height: 1.5; color: #c9d1d9;";
    popup.appendChild(p);
  });

  // Footer
  const footer = document.createElement("div");
  footer.style.cssText = "margin-top: 25px; padding-top: 20px; display: flex; flex-direction: column; align-items: center; gap: 15px;";

  // Centered Styled Checkbox
  const label = document.createElement("label");
  label.style.cssText = `
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 0.9rem;
    color: #8b949e;
    user-select: none;
    transition: color 0.2s;
  `;
  label.onmouseover = () => label.style.color = "#c9d1d9";
  label.onmouseleave = () => label.style.color = "#8b949e";
  
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "dontShowAgain";
  checkbox.style.cssText = "width: 16px; height: 16px; cursor: pointer; accent-color: #3b82f6;";
  
  label.appendChild(checkbox);
  label.appendChild(document.createTextNode("Jangan tunjuk lagi"));
  footer.appendChild(label);

  const closeBtn = document.createElement("button");
  closeBtn.innerText = "Faham & Mula";
  closeBtn.style.cssText = `
    width: 100%; 
    padding: 14px; 
    background: #238636; 
    color: white; 
    border: none; 
    border-radius: 10px;
    font-weight: bold; 
    cursor: pointer; 
    font-size: 1rem;
    transition: background 0.2s;
  `;
  closeBtn.onmouseover = () => closeBtn.style.background = "#2ea043";
  closeBtn.onmouseleave = () => closeBtn.style.background = "#238636";

  closeBtn.onclick = () => {
    if (document.getElementById("dontShowAgain").checked) {
      localStorage.setItem("ramadanTutorialSeen", "true");
    }
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 300);
  };

  footer.appendChild(closeBtn);
  popup.appendChild(footer);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}
/* ===== Manual Trigger for Guide Button ===== */
const guideBtn = document.getElementById("guideBtn");
if (guideBtn) {
    guideBtn.onclick = () => {
        showTutorial(); // This function is already defined in your tutorial.js
    };
}