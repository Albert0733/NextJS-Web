'use client';
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const { scrollYProgress } = useScroll();

  /**
   * 頁面滾動動畫效果
   * slide1: 0-0.3 漸變消失
   * slide2: 0.3-0.35 漸變出現, 0.35-0.65 保持顯示, 0.65-0.7 漸變消失
   * slide3: 0.65-0.7 漸變出現
   */
  const slide1Opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const slide2Opacity = useTransform(scrollYProgress, [0.3, 0.35, 0.65, 0.7], [0, 1, 1, 0]);
  const slide3Opacity = useTransform(scrollYProgress, [0.65, 0.7], [0, 1]);

  // 監聽滾動位置以更新當前投影片
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(value => {
      if (value < 0.3) setCurrentSlide(1);
      else if (value < 0.65) setCurrentSlide(2);
      else setCurrentSlide(3);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  /** 導航功能：滾動到指定投影片 */
  const scrollToSlide = (slideNumber: number) => {
    window.scrollTo({
      top: window.innerHeight * (slideNumber - 1),
      behavior: 'smooth'
    });
  };

  /** 左側導航組件 */
  const Navigation = () => (
    <div className="w-48 p-8 flex flex-col gap-4 text-white">
      {['Next.js 讀書會', '簡介', '公告'].map((text, index) => {
        const slideNumber = index + 1;
        return (
          <button 
            key={text}
            onClick={() => scrollToSlide(slideNumber)}
            className={`text-left transition-colors ${
              currentSlide === slideNumber 
                ? 'text-white' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {text}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="h-[300vh] bg-black snap-y snap-mandatory overflow-y-auto scroll-smooth">
      {/* 第一張投影片：首頁標題 */}
      <div className="h-screen snap-center">
        <motion.div
          style={{ opacity: slide1Opacity }}
          className="fixed inset-0 bg-black flex flex-col items-center justify-center"
        >
          <div className="flex items-center gap-4">
            <Image
              className="invert"
              src="/next.svg"
              alt="Next.js logo"
              width={180}
              height={38}
              priority
            />
            <span className="text-5xl font-bold text-white">讀書會</span>
          </div>

          {/* 向下滾動提示動畫 */}
          <div className="absolute bottom-8 animate-bounce">
            <Image 
              src="/Down.jpg" 
              alt="Down" 
              width={30} 
              height={30}
              className="opacity-80"
            />
          </div>
        </motion.div>
      </div>

      {/* 第二張投影片：讀書會簡介 */}
      <div className="h-screen snap-center">
        <motion.div
          style={{ opacity: slide2Opacity }}
          className="fixed inset-0 bg-black flex"
        >
          <Navigation />
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-4xl text-white font-bold">尚未創建內容</h1>
          </div>
        </motion.div>
      </div>

      {/* 第三張投影片：活動公告 */}
      <div className="h-screen snap-center">
        <motion.div
          style={{ opacity: slide3Opacity }}
          className="fixed inset-0 bg-black flex"
        >
          <Navigation />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-8">
              <div className="text-white space-y-4">
                <h1 className="text-4xl font-bold text-center">尚未創建內容</h1>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
