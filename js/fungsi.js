// ===== STATE =====
let sunOn = false;
let chainReady = false;
let lampSwitchOn = false;
let tl = null;

// Controls
const btnStart = document.getElementById("btnStart");
const btnStop = document.getElementById("btnStop");
const btnReset = document.getElementById("btnReset");
const btnSun = document.getElementById("btnSun");
const lampSwitch = document.getElementById("lampSwitch");

// Nodes/parts
const sunGlow = document.getElementById("sunGlow");
const invGlow = document.getElementById("invGlow");
const battFill = document.getElementById("battFill");
const battText = document.getElementById("battText");
const lampBulb = document.getElementById("lampBulb");

// Flows
const fSunPanel = document.getElementById("fSunPanel");
const fPanelCtrl = document.getElementById("fPanelCtrl");
const fCtrlBatt = document.getElementById("fCtrlBatt");
const fBattInv = document.getElementById("fBattInv");
const fInvLamp = document.getElementById("fInvLamp");

// Helpers
const setOpacity = (el, v) => gsap.set(el, { opacity: v });
function disableSwitch() {
  lampSwitch.classList.remove("enabled");
  lampSwitch.style.opacity = 0.6;
}
function enableSwitch() {
  lampSwitch.classList.add("enabled");
  lampSwitch.style.opacity = 1;
}
function lampOff() {
  lampBulb.classList.remove("lamp-on");
  lampBulb.classList.add("lamp-off");
}
function lampOn() {
  lampBulb.classList.add("lamp-on");
  lampBulb.classList.remove("lamp-off");
}

function resetVisual() {
  [fSunPanel, fPanelCtrl, fCtrlBatt, fBattInv, fInvLamp].forEach((p) =>
    setOpacity(p, 0)
  );
  [sunGlow, invGlow].forEach((g) => setOpacity(g, 0));
  gsap.set(battFill, { width: 0 });
  battText.textContent = "0%";
  lampOff();
  disableSwitch();
}
function hardReset() {
  if (tl) {
    tl.kill();
    tl = null;
  }
  chainReady = false;
  lampSwitchOn = false;
  resetVisual();
}
function powerDownAll() {
  hardReset();
}
function maybeLight() {
  if (chainReady && lampSwitchOn && sunOn) {
    gsap.to(fInvLamp, {
      opacity: 1,
      duration: 0.22,
      yoyo: true,
      repeat: 3,
    });
    lampOn();
  } else {
    lampOff();
  }
}

// Events
btnSun.addEventListener("click", () => {
  sunOn = !sunOn;
  btnSun.classList.toggle("sun-on", sunOn);
  if (!sunOn) powerDownAll();
});

btnStart.addEventListener("click", () => {
  if (!sunOn) {
    sunOn = true;
    btnSun.classList.add("sun-on");
  }
  hardReset();
  tl = gsap.timeline({ paused: false });

  tl.to(sunGlow, { opacity: 1, duration: 0.35, ease: "power1.out" }, 0.0)
    .to(fSunPanel, { opacity: 1, duration: 0.35 }, 0.1)
    .to(fPanelCtrl, { opacity: 1, duration: 0.35 }, "+=0.05")
    .to(fCtrlBatt, { opacity: 1, duration: 0.35 }, "+=0.0")
    .to(
      battFill,
      {
        width: 136,
        duration: 1.2,
        ease: "power1.inOut",
        onUpdate() {
          const prog = Math.round(
            (gsap.getProperty(battFill, "width") / 136) * 100
          );
          battText.textContent = prog + "%";
        },
      },
      "-=0.2"
    )
    .to(fBattInv, { opacity: 1, duration: 0.35 }, "+=0.0")
    .to(invGlow, { opacity: 1, duration: 0.3 }, "+=0.0")
    .add(() => {
      chainReady = true;
      enableSwitch();
      maybeLight();
    });
});

btnStop.addEventListener("click", () => {
  if (tl) {
    tl.paused(!tl.paused());
  }
});
btnReset.addEventListener("click", hardReset);

lampSwitch.addEventListener("click", () => {
  if (!lampSwitch.classList.contains("enabled")) return;
  lampSwitchOn = !lampSwitchOn;
  lampSwitch.classList.toggle("on", lampSwitchOn);
  maybeLight();
});

// init
resetVisual();
document.getElementById("btn-prev").addEventListener("click", function () {
  window.location.href = "jenis.html";
});

document.getElementById("btn-next").addEventListener("click", function () {
  window.location.href = "plusmines.html";
});
