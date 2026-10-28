/* ==========================================================
   JHONY & MAURA
   CINEMATIC TEST — SCROLL ENGINE
========================================================== */

const hero = document.querySelector(".cinematic-hero");
const stage = document.querySelector(".hero-stage");
const frame = document.querySelector(".stage-frame");
const copy = document.querySelector(".hero-copy");

const glowOne = document.querySelector(".stage-glow-one");
const glowTwo = document.querySelector(".stage-glow-two");

const lightLeft = document.querySelector(".light-left");
const lightRight = document.querySelector(".light-right");

const stateOne = document.querySelector(".hero-state-one");
const stateTwo = document.querySelector(".hero-state-two");
const stateThree = document.querySelector(".hero-state-three");
const transition = document.querySelector(".section-transition");
const transitionLine = document.querySelector(".transition-line");


const jmTransition = document.querySelector(".jm-transition");
const jmMark = document.querySelector(".jm-transition__mark");
const jmSmoke = document.querySelector(".jm-transition__smoke");

if (jmTransition && jmMark) {
    const jmReveal = () => {
        const rect = jmTransition.getBoundingClientRect();
        const viewport = window.innerHeight;

        const progress = Math.min(
            Math.max((viewport - rect.top) / (viewport + rect.height), 0),
            1
        );

        const distance = (progress - 0.5) * 2;

        jmMark.style.transform = `
    translate3d(0, ${70 - distance * 90}px, 0)
    scale(${0.76 + progress * 0.40})
`;

        jmMark.style.opacity = Math.min(
            progress * 2.5,
            (1 - progress) * 2.5
        );
    };

    window.addEventListener("scroll", jmReveal, { passive: true });
    window.addEventListener("resize", jmReveal);
    jmReveal();
}

const jmMarkSecondary = document.querySelector(".jm-transition__mark--secondary");
if (transition && jmMarkSecondary) {
    const jmSecondaryReveal = () => {
        const rect = transition.getBoundingClientRect();
        const viewport = window.innerHeight;

        const progress = Math.min(
            Math.max((viewport - rect.top) / (viewport + rect.height), 0),
            1
        );

        const distance = (progress - 0.5) * 2;

        // Deslocamento vertical e escala independentes do primeiro
        jmMarkSecondary.style.transform = `
            translate3d(-50%, calc(-50% + ${-distance * 50}px), 0)
            scale(${0.9 + progress * 0.15})
        `;

        // Opacidade mantida muito sutil (fundo)
        jmMarkSecondary.style.opacity = Math.min(
            progress * 2,
            (1 - progress) * 2
        ) * 0.12;
    };

    window.addEventListener("scroll", jmSecondaryReveal, { passive: true });
    window.addEventListener("resize", jmSecondaryReveal);
    jmSecondaryReveal();
}

let currentProgress = 0;
let targetProgress = 0;

const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

const lerp = (start, end, amount) =>
    start + (end - start) * amount;


/* ----------------------------------------------------------
   SCROLL PROGRESS
---------------------------------------------------------- */

function updateTargetProgress() {

    const rect = hero.getBoundingClientRect();

    const total =
        hero.offsetHeight - window.innerHeight;

    targetProgress = clamp(
        -rect.top / total,
        0,
        1
    );
}


/* ----------------------------------------------------------
   RENDER
---------------------------------------------------------- */

function render() {

    currentProgress = lerp(
        currentProgress,
        targetProgress,
        0.08
    );

    const p = currentProgress;


    /* ------------------------------------------------------
       STAGE
    ------------------------------------------------------ */

    const stageScale =
        1 + p * 0.16;

    stage.style.transform =
        `scale(${stageScale})`;


    /* ------------------------------------------------------
       FRAME
    ------------------------------------------------------ */

    const frameX =
        p * 18;

    const frameY =
        p * -8;

    const frameRotate =
        -7 + p * 15;

    const frameScale =
        1 - p * 0.28;

    const frameOpacity =
        1 - p * 0.75;

    frame.style.transform =
        `translate(-50%, -50%)
         translate(${frameX}vw, ${frameY}vh)
         rotate(${frameRotate}deg)
         scale(${frameScale})`;

    frame.style.opacity =
        frameOpacity;


    /* ------------------------------------------------------
       LIGHTS
    ------------------------------------------------------ */

    lightLeft.style.transform =
        `rotate(${20 - p * 55}deg)
         translateX(${p * 20}vw)`;

    lightRight.style.transform =
        `rotate(${-20 + p * 45}deg)
         translateX(${-p * 20}vw)`;


    /* ------------------------------------------------------
       GLOWS
    ------------------------------------------------------ */

    glowOne.style.transform =
        `translate(${p * -20}vw, ${p * 15}vh)
         scale(${1 + p * 0.5})`;

    glowTwo.style.transform =
        `translate(${p * 15}vw, ${p * -20}vh)
         scale(${1 + p * 0.8})`;


    /* ------------------------------------------------------
       HERO COPY
    ------------------------------------------------------ */

    const copyY =
        p * -18;

    const copyOpacity =
        1 - Math.max(0, (p - 0.15) / 0.3);

    copy.style.transform =
        `translateY(${copyY}vh)`;

    copy.style.opacity =
        copyOpacity;


    /* ------------------------------------------------------
       NARRATIVE STATES
    ------------------------------------------------------ */

    const stateOneOpacity =
        1 - clamp(p * 5, 0, 1);

    const stateTwoOpacity =
        clamp((p - 0.2) * 5, 0, 1)
        *
        (1 - clamp((p - 0.58) * 4, 0, 1));

    const stateThreeOpacity =
        clamp((p - 0.58) * 4, 0, 1);


    stateOne.style.opacity =
        stateOneOpacity;

    stateTwo.style.opacity =
        stateTwoOpacity;

    stateThree.style.opacity =
        stateThreeOpacity;


    requestAnimationFrame(render);

    if (transition && transitionLine) {
        const rect = transition.getBoundingClientRect();
        const viewport = window.innerHeight;

        const progress = clamp(
            1 - (rect.top + rect.height) / (viewport + rect.height),
            0,
            1
        );

        const eased = progress * progress * (3 - 2 * progress);

        transitionLine.style.transform = `
        translate(-50%, -50%)
        translateX(${(eased - 0.5) * 180}px)
        scaleX(${0.35 + eased * 1.2})
        rotate(${(eased - 0.5) * 8}deg)
    `;

        transitionLine.style.opacity =
            Math.sin(eased * Math.PI) * 0.8;
    }
}


/* ----------------------------------------------------------
   EVENTS
---------------------------------------------------------- */

window.addEventListener(
    "scroll",
    updateTargetProgress,
    { passive: true }
);

window.addEventListener(
    "resize",
    updateTargetProgress
);


/* ----------------------------------------------------------
   INIT
---------------------------------------------------------- */

updateTargetProgress();
render();


/* ==========================================================
   EXPERIENCE SHOWCASE
========================================================== */

const experienceGallery =
    document.querySelector(".experience-gallery");

if (experienceGallery) {

    const slides = [
        document.querySelector(".slide-prev"),
        document.querySelector(".slide-active"),
        document.querySelector(".slide-next")
    ];

    const images = [
        "assets/shows/fot1.png",
        "assets/shows/foto2.png",
        "assets/shows/foto3.png"
    ];

    const indicators = [
        ...document.querySelectorAll(".experience-indicator")
    ];

    const prevButton =
        document.querySelector(".experience-arrow-prev");

    const nextButton =
        document.querySelector(".experience-arrow-next");

    let currentIndex = 0;
    let autoplayTimer = null;


    /* ------------------------------------------------------
       IMAGE
    ------------------------------------------------------ */

    function getImage(index) {
        return images[
            (index + images.length) % images.length
        ];
    }


    /* ------------------------------------------------------
       UPDATE
    ------------------------------------------------------ */

    function updateGallery() {

        const previousIndex =
            (currentIndex - 1 + images.length) % images.length;

        const nextIndex =
            (currentIndex + 1) % images.length;


        slides[0].querySelector("img").src =
            getImage(previousIndex);

        slides[1].querySelector("img").src =
            getImage(currentIndex);

        slides[2].querySelector("img").src =
            getImage(nextIndex);


        indicators.forEach((indicator, index) => {

            indicator.classList.toggle(
                "is-active",
                index === currentIndex
            );

        });
    }


    /* ------------------------------------------------------
       NEXT
    ------------------------------------------------------ */

    function nextSlide() {

        currentIndex =
            (currentIndex + 1) % images.length;

        updateGallery();
    }


    /* ------------------------------------------------------
       PREVIOUS
    ------------------------------------------------------ */

    function previousSlide() {

        currentIndex =
            (currentIndex - 1 + images.length)
            % images.length;

        updateGallery();
    }


    /* ------------------------------------------------------
       AUTOPLAY
    ------------------------------------------------------ */

    function startAutoplay() {

        clearInterval(autoplayTimer);

        autoplayTimer = setInterval(
            nextSlide,
            4500
        );
    }


    function stopAutoplay() {

        clearInterval(autoplayTimer);

        autoplayTimer = null;
    }


    /* ------------------------------------------------------
       BUTTONS
    ------------------------------------------------------ */

    nextButton?.addEventListener(
        "click",
        () => {
            nextSlide();
            startAutoplay();
        }
    );


    prevButton?.addEventListener(
        "click",
        () => {
            previousSlide();
            startAutoplay();
        }
    );

    /* ------------------------------------------------------
       INIT
    ------------------------------------------------------ */

    updateGallery();
    startAutoplay();
}

/* ==========================================================
   CINEMATIC BREATH
========================================================== */

const cinematicBreath = document.querySelector(".cinematic-breath");

if (cinematicBreath) {

    const frameBack = cinematicBreath.querySelector(".breath-frame-back");
    const frameCenter = cinematicBreath.querySelector(".breath-frame-center");
    const frameFront = cinematicBreath.querySelector(".breath-frame-front");

    const glowLeft = cinematicBreath.querySelector(".breath-glow-left");
    const glowRight = cinematicBreath.querySelector(".breath-glow-right");

    let breathProgress = 0;
    let breathTarget = 0;

    const clamp = (value, min, max) =>
        Math.min(Math.max(value, min), max);

    function updateBreath() {

        const rect = cinematicBreath.getBoundingClientRect();

        const viewport = window.innerHeight;

        breathTarget = clamp(
            (viewport - rect.top) / (viewport + rect.height),
            0,
            1
        );
    }

    function renderBreath() {

        breathProgress +=
            (breathTarget - breathProgress) * 0.08;

        const p = breathProgress;

        frameBack.style.transform = `
            translate3d(
                calc(-52% + ${p * 80 - 40}px),
                calc(-50% + ${p * 20 - 10}px),
                0
            )
            rotate(${-6 + p * 5}deg)
            scale(${0.82 + p * 0.10})
        `;

        frameCenter.style.transform = `
            translate3d(
                calc(-50% + ${p * 30 - 15}px),
                calc(-50% + ${p * -12 + 6}px),
                0
            )
            rotate(${2 - p * 4}deg)
            scale(${0.94 + p * 0.04})
        `;

        frameFront.style.transform = `
            translate3d(
                calc(-48% + ${p * -90 + 45}px),
                calc(-50% + ${p * 18 - 9}px),
                0
            )
            rotate(${5 - p * 8}deg)
            scale(${0.86 + p * 0.12})
        `;

        glowLeft.style.transform = `
            translate3d(${p * 100 - 50}px, -50%, 0)
        `;

        glowRight.style.transform = `
            translate3d(${p * -120 + 60}px, -50%, 0)
        `;

        requestAnimationFrame(renderBreath);
    }

    window.addEventListener("scroll", updateBreath, {
        passive: true
    });

    updateBreath();
    renderBreath();
}