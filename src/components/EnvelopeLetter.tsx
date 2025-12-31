"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import MagicalNightGarden from "./MagicalNightGarden";
import HeartBurst from "./HeartBurst";
import styles from "./EnvelopeLetter.module.css";

type Props = {
  title: string;
  body: string;
  lastPageText: string;
};

export default function EnvelopeLetter({ title, body, lastPageText }: Props) {
  const [opened, setOpened] = useState(false);
  const [page, setPage] = useState<0 | 1 | 2>(0);
  const [burstKey, setBurstKey] = useState(0);
  const dragBoundsRef = useRef<HTMLDivElement>(null);
  const zCounter = useRef(20);
  const [z1, setZ1] = useState(20);
  const [z2, setZ2] = useState(19);
  const [z3, setZ3] = useState(18);
  const [isSmall, setIsSmall] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);

  const words = useMemo(() => body.split(" "), [body]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 420px)");
    const update = () => setIsSmall(mq.matches);
    update();
    // Safari fallback
    // eslint-disable-next-line deprecation/deprecation
    mq.addEventListener ? mq.addEventListener("change", update) : mq.addListener(update);
    return () => {
      // eslint-disable-next-line deprecation/deprecation
      mq.removeEventListener ? mq.removeEventListener("change", update) : mq.removeListener(update);
    };
  }, []);

  const onOpen = () => {
    if (opened) return;
    setOpened(true);
    setPage(0);
    setBurstKey((k) => k + 1);
  };

  const nextPage = () => {
    if (!opened) return;
    setPage(1);
  };

  const bringToFront = (which: 1 | 2 | 3) => {
    zCounter.current += 1;
    if (which === 1) setZ1(zCounter.current);
    else if (which === 2) setZ2(zCounter.current);
    else setZ3(zCounter.current);
  };

  const goToThirdWithDelay = () => {
    if (!opened) return;
    if (loadingNext) return;
    setLoadingNext(true);
    // Minimum 5 seconds loading as requested.
    window.setTimeout(() => {
      setLoadingNext(false);
      setPage(2);
    }, 5000);
  };

  return (
    <div className={styles.wrap}>
      <div ref={dragBoundsRef} className={styles.dragBounds} />

      {/* heart fireworks burst when opening */}
      {opened && <HeartBurst burstKey={burstKey} />}

      <motion.div
        className={`${styles.envelope} ${opened ? styles.active : ""}`}
        animate={
          opened
            ? { scale: isSmall ? 0.7 : 0.62, y: isSmall ? 165 : 210 }
            : { scale: isSmall ? 0.82 : 0.75, y: isSmall ? 12 : 30 }
        }
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <button
          className={styles.heart}
          onClick={onOpen}
          aria-label="Open Envelope"
        >
          <span className={styles.heartText}>Open</span>
        </button>

        <div className={styles.flap} />
        <div className={styles.folds}>
          <div className={styles.left} />
          <div className={styles.right} />
          <div className={styles.bottom} />
        </div>
      </motion.div>

      {/* Papers are rendered OUTSIDE the envelope (like your index.html) so they can slide out freely */}
      <div className={styles.letters}>
        <AnimatePresence mode="wait">
          {opened && page === 0 && (
            <motion.article
              key="page1"
              className={styles.paper}
              style={{ zIndex: z1 }}
              drag
              dragConstraints={dragBoundsRef}
              dragMomentum={false}
              dragElastic={0.08}
              onPointerDown={() => bringToFront(1)}
              initial={{ y: 170, opacity: 0, rotate: -2, scale: 0.98 }}
              animate={{ y: 40, opacity: 1, rotate: 0, scale: 1 }}
              exit={{ y: -40, opacity: 0, rotate: 1, filter: "blur(6px)" }}
              transition={{
                type: "spring",
                stiffness: 140,
                damping: 16,
                mass: 1,
              }}
              role="group"
            >
              <div className={styles.paperTexture} />
              <div className={styles.paperInner}>
                <div className={styles.paperTopMark}>˚ʚ❤︎ɞ˚</div>

                <div className={styles.twoCol}>
                  <div className={styles.rosesBox}>
                    <MagicalNightGarden active={opened} />
                  </div>

                  <div className={styles.textCol}>
                    <h2 className={`${styles.title} font-serif`}>{title}</h2>

                    <p className={`${styles.body} font-[var(--font-hand)]`}>
                      {words.map((w, i) => (
                        <motion.span
                          key={`${w}-${i}`}
                          initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{
                            delay: 0.35 + i * 0.03,
                            duration: 0.35,
                            ease: "easeOut",
                          }}
                          className="inline-block mr-[0.28em]"
                        >
                          {w}
                        </motion.span>
                      ))}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.pageBtn}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => nextPage()}
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            </motion.article>
          )}

          {opened && page === 1 && (
            <motion.article
              key="page2"
              className={styles.paper}
              style={{ zIndex: z2 }}
              drag
              dragConstraints={dragBoundsRef}
              dragMomentum={false}
              dragElastic={0.08}
              onPointerDown={() => bringToFront(2)}
              initial={{ y: 190, opacity: 0, rotate: 2, scale: 0.98 }}
              animate={{ y: 40, opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 130,
                damping: 16,
                mass: 1.05,
              }}
            >
              <div className={styles.paperTexture} />
              <div className={styles.paperInner}>
                <div className={styles.paperTopMark}>˚ʚ❤︎ɞ˚</div>
                <div className="h-full grid place-items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="w-full grid place-items-center"
                  >
                    <div className={styles.gifBox}>
                      <img
                        className={styles.gifFrame}
                        src="/bubu-dudu-flower-gift.gif"
                        alt="Bubu Dudu flower gift"
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
                  </motion.div>
                </div>

                <div className={styles.pageActions}>
                  <button
                    type="button"
                    className={styles.pageBtn}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => setPage(0)}
                    aria-label="Back to first page"
                    disabled={loadingNext}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className={styles.pageBtn}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={goToThirdWithDelay}
                    aria-label="Next page"
                    disabled={loadingNext}
                  >
                    {loadingNext ? "Loading…" : "Next"}
                  </button>
                </div>
              </div>
            </motion.article>
          )}

          {opened && page === 2 && (
            <motion.article
              key="page3"
              className={styles.paper}
              style={{ zIndex: z3 }}
              drag
              dragConstraints={dragBoundsRef}
              dragMomentum={false}
              dragElastic={0.08}
              onPointerDown={() => bringToFront(3)}
              initial={{ y: 200, opacity: 0, rotate: -1, scale: 0.98 }}
              animate={{ y: 40, opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 130,
                damping: 16,
                mass: 1.05,
              }}
            >
              <div className={styles.paperTexture} />
              <div className={styles.paperInner}>
                <div className={styles.paperTopMark}>˚ʚ❤︎ɞ˚</div>

                <div className={styles.loveWrap}>
                  <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: {},
                      show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
                    }}
                    className={styles.loveStack}
                  >
                    <motion.img
                      src="/kawaii-cute.gif"
                      alt=""
                      aria-hidden="true"
                      draggable={false}
                      className={styles.loveGifTop}
                      variants={{
                        hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
                        show: { opacity: 1, y: 0, filter: "blur(0px)" },
                      }}
                      transition={{ duration: 0.55, ease: "easeOut" }}
                    />
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
                        show: { opacity: 1, y: 0, filter: "blur(0px)" },
                      }}
                      transition={{ duration: 0.55, ease: "easeOut" }}
                      className={styles.loveLine1}
                    >
                      I love you
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
                        show: { opacity: 1, y: 0, filter: "blur(0px)" },
                      }}
                      transition={{ duration: 0.65, ease: "easeOut" }}
                      className={styles.loveLine2}
                    >
                      Clara
                    </motion.div>
                  </motion.div>
                </div>

                <div className={styles.pageActions}>
                  <button
                    type="button"
                    className={styles.pageBtn}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => setPage(1)}
                    aria-label="Back to second page"
                  >
                    Back
                  </button>
                </div>
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


