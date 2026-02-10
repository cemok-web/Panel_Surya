function go(page) {
  alert("menu " + page + " dipilih");
}

gsap.from("body", {
  opacity: 0,
  duration: 0.6,
  ease: "power2.out",
});


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
