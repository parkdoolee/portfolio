gsap.registerPlugin(ScrollTrigger);

window.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis({
    duration: 0.8,
    easing: (t) => t, // 선형 (빠른 반응)
    smooth: true,
    smoothTouch: true, // 모바일 터치 스크롤 부드럽게
  });

  function raf(t) {
    lenis.raf(t);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
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
      scrub: 1,
    },
  });

  // 마지막 영어 문장(index 4)과 한국어(index 5)를 같은 타이밍에
  allElements.forEach((el, i) => {
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
    y: -350,
    ease: "expo.out",
    scrollTrigger: {
      trigger: ".identity",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });

  // ============================================
  // 이미지 영역: 스크롤 패럴랙스 (밑점 95px 위치에서 시작) (기존 유지)
  // ============================================
  const imgElement = document.querySelector(".identity_left img");

  // 시작 위치: 이미지가 컨테이너 아래쪽에서 시작하도록 충분히 큰 음수 값 설정
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

// ============================================
// multiDesigner 섹션 애니메이션
// ============================================
const multiSection = document.querySelector(".multiDesigner");
if (multiSection) {
  const visual = document.querySelector(".multi_visual");
  const images = document.querySelectorAll(".multi_img");
  const video = document.querySelector(".multi_video");
  const textGroups = document.querySelectorAll(".multi_text_group");
  const title = document.querySelector(".multi_title"); // ⭐ 추가: 제목 요소 선택

  // 초기 상태 설정
  gsap.set(visual, { opacity: 0, scale: 0.85 });

  // 제목 초기 상태 설정 (GSAP으로 제어하기 위해 초기 투명도를 1로 설정)
  gsap.set(title, { y: 0, opacity: 1 });

  // 메인 타임라인 (스크롤에 연동)
  const multiTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".multiDesigner",
      start: "top top",
      end: "bottom bottom",
      scrub: 2, // 더 부드럽게
      onUpdate: (self) => {
        if (self.progress > 0.9 && video.paused) {
          video.play();
        }
      },
    },
  });

  // ============================================
  // 제목 사라짐 (가장 먼저 시작)
  // ============================================
  multiTl.to(
    title,
    {
      opacity: 0,
      y: -50, // 위로 살짝 이동하며 사라짐
      duration: 0.5,
      ease: "power2.out",
    },
    0 // 타임라인 시작점
  );

  // ============================================
  // 이미지 나타남 + 연속 확대 시작
  // ============================================
  multiTl.to(
    visual,
    {
      opacity: 1,
      scale: 1,
      duration: 0.7,
      ease: "power3.out",
    },
    0.6 // 제목이 사라지는 중간 이후에 시작
  );

  multiTl.to(
    textGroups[0],
    {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
    },
    0.9
  );

  // ============================================
  // 이미지 연속 확대 (끊김 없이 계속 커짐)
  // ============================================
  multiTl.to(
    visual,
    {
      width: "100vw",
      height: "100vh",
      duration: 2.5, // 길게 설정해서 끝까지 천천히 확대
      ease: "none", // 일정한 속도로
    },
    0.9
  );

  // ============================================
  // 텍스트1 사라짐
  // ============================================
  multiTl.to(
    textGroups[0],
    {
      opacity: 0,
      duration: 0.3,
    },
    1.3
  );

  // ============================================
  // 이미지1 → 이미지2 (확대 중간에 전환)
  // ============================================
  multiTl.to(
    images[0],
    {
      opacity: 0,
      duration: 0.5,
      ease: "power1.inOut",
    },
    1.4
  );
  multiTl.to(
    images[1],
    {
      opacity: 1,
      duration: 0.5,
      ease: "power1.inOut",
    },
    1.4
  );

  // 텍스트2 나타남
  multiTl.to(
    textGroups[1],
    {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
    },
    1.6
  );

  // 텍스트2 사라짐
  multiTl.to(
    textGroups[1],
    {
      opacity: 0,
      duration: 0.3,
    },
    2.2
  );

  // ============================================
  // 이미지2 → 이미지3 (확대 계속되면서 전환)
  // ============================================
  multiTl.to(
    images[1],
    {
      opacity: 0,
      duration: 0.5,
      ease: "power1.inOut",
    },
    2.4
  );
  multiTl.to(
    images[2],
    {
      opacity: 1,
      duration: 0.5,
      ease: "power1.inOut",
    },
    2.4
  );

  // ============================================
  // 비디오 페이드인 + 재생
  // ============================================
  multiTl.to(
    images[2],
    {
      opacity: 0,
      duration: 0.5,
      ease: "power1.inOut",
    },
    3.2
  );
  multiTl.to(
    video,
    {
      opacity: 1,
      duration: 0.5,
      ease: "power1.inOut",
    },
    3.2
  );
}

// ============================================
// PROJECT 섹션: 순차적 줌인/설명/전환 효과 (시작 지점 수정)
// ============================================
const projectSection = document.querySelector(".project");
if (projectSection) {
  const galleryWrap = document.querySelector(".project_gallery_wrap");
  const panels = document.querySelectorAll(".project_panel");
  const descPanels = document.querySelectorAll(".panel_description");

  // (getPanelTransform 함수는 그대로 유지)
  const getPanelTransform = (panel) => {
    const panelRect = panel.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    // ... (Transform 계산 로직)
    const scaleX = viewportW / panelRect.width;
    const scaleY = viewportH / panelRect.height;
    const targetScale = Math.max(scaleX, scaleY);

    const viewportCenterX = viewportW / 2;
    const viewportCenterY = viewportH / 2;

    const panelCenterX = panelRect.left + panelRect.width / 2;
    const panelCenterY = panelRect.top + panelRect.height / 2;

    const dx = viewportCenterX - panelCenterX;
    const dy = viewportCenterY - panelCenterY;

    const xTranslate = dx / targetScale;
    const yTranslate = dy / targetScale;

    return {
      scale: targetScale,
      x: xTranslate,
      y: yTranslate,
    };
  };

  // 전체 애니메이션을 제어하는 마스터 타임라인 설정
  const totalScrollDistance = 1500;

  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: projectSection,
      // ⭐️ 수정: 이전 섹션(multiDesigner)의 끝 지점에서 시작 ⭐️
      start: "top bottom", // Project 섹션의 상단이 뷰포트 하단에 닿을 때 (기본 스크롤 시작)
      end: `+=${totalScrollDistance}vh`,
      scrub: true,
      pin: true,
      pinSpacing: true,
    },
  });

  // ... (masterTl 내부의 패널 애니메이션 로직은 그대로 유지)
  panels.forEach((panel, i) => {
    const transforms = getPanelTransform(panel);
    const description = descPanels[i];

    const durationZoom = 50;
    const durationDesc = 20;
    const durationWait = 10;
    const totalPanelTime = durationZoom + durationDesc + durationWait;

    const startTime = `+=${totalPanelTime * i}`;

    masterTl.to(
      galleryWrap,
      {
        scale: transforms.scale,
        x: transforms.x,
        y: transforms.y,
        ease: "power2.inOut",
        duration: durationZoom,
      },
      startTime
    );

    masterTl.to(
      description,
      {
        opacity: 1,
        visibility: "visible",
        duration: durationDesc,
        ease: "none",
      },
      `+=${durationZoom}`
    );

    masterTl.to(
      {},
      {
        duration: durationWait,
      },
      `+=${durationDesc}`
    );

    masterTl.to(
      description,
      {
        opacity: 0,
        visibility: "hidden",
        duration: durationDesc,
        ease: "none",
      },
      `+=${durationWait}`
    );

    if (i === panels.length - 1) {
      masterTl.to(
        galleryWrap,
        {
          scale: 1,
          x: 0,
          y: 0,
          ease: "power2.inOut",
          duration: durationZoom,
        },
        `+=${durationDesc}`
      );
    }
  });
}
