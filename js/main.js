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
// PROJECT 섹션: 그리드 전체 확대 → 설명 → 복귀 반복
// ============================================
const projectSection = document.querySelector(".project");
if (projectSection) {
  const galleryWrap = document.querySelector(".gallery-wrap");
  const gallery = document.querySelector(".gallery");
  const items = document.querySelectorAll(".gallery__item");
  const details = document.querySelectorAll(".project-detail");
  const panelCount = items.length;

  // 각 패널이 화면을 꽉 채우기 위한 scale과 translate 계산
  const getTransformForPanel = (index) => {
    const item = items[index];
    const galleryRect = gallery.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    // 패널이 화면을 꽉 채우려면 얼마나 확대해야 하는지
    const scaleX = window.innerWidth / itemRect.width;
    const scaleY = window.innerHeight / itemRect.height;
    const scale = Math.min(scaleX, scaleY);

    // 갤러리 중심 기준으로 해당 패널을 화면 중앙으로 이동
    const galleryCenterX = galleryRect.left + galleryRect.width / 2;
    const galleryCenterY = galleryRect.top + galleryRect.height / 2;
    const itemCenterX = itemRect.left + itemRect.width / 2;
    const itemCenterY = itemRect.top + itemRect.height / 2;

    // 패널 중심을 화면 중앙으로 이동시키기 위한 offset
    const offsetX = (window.innerWidth / 2 - itemCenterX) * (1 / scale);
    const offsetY = (window.innerHeight / 2 - itemCenterY) * (1 / scale);

    return { scale, offsetX, offsetY };
  };

  // 마스터 타임라인 생성
  const createAnimation = () => {
    // 기존 ScrollTrigger 제거
    ScrollTrigger.getAll().forEach((st) => {
      if (
        st.vars.trigger === galleryWrap ||
        st.vars.trigger === projectSection
      ) {
        st.kill();
      }
    });

    // 갤러리 초기화
    gsap.set(gallery, { scale: 1, x: 0, y: 0 });

    // 첫 번째: 갤러리 확대 애니메이션 (패널 0번으로)
    const transform0 = getTransformForPanel(0);

    ScrollTrigger.create({
      trigger: galleryWrap,
      start: "top top",
      end: "+=100%",
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const t = getTransformForPanel(0);
        gsap.set(gallery, {
          scale: 1 + (t.scale - 1) * progress,
          x: t.offsetX * progress,
          y: t.offsetY * progress,
        });
      },
    });

    // 이후 패널들: 설명 → 다시 갤러리 확대 반복
    details.forEach((detail, i) => {
      // 설명 섹션은 그냥 스크롤
      // 다음 패널 확대 (마지막이 아닌 경우)
      if (i < panelCount - 1) {
        // 다음 갤러리 확대를 위한 핀
        ScrollTrigger.create({
          trigger: detail,
          start: "bottom bottom",
          end: "+=100%",
          pin: galleryWrap,
          pinSpacing: false,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const nextIndex = i + 1;
            const t = getTransformForPanel(nextIndex);

            // 이전 상태에서 다음 상태로 전환
            // progress 0: 원래 크기, progress 1: 다음 패널 확대
            if (progress < 0.5) {
              // 축소 단계
              const shrinkProgress = progress * 2;
              const prevT = getTransformForPanel(i);
              gsap.set(gallery, {
                scale: prevT.scale - (prevT.scale - 1) * shrinkProgress,
                x: prevT.offsetX * (1 - shrinkProgress),
                y: prevT.offsetY * (1 - shrinkProgress),
              });
            } else {
              // 확대 단계
              const growProgress = (progress - 0.5) * 2;
              gsap.set(gallery, {
                scale: 1 + (t.scale - 1) * growProgress,
                x: t.offsetX * growProgress,
                y: t.offsetY * growProgress,
              });
            }
          },
        });
      }
    });
  };

  // 초기 실행
  createAnimation();

  // 리사이즈 대응
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      createAnimation();
    }, 250);
  });
}
