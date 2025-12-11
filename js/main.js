gsap.registerPlugin(ScrollTrigger);

window.addEventListener("DOMContentLoaded", () => {
  // ============================================
  // 모든 줄 요소 수집 (기존 유지)
  // ============================================
  const topLines = document.querySelectorAll(".top p");
  const bottomLines = document.querySelectorAll(".bottom p");
  const koLines = document.querySelectorAll("[data-scroll-fade] p");

  const allElements = [...topLines, ...bottomLines, ...koLines];

  // 텍스트 초기 상태 (기존 유지)
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
        ease: "power2.out",
      },
      timing
    );
  });

  // ============================================
  // 텍스트 영역: 패럴랙스 (빠르게 위로) (기존 유지)
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

  // ============================================
  // 이미지 영역: 스크롤 패럴랙스 (밑점 95px 위치에서 시작) <-- 수정된 부분
  // ============================================
  const imgElement = document.querySelector(".identity_left img");

  // 시작 위치: 이미지가 컨테이너 아래쪽에서 시작하도록 충분히 큰 음수 값 설정
  // 이 값을 조절하여 이미지 밑점이 95px 위치에 맞도록 조정해야 합니다.
  const startY = -550; // <--- 이 값을 조절해야 합니다.

  // 종료 위치: 시작점으로부터 +만큼 위로 이동하여 끝냄
  const endY = startY + 400;

  gsap.fromTo(
    imgElement,
    {
      y: startY, // 시작 Y 위치 (음수 값으로 이미지 상단을 위로 끌어올림)
      ease: "power3.out",
    },
    {
      y: endY, // 종료 Y 위치 (위로 이동)
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".identity",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
});
