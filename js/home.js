function go(page) {
  alert("menu " + page + " dipilih");
}
// animasi masuk halaman
gsap.from("body", {
  opacity: 0,
  duration: 0.6,
  ease: "power2.out",
});

// animasi keluar halaman sebelum pindah
function smoothGo(page) {
  gsap.to("body", {
    opacity: 0,
    duration: 0.5,
    ease: "power2.in",
    onComplete: () => {
      window.location.href = page;
    },
  });
}
