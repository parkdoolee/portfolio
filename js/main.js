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
// PROJECT 섹션: 그리드 전체 확대 → 상세 페이지 확장 → 축소 복귀 (데모 완벽 구현)
// ============================================
const projectSection = document.querySelector(".project");
if (projectSection) {
  // HTML 구조: .gallery-wrap (Pin 대상) 안에 .gallery
  const galleryWrap = document.querySelector(".gallery-wrap");
  const gallery = document.querySelector(".gallery");
  const items = document.querySelectorAll(".gallery__item");
  const details = document.querySelectorAll(".project-detail");
  const panelCount = items.length;

  let panelTransforms = [];

  // 각 패널이 화면을 꽉 채우기 위한 scale과 translate 계산 함수
  const getTransformForPanel = (index) => {
    // 계산 전에 갤러리 상태를 일시적으로 리셋하여 정확한 값을 측정합니다.
    const resetTransform = gsap.set(gallery, { scale: 1, x: 0, y: 0 });

    const item = items[index];
    const itemRect = item.getBoundingClientRect();

    const scaleX = window.innerWidth / itemRect.width;
    const scaleY = window.innerHeight / itemRect.height;
    const scale = Math.min(scaleX, scaleY);

    const translateX =
      window.innerWidth / 2 - (itemRect.left + itemRect.width / 2);
    const translateY =
      window.innerHeight / 2 - (itemRect.top + itemRect.height / 2);

    // 계산 후 원래 상태로 복원
    resetTransform.revert();
    return { scale, translateX, translateY };
  };

  // 상세 페이지의 높이 (스크롤되어야 할 길이)를 계산하는 함수
  const getDetailScrollLength = (detailElement) => {
    // 뷰포트 높이(100vh)를 초과하는 상세 페이지의 높이를 가져옵니다.
    // 핀 해제 후 다음 내용이 스크롤되도록 뷰포트 높이만큼 추가합니다.
    const detailHeight = detailElement.offsetHeight;
    return detailHeight > window.innerHeight
      ? detailHeight
      : window.innerHeight;
  };

  const createAnimation = () => {
    // 1. 기존 ScrollTrigger 모두 제거
    ScrollTrigger.getAll().forEach((st) => st.kill());

    // 2. 초기 상태 설정
    gsap.set(gallery, { scale: 1, x: 0, y: 0, transformOrigin: "50% 50%" });
    gsap.set(details, {
      opacity: 0,
      pointerEvents: "none",
      zIndex: 1,
      position: "absolute",
      top: 0,
    });
    gsap.set(".project_title", { opacity: 0 });

    const scrollUnit = 500; // 1 타임라인 시간 단위 = 500px 스크롤 (확대/축소에 사용)
    const detailScrollUnit = 1000; // 상세 페이지 스크롤 구간 길이 (임시)

    let cumulativeScrollLength = 0; // 전체 섹션의 누적 스크롤 길이

    // --- 3. 개별 패널 애니메이션을 위한 마스터 타임라인 구성 ---
    // 마스터 타임라인은 Pin을 직접 연결하지 않고, 스크롤 위치를 기록하는 데 사용됩니다.
    // Pin은 아래 4번에서 별도로 설정합니다.

    // 각 패널의 애니메이션 타임라인을 담을 컨테이너
    const masterTl = gsap.timeline({
      defaults: { ease: "none" },
    });

    panelTransforms.forEach((t, i) => {
      const detailElement = details[i];
      const detailHeight = getDetailScrollLength(detailElement);

      // --- 1. 확대 애니메이션 (3단계 = 3.0 duration) ---
      const tlStart = masterTl.duration();

      // 1-1. 초기(0%) → 30% 확대 (Duration: 1.0)
      masterTl.to(
        gallery,
        {
          scale: 1 + (t.scale - 1) * 0.3,
          x: t.translateX * 0.3,
          y: t.translateY * 0.3,
          duration: 1,
        },
        tlStart
      );

      // 1-2. 30% → 60% 확대 (Duration: 1.0)
      masterTl.to(gallery, {
        scale: 1 + (t.scale - 1) * 0.6,
        x: t.translateX * 0.6,
        y: t.translateY * 0.6,
        duration: 1,
      });

      // 1-3. 60% → 100% 확대 (화면 꽉 참) (Duration: 1.0)
      masterTl.to(gallery, {
        scale: t.scale,
        x: t.translateX,
        y: t.translateY,
        duration: 1,
      });

      // --- 2. 상세 설명 노출 및 스크롤 (Pin 확장) 구간 (Duration: detailHeight/scrollUnit) ---
      const detailDuration = detailHeight / scrollUnit; // 상세 설명에 필요한 타임라인 시간

      // 상세 설명 노출 시작 (100% 확대가 완료되는 시점에 동시 시작)
      masterTl.to(
        detailElement,
        {
          opacity: 1,
          zIndex: 10,
          pointerEvents: "auto",
          duration: 0.1, // 빠르게 노출
        },
        "<0"
      );

      // 상세 설명 스크롤 애니메이션 (실제 갤러리 애니메이션은 멈추고 상세설명만 움직여야 함)
      // 이 구간에서 갤러리는 100% 상태를 유지합니다.
      masterTl.to(detailElement, {
        y: -detailHeight, // 상세 설명을 화면 높이만큼 위로 스크롤
        duration: detailDuration, // 상세 설명 스크롤 시간에 맞춤
      });

      // --- 3. 축소 복귀 및 다음 패널 준비 (Duration: 1.0) ---

      // 3-1. 상세 설명 숨김 및 위치 리셋 (Duration: 0.1)
      masterTl.to(detailElement, {
        opacity: 0,
        zIndex: 1,
        pointerEvents: "none",
        y: 0, // 위치 리셋
        duration: 0.1,
      });

      // 3-2. 갤러리 축소 (Duration: 0.9)
      if (i < panelCount - 1) {
        masterTl.to(gallery, {
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.9,
        });
      }
    });

    // 4. [최종 Pin 설정] 전체 스크롤 길이를 타임라인의 총 지속 시간에 맞춰 설정
    const finalDuration = masterTl.duration();
    const endScrollPosition = finalDuration * scrollUnit;

    // 최종 높이 설정
    gsap.set(projectSection, {
      height: endScrollPosition + window.innerHeight,
    });

    // 마스터 타임라인과 Pin 연결
    ScrollTrigger.create({
      trigger: projectSection,
      start: "top top",
      end: `bottom-=${window.innerHeight} top`,
      pin: galleryWrap,
      pinSpacing: false,
      scrub: 1,
      animation: masterTl, // 마스터 타임라인을 이 ScrollTrigger에 연결
    });

    // 5. 최종적으로 ScrollTrigger 갱신
    ScrollTrigger.refresh();
  };

  // 초기 실행 및 리사이즈 대응
  let resizeTimer;
  const init = () => {
    gsap.set(gallery, { transformOrigin: "50% 50%" });

    // 1. 모든 패널의 변환 값을 먼저 계산하고 저장합니다.
    panelTransforms = Array.from(items).map((_, i) => getTransformForPanel(i));

    // 2. 애니메이션 생성
    createAnimation();
  };

  init();

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      gsap.set(gallery, { clearProps: "all" });
      init();
    }, 250);
  });
}
