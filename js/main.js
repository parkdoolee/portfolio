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

  // 모든 줄 요소 수집 (기존 유지)
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


  // 텍스트 나타남 애니메이션 (기존 유지)
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

  // 텍스트 영역: 패럴랙스 (빠르게 위로) (기존 유지)
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

  // 이미지 영역: 스크롤 패럴랙스 (밑점 95px 위치에서 시작) (기존 유지)
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
      transformOrigin: "center bottom",
      duration: 2.5, // 길게 설정해서 끝까지 천천히 확대
      ease: "none",
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


// MULTI TITLE ANIMATION (커리어 섹션과 동일한 효과)
if (typeof SplitText !== 'undefined') {
  const multiTitle = document.querySelector(".multi_title");
  
  if (multiTitle) {
    // 타이틀 텍스트 분리
    const splitTitle = new SplitText(multiTitle, { 
      type: "chars,words,lines", 
      linesClass: "clip_text" 
    });
    
    // 초기 상태: 모든 글자 숨김
    gsap.set(splitTitle.chars, { autoAlpha: 0 });
    gsap.set(multiTitle, { opacity: 1 }); // 👈 타이틀 자체는 보이게
    
    // 👉 타이틀 자체를 트리거로 사용
    ScrollTrigger.create({
      trigger: multiTitle, // 👈 .multiDesigner가 아닌 타이틀 자체
      start: "top 80%", // 👈 타이틀이 화면 하단 80% 지점에 도달할 때
      once: true,
      onEnter: () => {
        // 랜덤하게 글자 나타남
        gsap.fromTo(
          splitTitle.chars,
          { autoAlpha: 0, yPercent: 150 },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.8,
            ease: "power2",
            stagger: {
              each: 0.02,
              from: "random"
            }
          }
        );
      }
    });
  }
}

// ============================================
// PROJECT 섹션: 갤러리 확대 → 상세 페이지 전환 → 스크롤 → 축소 복귀
// ============================================
const projectSection = document.querySelector(".project");
if (projectSection) {
  const galleryWrap = document.querySelector(".gallery-wrap");
  const gallery = document.querySelector(".gallery");
  const items = document.querySelectorAll(".gallery__item");
  const details = document.querySelectorAll(".project-detail");
  const panelCount = items.length;

  let panelData = [];

  const calculatePanelData = () => {
    gsap.set(gallery, { scale: 1, x: 0, y: 0, clearProps: "transformOrigin" });

    const galleryRect = gallery.getBoundingClientRect();
    panelData = [];

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const scaleX = vw / rect.width;
      const scaleY = vh / rect.height;
      const scale = Math.max(scaleX, scaleY);

      const itemCenterX = rect.left + rect.width / 2 - galleryRect.left;
      const itemCenterY = rect.top + rect.height / 2 - galleryRect.top;
      const originX = (itemCenterX / galleryRect.width) * 100;
      const originY = (itemCenterY / galleryRect.height) * 100;

      panelData.push({ scale, originX, originY });
    });
  };

  const createAnimation = () => {
    // PROJECT 섹션 ScrollTrigger만 제거
    ScrollTrigger.getAll().forEach((st) => {
      const trigger = st.vars?.trigger;
      if (
        trigger === projectSection ||
        trigger === galleryWrap ||
        trigger === ".project"
      ) {
        st.kill();
      }
    });

    // 초기 상태
    gsap.set(gallery, { scale: 1, x: 0, y: 0, opacity: 1 });
    details.forEach((detail) => {
      gsap.set(detail, {
        opacity: 0,
        visibility: "hidden",
        y: 0,
      });
    });

    const masterTl = gsap.timeline({ defaults: { ease: "none" } });

    panelData.forEach((panel, i) => {
      const detail = details[i];
      const originStr = `${panel.originX}% ${panel.originY}%`;

      // ===== 1단계: 확대 40% =====
      masterTl.to(gallery, {
        scale: 1 + (panel.scale - 1) * 0.4,
        transformOrigin: originStr,
        duration: 1,
        ease: "power1.out",
      });

      // ===== 2단계: 확대 80% =====
      masterTl.to(gallery, {
        scale: 1 + (panel.scale - 1) * 0.8,
        transformOrigin: originStr,
        duration: 1,
        ease: "power1.inOut",
      });

      // ===== 3단계: 갤러리 페이드아웃 + 상세페이지 페이드인 =====
      masterTl.to(gallery, {
        opacity: 0,
        duration: 0.5,
      });

      masterTl.to(
        detail,
        {
          opacity: 1,
          visibility: "visible",
          duration: 0.5,
        },
        "<"
      );

      // ===== 4단계: 상세페이지 위로 스크롤 =====
      masterTl.to(detail, {
        y: -window.innerHeight,
        duration: 2,
        ease: "none",
      });

      // ===== 5단계: 복귀 (모든 패널에서 복귀) =====
      masterTl.to(detail, {
        opacity: 0,
        duration: 0.5,
      });

      masterTl.set(detail, {
        visibility: "hidden",
        y: 0,
      });

      masterTl.set(gallery, {
        scale: 1,
        x: 0,
        y: 0,
        transformOrigin: "50% 50%",
      });

      masterTl.to(gallery, {
        opacity: 1,
        duration: 0.5,
      });

      // 마지막 패널 이후 갤러리가 잠시 보이도록
      if (i === panelCount - 1) {
        masterTl.to({}, { duration: 1 });
      }
    });

    const totalDuration = masterTl.duration();
    const totalScroll = totalDuration * 400;

    gsap.set(projectSection, {
      height: totalScroll + window.innerHeight,
    });

    ScrollTrigger.create({
      trigger: projectSection,
      start: "top top",
      end: `+=${totalScroll}`,
      pin: galleryWrap,
      pinSpacing: false,
      scrub: 1.5,
      animation: masterTl,
    });

    ScrollTrigger.refresh();
  };

  const init = () => {
    calculatePanelData();
    createAnimation();
  };

  setTimeout(init, 100);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      gsap.set(gallery, { clearProps: "all" });
      details.forEach((d) => gsap.set(d, { clearProps: "all" }));
      init();
    }, 250);
  });
}


// ============================================
// CAREER 섹션 (swipe-slider 방식)
// ============================================
const careerSection = document.querySelector(".career");
if (careerSection) {
  const panels = document.querySelectorAll(".careerPage");
  const panelWrap = document.querySelector(".career_panels");
  const panelSubtitles = document.querySelectorAll(".page_subtitle");
  const numPanels = panels.length;
  const panelHeight = window.innerHeight;

  // SplitText로 서브타이틀만 분리
  let splitSubtitles = [];
  
  if (typeof SplitText !== 'undefined') {
    splitSubtitles = Array.from(panelSubtitles).map(subtitle => 
      new SplitText(subtitle, { type: "chars,words,lines", linesClass: "clip_text" })
    );
  }

  // 이미지 슬라이더
  panels.forEach((panel, i) => {
    const slider = panel.querySelector('.career_slider');
    const sliderImages = slider ? slider.querySelectorAll('img') : [];

    if (sliderImages.length > 0) {
      const imageTl = gsap.timeline({ repeat: -1 });
      
      sliderImages.forEach((img, imgIndex) => {
        imageTl
          .to(img, { opacity: 1, duration: 0 }, imgIndex * 1)
          .to(img, { opacity: 0, duration: 0 }, (imgIndex + 1) * 1 - 0.01);
      });
      
      imageTl.play();
    }
  });

  // 패널 전환 애니메이션
  let currentIndex = -1;
  let animating = false;
  let sectionPinned = false;

  function gotoPanel(index, direction) {
    if (index < 0 || index >= numPanels || animating) return;
    
    animating = true;
    const fromTop = direction === -1;
    const dFactor = fromTop ? -1 : 1;
    
    const tl = gsap.timeline({
      defaults: { duration: 1, ease: "power1.inOut" },
      onComplete: () => {
        animating = false;
        
        if (splitSubtitles[index]) {
          gsap.delayedCall(0.2, () => {
            const chars = splitSubtitles[index].chars;
            
            gsap.set(panelSubtitles[index], { autoAlpha: 1 });
            gsap.fromTo(
              chars,
              { autoAlpha: 0, yPercent: 150 * dFactor },
              {
                autoAlpha: 1,
                yPercent: 0,
                duration: 0.8,
                ease: "power2",
                stagger: {
                  each: 0.02,
                  from: "random"
                }
              }
            );
          });
        }
      }
    });

    tl.to(
      panelWrap,
      {
        y: -panelHeight * index,
        duration: 1,
        ease: "power1.inOut"
      },
      0
    );

    currentIndex = index;
  }

  // 👉 커리어 섹션 pin 설정 (end 값 수정)
  ScrollTrigger.create({
    trigger: careerSection,
    start: "top top",
    end: `+=${(numPanels - 1) * panelHeight}`, // 👈 numPanels → (numPanels - 1)
    pin: true,
    onEnter: () => {
      sectionPinned = true;
      if (currentIndex === -1) {
        gotoPanel(0, 1);
      }
    },
    onLeave: () => {
      sectionPinned = false;
    },
    onEnterBack: () => {
      sectionPinned = true;
    },
    onLeaveBack: () => {
      sectionPinned = false;
    }
  });

  // 스크롤 이벤트
  let scrollTimeout;
  let isScrolling = false;
  
  careerSection.addEventListener('wheel', (e) => {
    if (!sectionPinned || animating || isScrolling) return;
    
    isScrolling = true;
    clearTimeout(scrollTimeout);
    
    if (e.deltaY > 0) {
      // 아래로 스크롤
      if (currentIndex < numPanels - 1) {
        e.preventDefault(); // 👈 마지막 패널 아니면 기본 스크롤 방지
        gotoPanel(currentIndex + 1, 1);
      }
      // 👉 마지막 패널이면 e.preventDefault() 안 함 → 자연스럽게 다음 섹션으로
    } else {
      // 위로 스크롤
      if (currentIndex > 0) {
        e.preventDefault();
        gotoPanel(currentIndex - 1, -1);
      }
    }
    
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 1000);
  }, { passive: false });

  // 리사이즈
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
}

