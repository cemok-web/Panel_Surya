function setActive(flows, ids, markerId) {
  Object.values(flows).forEach((p) => {
    p.style.opacity = 0.15;
    p.removeAttribute("marker-end");
  });
  ids.forEach((id) => {
    flows[id].style.opacity = 1;
    flows[id].setAttribute("marker-end", `url(#${markerId})`);
  });
}

// ========== ON GRID ==========
const ogFlows = {
  og_sun_panel,
  og_panel_inv,
  og_inv_home,
  og_grid_home,
};

function setOnGrid(mode) {
  if (mode === "day") {
    setActive(
      ogFlows,
      ["og_sun_panel", "og_panel_inv", "og_inv_home"],
      "arrow_og"
    );
  } else {
    setActive(ogFlows, ["og_grid_home"], "arrow_og");
  }

  btnOgDay.classList.toggle("active", mode === "day");
  btnOgNight.classList.toggle("active", mode === "night");
}

btnOgDay.onclick = () => setOnGrid("day");
btnOgNight.onclick = () => setOnGrid("night");
setOnGrid("day");

// ========== OFF GRID ==========
const offFlows = {
  off_sun_panel: document.getElementById("off_sun_panel"),
  off_panel_batt: document.getElementById("off_panel_batt"),
  off_batt_inv: document.getElementById("off_batt_inv"),
  off_inv_home: document.getElementById("off_inv_home"),
};

setActive(
  offFlows,
  ["off_sun_panel", "off_panel_batt", "off_batt_inv", "off_inv_home"],
  "arrow_off"
);

// ========== HYBRID ==========
const hyFlows = {
  hy_sun_panel: document.getElementById("hy_sun_panel"),
  hy_panel_batt: document.getElementById("hy_panel_batt"),
  hy_batt_inv: document.getElementById("hy_batt_inv"),
  hy_inv_home: document.getElementById("hy_inv_home"),
  hy_grid_home: document.getElementById("hy_grid_home"),
};

function setHybrid(battLow = false) {
  if (!battLow) {
    // normal hybrid: solar -> panel -> batt -> inverter -> rumah only
    setActive(
      hyFlows,
      ["hy_sun_panel", "hy_panel_batt", "hy_batt_inv", "hy_inv_home"],
      "arrow_hy"
    );
  } else {
    // low batt -> PLN -> Rumah ONLY
    setActive(hyFlows, ["hy_grid_home"], "arrow_hy");
  }
}

document
  .getElementById("btnHyBattLow")
  .addEventListener("click", () => setHybrid(true));
document
  .getElementById("btnHyReset")
  .addEventListener("click", () => setHybrid(false));
setHybrid(false);
const hyResetBtn = document.getElementById("btnHyReset");
const hyLowBtn = document.getElementById("btnHyBattLow");

hyResetBtn.addEventListener("click", () => {
  hyResetBtn.classList.add("active");
  hyLowBtn.classList.remove("active");
  setHybrid(false); // kondisi normal
});

hyLowBtn.addEventListener("click", () => {
  hyLowBtn.classList.add("active");
  hyResetBtn.classList.remove("active");
  setHybrid(true); // kondisi baterai low
});
document.getElementById("btn-prev").addEventListener("click", function () {
  window.location.href = "panel.html";
});

document.getElementById("btn-next").addEventListener("click", function () {
  window.location.href = "fungsi.html";
});
