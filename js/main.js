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

// ROLLING TEXT ANIMATION (multiDesigner)

// SplitText 라이브러리가 필요합니다
if (typeof SplitText !== 'undefined') {
  const rollLines = document.querySelectorAll(".roll_line");

  // 각 라인의 글자 분리
  const splitRolls = Array.from(rollLines).map(line =>
    new SplitText(line, { type: "chars", charsClass: "roll_char" })
  );

  // 3D 설정
  const width = window.innerWidth;
  const depth = -width / 8;
  const transformOrigin = `50% 50% ${depth}px`;

  gsap.set(rollLines, { perspective: 700, transformStyle: "preserve-3d" });

  // 타임라인 애니메이션
  const animTime = 2.2;
  const rollTl = gsap.timeline({ repeat: -1, repeatDelay: -.4 });

  // 각 라인 애니메이션
  splitRolls.forEach((split, index) => {
    rollTl.fromTo(
      split.chars,
      { rotationX: -90 },
      {
        rotationX: 90,
        stagger: 0.08,
        duration: animTime,
        ease: "none",
        transformOrigin
      },
      index * 1
    );
  });
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
// CAREER 섹션: 세로 슬라이드 + 스냅핑 전환
// ============================================
const careerSection = document.querySelector(".career");
if (careerSection) {
  const panels = document.querySelectorAll(".careerPage");
  const panelTitles = document.querySelectorAll(".page_title");
  const panelWrap = document.querySelector(".career_panels");
  const numPanels = panels.length;
  const panelHeight = window.innerHeight;

  // 1. 전체 career 섹션 높이 설정
  // 5개 패널을 순차적으로 보여주기 위해 총 높이를 설정합니다.
  // (패널 수 * 뷰포트 높이)
  // gsap.set(careerSection, {
  //   height: (numPanels - 1) * panelHeight + panelHeight,
  // });

  // 2. 메인 전환 애니메이션 (Vertical Translation)
  const careerTl = gsap.timeline({
    scrollTrigger: {
      trigger: careerSection,
      pin: true,
      scrub: 1,
      start: "top top",
      end: `+=${numPanels * 2 * panelHeight}`, // 각 패널당 2배 길이
      snap: {
        snapTo: 1 / (numPanels * 2 - 1), // 더 세밀한 스냅
        duration: 0.5,
      },
    },
  });

  // 각 패널마다 독립적인 이미지 슬라이더 애니메이션 생성
  panels.forEach((panel, i) => {
    const slider = panel.querySelector('.career_slider');
    const sliderImages = slider ? slider.querySelectorAll('img') : [];

    // 이미지 슬라이더 - 각 패널에서 독립적으로 무한 루핑
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

  // 3. 패널 전환 및 텍스트 애니메이션
  panels.forEach((panel, i) => {
    const title = panelTitles[i];
    const subtitle = panel.querySelector('.page_subtitle');
    const startTime = i * 2; // 각 패널은 2 duration 차지

    // 4. 타이틀 애니메이션 (0.0 ~ 0.8)
    careerTl
      .fromTo(
        title,
        { y: 0, scale: 0.9, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.3,
          ease: "power2.out",
        },
        startTime
      )
      .to(
        title,
        {
          y: -50,
          scale: 0.9,
          opacity: 0,
          filter: "blur(10px)",
          duration: 0.3,
          ease: "power2.in",
        },
        startTime + 0.5
      );

    // 5. 서브타이틀 애니메이션 (0.8 ~ 1.8)
    if (subtitle) {
      careerTl
        .fromTo(
          subtitle,
          { y: 50, scale: 0.9, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.3,
            ease: "power2.out",
          },
          startTime + 0.8
        )
        .to(
          subtitle,
          {
            y: -50,
            scale: 0.9,
            opacity: 0,
            filter: "blur(10px)",
            duration: 0.3,
            ease: "power2.in",
          },
          startTime + 1.5
        );
    }

    // 6. 패널 전환 (1.8 ~ 2.0)
    if (i < numPanels - 1) {
      careerTl.to(
        panelWrap,
        {
          y: -panelHeight * (i + 1),
          duration: 0.5,
          ease: "power2.inOut",
        },
        startTime + 1.8
      );
    }
  });

  // 6. 창 크기 변경 시 ScrollTrigger 및 높이 재계산
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === careerSection) {
          st.kill();
        }
      });
      gsap.set(careerSection, { clearProps: "height" });
      gsap.set(panelWrap, { clearProps: "y" });
      ScrollTrigger.refresh();
    }, 250);
  });
}


// CAREER TEXT ANIMATION
if (typeof SplitText !== 'undefined') {
  const careerTitles = gsap.utils.toArray(".page_title");
  const careerSubtitles = gsap.utils.toArray(".page_subtitle");
  
  // 👇 여기서 linesClass: "clip_text"가 자동으로 HTML에 클래스 추가해줌
  const splitTitles = careerTitles.map(title => 
    new SplitText(title, { type: "chars,words,lines", linesClass: "clip_text" })
  );
  
  const splitSubtitles = careerSubtitles.map(subtitle => 
    new SplitText(subtitle, { type: "chars,words,lines", linesClass: "clip_text" })
  );
  
  // 초기 상태: 모든 글자 숨기기
  careerTitles.forEach(title => gsap.set(title, { autoAlpha: 0 }));
  careerSubtitles.forEach(subtitle => gsap.set(subtitle, { autoAlpha: 0 }));
  
  // 각 careerPage에 ScrollTrigger 적용
  gsap.utils.toArray(".careerPage").forEach((page, index) => {
    const titleChars = splitTitles[index].chars;
    const subtitleChars = splitSubtitles[index].chars;
    
    ScrollTrigger.create({
      trigger: page,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.set(careerTitles[index], { autoAlpha: 1 });
        
        gsap.fromTo(titleChars, 
          { 
            autoAlpha: 0, 
            yPercent: 150 
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1,
            ease: "power2",
            stagger: {
              each: 0.02,
              from: "random"
            }
          }
        );
        
        gsap.set(careerSubtitles[index], { autoAlpha: 1 });
        
        gsap.fromTo(subtitleChars, 
          { 
            autoAlpha: 0, 
            yPercent: 150 
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1,
            ease: "power2",
            stagger: {
              each: 0.02,
              from: "random"
            },
            delay: 0.3
          }
        );
      }
    });
  });
}
