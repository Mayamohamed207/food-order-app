'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, Utensils } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth }     from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import styles from './login.module.css';

type Mode = 'signin' | 'signup';

export default function LoginPage() {
  const { signIn, signUp, user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [mode, setMode]         = useState<Mode>('signin');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (user) router.replace('/');
  }, [user, router]);

  const handleSubmit = useCallback(async () => {
    if (!email || !password) { toast.error(t('Fill in all fields', 'أكمل جميع الحقول')); return; }
    if (mode === 'signup' && !fullName) { toast.error(t('Enter your name', 'أدخل اسمك')); return; }

    setLoading(true);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
        toast.success(t('Welcome back!', 'مرحباً بعودتك!'));
        router.replace('/');
      } else {
        await signUp(email, password, fullName);
        toast.success(t('Account created! Check your email.', 'تم إنشاء الحساب! تحقق من بريدك.'));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('Something went wrong', 'حدث خطأ'));
    } finally {
      setLoading(false);
    }
  }, [email, password, fullName, mode, signIn, signUp, router, t]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSubmit(); },
    [handleSubmit]
  );

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <span className={styles.logoIcon}><Utensils size={20} /></span>
          <span className={styles.logoText}>FoodApp</span>
        </div>

        <h1 className={styles.heading}>
          {mode === 'signin'
            ? t('Sign in to your account', 'تسجيل الدخول')
            : t('Create an account', 'إنشاء حساب')}
        </h1>
        <p className={styles.sub}>
          {mode === 'signin'
            ? t("Don't have an account? ", 'ليس لديك حساب؟ ')
            : t('Already have an account? ', 'لديك حساب بالفعل؟ ')}
          <button
            className={styles.switchLink}
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          >
            {mode === 'signin' ? t('Sign up', 'إنشاء حساب') : t('Sign in', 'تسجيل الدخول')}
          </button>
        </p>

        <div className={styles.form} onKeyDown={handleKeyDown}>
          {mode === 'signup' && (
            <div className={styles.field}>
              <label className={styles.label}>{t('Full name', 'الاسم الكامل')}</label>
              <div className={styles.inputWrap}>
                <User size={16} className={styles.icon} />
                <input
                  className={styles.input}
                  type="text"
                  placeholder={t('Your name', 'اسمك')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>{t('Email', 'البريد الإلكتروني')}</label>
            <div className={styles.inputWrap}>
              <Mail size={16} className={styles.icon} />
              <input
                className={styles.input}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t('Password', 'كلمة المرور')}</label>
            <div className={styles.inputWrap}>
              <Lock size={16} className={styles.icon} />
              <input
                className={styles.input}
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPw((p) => !p)}
                aria-label="toggle password visibility"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? t('Please wait…', 'جاري التحميل…')
              : mode === 'signin'
              ? t('Sign in', 'تسجيل الدخول')
              : t('Create account', 'إنشاء حساب')}
          </button>
        </div>
      </div>
    </div>
  );
}