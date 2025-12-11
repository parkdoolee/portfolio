gsap.registerPlugin(ScrollTrigger);

window.addEventListener("DOMContentLoaded", () => {
  // ============================================
  // 모든 줄 요소 수집
  // ============================================
  const topLines = document.querySelectorAll(".top p");
  const bottomLines = document.querySelectorAll(".bottom p");
  const koLines = document.querySelectorAll("[data-scroll-fade] p");

  const allElements = [...topLines, ...bottomLines, ...koLines];

  // 텍스트 초기 상태
  gsap.set(allElements, {
    opacity: 0,
    y: 40,
    filter: "blur(10px)",
    backgroundPosition: "100% 0",
  });

  // ============================================
  // 텍스트 나타남 애니메이션 (기존 유지)
  // ============================================
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".identity",
      start: "top 50%",
      end: "60% 30%",
      scrub: 2,
    },
  });

  allElements.forEach((el, i) => {
    // 마지막 영어 문장(index 4)과 한국어(index 5)를 같은 타이밍에
    let timing = i * 0.5;
    if (i === 5) timing = 4 * 0.5;

    tl.to(
      el,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        backgroundPosition: "0% 0",
        duration: 2,
        ease: "power1.out",
      },
      timing
    );
  });

  // ============================================
  // 이미지: 패럴랙스 (천천히 위로)
  // ============================================
  const imgEl = document.querySelector("[data-scroll-img]");
  if (imgEl) {
    // 나타남 효과
    gsap.fromTo(
      imgEl,
      {
        opacity: 0,
        filter: "blur(20px)",
        y: 120,
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 3,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".identity",
          start: "top 30%",
          toggleActions: "play none none none",
        },
      }
    );

    // 패럴랙스 (느리게)
    gsap.to(imgEl, {
      y: -200,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".identity",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  // ============================================
  // 텍스트 영역: 패럴랙스 (빠르게 위로)
  // ============================================
  gsap.to(".identity_right", {
    y: -250,
    ease: "none",
    scrollTrigger: {
      trigger: ".identity",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
});
