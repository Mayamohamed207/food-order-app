'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import { ArrowRight, Clock, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Hero.module.css';

function Hero() {
  const { t } = useLanguage();

  const scrollToMenu = useCallback(() => {
    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.banner}>

        <div className={styles.left}>
          <span className={styles.tag}>
            {t('Free delivery on first order', 'توصيل مجاني لأول طلب')}
          </span>
          <h1 className={styles.h1}>
            {t("It's not just Food,", 'ليس مجرد طعام،')}
            <br />
            {t("It's an ", 'إنها ')}
            <em className={styles.accent}>
              {t('Experience.', 'تجربة.')}
            </em>
          </h1>
          <p className={styles.sub}>
            {t(
              "Cairo's best kitchens, delivered in under 30 minutes.",
              'أحسن مطاعم القاهرة — لحد بابك خلال ٣٠ دقيقة.'
            )}
          </p>
          <div className={styles.buttons}>
            <button onClick={scrollToMenu} className={styles.cta}>
              {t('Order now', 'اطلب دلوقتي')}
              <ArrowRight size={15} />
            </button>
            <button onClick={scrollToMenu} className={styles.ghost}>
              {t('Browse menu', 'تصفح القائمة')}
            </button>
          </div>
        </div>

        <div className={styles.right}>
          <Image 
            src="/assets/images/hero.jpg" 
            alt="Delicious Food" 
            fill 
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.heroImg}
            priority
          />
          <div className={styles.badgeA}>
            <Star size={13} fill="currentColor" />
            {t('4.8 · 2,400+ orders', '٤.٨ · أكثر من ٢٤٠٠ طلب')}
          </div>
          <div className={styles.badgeB}>
            <Clock size={13} />
            {t('Avg. 25 min delivery', 'متوسط التوصيل ٢٥ دقيقة')}
          </div>
        </div>

      </div>
    </section>
  );
}
export default Hero;