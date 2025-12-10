const glass = document.getElementById("glass");
const overlay = glass.querySelector(".overlay");

glass.addEventListener("mousemove", (e) => {
  const rect = glass.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  // 마우스 주변만 살짝 보이게 하는 마스크
  const radiusInner = 6; // 중심부 살짝
  const radiusOuter = 18; // 가장자리 부드럽게 사라짐

  const mask = `radial-gradient(circle at ${x}% ${y}%, 
    rgba(0,0,0,1) 0%, 
    rgba(0,0,0,1) ${radiusInner}%, 
    rgba(0,0,0,0) ${radiusOuter}%)`;

  overlay.style.webkitMaskImage = mask;
  overlay.style.maskImage = mask;
});

glass.addEventListener("mouseleave", () => {
  // 마우스 나가면 완전히 사라지게
  overlay.style.webkitMaskImage =
    "radial-gradient(circle at center, transparent 0%, transparent 0%)";
  overlay.style.maskImage =
    "radial-gradient(circle at center, transparent 0%, transparent 0%)";
});
