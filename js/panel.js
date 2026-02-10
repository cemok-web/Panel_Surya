// ===== Helper DOM =====
const svg = document.getElementById("sim");
const sunG = document.getElementById("sun");
const panelG = document.getElementById("panel");
const ray = document.getElementById("ray");
const cellsG = document.getElementById("cells");

const tiltRange = document.getElementById("tiltRange");
const sunElevRange = document.getElementById("sunElevRange");
const sunAziRange = document.getElementById("sunAziRange");
const cloudRange = document.getElementById("cloudRange");
const powerFill = document.getElementById("powerFill");
const powerText = document.getElementById("powerText");
const irrText = document.getElementById("irrText");

// ===== Build solar cells grid =====
function buildCells() {
  const cols = 6,
    rows = 4,
    w = 600,
    h = 300,
    pad = 16;
  const cw = (w - pad * 2) / cols;
  const ch = (h - pad * 2) / rows;
  cellsG.innerHTML = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = -300 + pad + c * cw + 4;
      const y = -250 + pad + r * ch + 4;
      const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", cw - 8);
      rect.setAttribute("height", ch - 8);
      rect.setAttribute("rx", 6);
      rect.setAttribute("fill", "#2a5f8a");
      rect.setAttribute("stroke", "#1d4464");
      rect.setAttribute("stroke-width", 4);
      cellsG.appendChild(rect);
    }
  }
}
buildCells();

// ===== Math utilities =====
const toRad = (d) => (d * Math.PI) / 180;
function clamp(v, mi, ma) {
  return Math.max(mi, Math.min(ma, v));
}

// ===== Simulation state =====
function state() {
  return {
    tilt: +tiltRange.value, // panel tilt from horizontal (deg)
    elev: +sunElevRange.value, // sun elevation above horizon (deg)
    azi: +sunAziRange.value, // sun azimuth left(-) to right(+)
    cloud: +cloudRange.value / 100, // 0..1
  };
}

// ===== Render loop =====
function render() {
  const s = state();
  // Place sun in sky based on elevation & azimuth
  const radius = 350; // sky radius relative to center
  const cx = 800 + s.azi * 6; // shift horizontally with azimuth
  const cy = 650 - Math.sin(toRad(s.elev)) * radius - 80; // higher with elevation
  sunG.setAttribute("transform", `translate(${cx},${cy})`);

  // Panel tilt (rotate around its mount). Tilt 0 = flat, 60 = steep
  panelG.setAttribute("transform", `translate(1000,720) rotate(${-s.tilt})`);

  // Compute cosine of incidence between sun vector and panel normal
  // Panel normal in world coords (assuming panel faces up along its rotation)
  const panelNormalAngle = toRad(90 - s.tilt); // 90deg - tilt from x-axis
  const sunVecAngle = Math.atan2(720 - cy, 1000 - cx); // vector from sun to panel pivot
  const angleDiff = Math.abs(panelNormalAngle - sunVecAngle);
  const cosInc = Math.cos(angleDiff);
  const alignment = clamp(cosInc, 0, 1);

  // Cloud attenuation
  const cloudFactor = 1 - s.cloud; // 1 clear, 0 fully cloudy

  // Base irradiance at ground (simple): 1000 W/m2 * sin(elev)
  const baseIrr = clamp(Math.sin(toRad(s.elev)), 0, 1) * 1000;
  const effIrr = baseIrr * alignment * cloudFactor;

  // Panel model: area 1 m2, efficiency 20%
  const powerW = effIrr * 0.2;

  // Update UI meter
  const pct = clamp(powerW / 200, 0, 1) * 100; // normalize vs 200W peak for meter
  powerFill.style.width = pct.toFixed(1) + "%";
  powerText.textContent = `${powerW.toFixed(0)} W`;
  irrText.textContent = `${effIrr.toFixed(0)} W/m²`;

  // Draw ray from sun to panel and adjust opacity by alignment
  ray.setAttribute("x1", cx);
  ray.setAttribute("y1", cy);
  ray.setAttribute("x2", 1000);
  ray.setAttribute("y2", 720);
  ray.setAttribute("opacity", (0.25 + alignment * 0.75).toFixed(2));

  // Animate cells brightness by alignment
  const cells = cellsG.children;
  for (let i = 0; i < cells.length; i++) {
    const k = 0.35 + alignment * 0.65; // 0.35..1.0
    cells[i].setAttribute(
      "fill",
      `rgb(${Math.round(42 + 80 * k)}, ${Math.round(95 + 90 * k)}, ${Math.round(
        138 + 30 * k
      )})`
    );
  }
}

// Inputs listeners
[tiltRange, sunElevRange, sunAziRange, cloudRange].forEach((inp) =>
  inp.addEventListener("input", () => {
    render();
  })
);

// Gentle idle motion: sun drifts slowly when user idle
let t = 0;
setInterval(() => {
  t += 0.02;
  // Subtle breathing on sun rays
  const rays = document.querySelectorAll("#sunRays line");
  rays.forEach((ln, idx) => {
    const base = 0.4 + 0.2 * Math.sin(t + idx);
    ln.setAttribute("opacity", base.toFixed(2));
  });
}, 50);

// Entrance micro animation
gsap.from(".glass", {
  y: 20,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1,
  ease: "power2.out",
});
gsap.from("#sun circle", {
  scale: 0.8,
  transformOrigin: "center",
  duration: 0.8,
  ease: "back.out(2)",
});

// Initial render
render();
document.getElementById("next-btn").addEventListener("click", function () {
  window.location.href = "jenis.html";
});
