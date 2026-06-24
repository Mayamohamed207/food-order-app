'use client';

import { useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Hero.module.css';

function Hero() {
  const { t, isRtl } = useLanguage();

  const scrollToMenu = useCallback(() => {
    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const heroImage = isRtl ? '/assets/images/heroArabic.jpg' : '/assets/images/hero.jpg';

  return (
    <section className={styles.section}>
      <div
        className={styles.banner}
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className={styles.overlay} />
        <div className={styles.content}>
          <h1 className={styles.h1}>
            {t("You're live to eat,", 'جعت؟')}
            <br />
            {t('Not eat to live.', 'اطلب دلوقتي.')}
          </h1>
          <p className={styles.sub}>
            {t(
              "Cairo's best kitchens, delivered in under 30 minutes.",
              'أحسن مطاعم القاهرة — لحد بابك خلال ٣٠ دقيقة.'
            )}
          </p>
          <button onClick={scrollToMenu} className={styles.cta}>
            {t('Get Started', 'اطلب الآن')}
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;