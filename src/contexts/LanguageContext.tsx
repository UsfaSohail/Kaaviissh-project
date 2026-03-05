import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "ur";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.home": { en: "Home", ur: "ہوم" },
  "nav.drives": { en: "Drives", ur: "مہمات" },
  "nav.zakat": { en: "Zakat Calculator", ur: "زکوٰۃ کیلکولیٹر" },
  "nav.apply": { en: "Apply for Help", ur: "مدد کے لیے درخواست" },
  "nav.blog": { en: "Blog", ur: "بلاگ" },
  "nav.courses": { en: "Courses", ur: "کورسز" },
  "nav.donate": { en: "Donate Now", ur: "ابھی عطیہ دیں" },
  "nav.login": { en: "Login", ur: "لاگ ان" },

  // Hero
  "hero.tagline": { en: "میری ہر کاوش میرے رب کے نام", ur: "میری ہر کاوش میرے رب کے نام" },
  "hero.subtitle": { en: "Serving humanity with compassion, dignity, and faith.", ur: "انسانیت کی خدمت — ہمدردی، عزت اور ایمان کے ساتھ۔" },
  "hero.donate": { en: "Donate Now", ur: "ابھی عطیہ دیں" },
  "hero.apply": { en: "Apply for Help", ur: "مدد کے لیے درخواست" },

  // Hadith
  "hadith.text": { en: '"The believer\'s shade on the Day of Resurrection will be his charity."', ur: '"قیامت کے دن مومن کا سایہ اس کا صدقہ ہوگا۔"' },
  "hadith.source": { en: "— Prophet Muhammad (ﷺ)", ur: "— نبی کریم (ﷺ)" },

  // Mission
  "mission.title": { en: "Our Mission", ur: "ہمارا مشن" },
  "mission.text": { en: "KAAVIISSH is dedicated to uplifting underprivileged communities across Pakistan through ration drives, financial assistance, and sustained welfare programs. We bridge the gap between those who can give and those in dire need, ensuring every contribution reaches the right hands.", ur: "کاوش پاکستان بھر میں پسماندہ کمیونٹیز کی ترقی کے لیے وقف ہے — راشن ڈرائیوز، مالی امداد، اور مسلسل فلاحی پروگرامز کے ذریعے۔" },
  "vision.title": { en: "Our Vision", ur: "ہمارا وژن" },
  "vision.text": { en: "A Pakistan where no family goes to bed hungry, where every deserving individual has access to basic necessities, and where charity is a way of life guided by Islamic values of empathy and service.", ur: "ایک ایسا پاکستان جہاں کوئی خاندان بھوکا نہ سوئے، جہاں ہر مستحق کو بنیادی ضروریات میسر ہوں۔" },

  // About
  "about.title": { en: "About KAAVIISSH", ur: "کاوش کے بارے میں" },
  "about.text": { en: "Founded with a deep commitment to Islamic philanthropy, KAAVIISSH is a non-profit foundation based in Pakistan. We organize ration drives, provide emergency relief, and support families in overcoming poverty with dignity and respect.", ur: "اسلامی فلاح و بہبود سے گہری وابستگی کے ساتھ قائم کیا گیا، کاوش پاکستان میں قائم ایک غیر منافع بخش فاؤنڈیشن ہے۔" },
  "about.cta": { en: "View Our Drives →", ur: "ہماری مہمات دیکھیں →" },

  // Drives
  "drives.title": { en: "Drives & Cases", ur: "مہمات اور کیسز" },
  "drives.subtitle": { en: "Support ongoing missions or contribute to a specific cause.", ur: "جاری مہمات کی حمایت کریں یا کسی مخصوص مقصد میں حصہ ڈالیں۔" },
  "drives.all": { en: "All", ur: "سب" },
  "drives.open": { en: "Open", ur: "کھلے" },
  "drives.inprogress": { en: "In Progress", ur: "جاری" },
  "drives.completed": { en: "Completed", ur: "مکمل" },
  "drives.donatenow": { en: "Donate Now", ur: "ابھی عطیہ دیں" },

  // Donate
  "donate.title": { en: "Donate", ur: "عطیہ" },
  "donate.subtitle": { en: "Your generosity can change lives.", ur: "آپ کی سخاوت زندگیاں بدل سکتی ہے۔" },
  "donate.choosetype": { en: "Choose Donation Type", ur: "عطیہ کی قسم منتخب کریں" },
  "donate.amount": { en: "Enter Amount (PKR)", ur: "رقم درج کریں (PKR)" },
  "donate.method": { en: "Choose Payment Method", ur: "ادائیگی کا طریقہ منتخب کریں" },
  "donate.instructions": { en: "Payment Instructions", ur: "ادائیگی کی ہدایات" },
  "donate.upload": { en: "Upload Payment Screenshot", ur: "ادائیگی کا اسکرین شاٹ اپ لوڈ کریں" },
  "donate.submit": { en: "Submit Donation", ur: "عطیہ جمع کرائیں" },
  "donate.next": { en: "Next", ur: "اگلا" },
  "donate.back": { en: "Back", ur: "واپس" },
  "donate.thanks": { en: "JazakAllah Khair!", ur: "جزاک اللہ خیر!" },
  "donate.thanksMsg": { en: '"May your charity bring ease to those in need."', ur: '"آپ کا صدقہ ضرورت مندوں کے لیے آسانی لائے۔"' },

  // Zakat
  "zakat.title": { en: "Zakat Calculator", ur: "زکوٰۃ کیلکولیٹر" },
  "zakat.subtitle": { en: "Calculate your Zakat obligation with live gold & silver rates.", ur: "سونے اور چاندی کی تازہ قیمتوں کے ساتھ اپنی زکوٰۃ کا حساب لگائیں۔" },
  "zakat.assets": { en: "Assets", ur: "اثاثے" },
  "zakat.liabilities": { en: "Liabilities", ur: "واجبات" },
  "zakat.goldsilver": { en: "Gold & Silver", ur: "سونا اور چاندی" },
  "zakat.networth": { en: "Total Net Worth", ur: "کل مالیت" },
  "zakat.payable": { en: "Zakat Payable (2.5%)", ur: "زکوٰۃ واجب (2.5%)" },
  "zakat.above": { en: "✅ You are above the Nisab threshold. Zakat is obligatory.", ur: "✅ آپ نصاب سے اوپر ہیں۔ زکوٰۃ فرض ہے۔" },
  "zakat.below": { en: "You are below the Nisab threshold. Zakat is not obligatory.", ur: "آپ نصاب سے نیچے ہیں۔ زکوٰۃ فرض نہیں۔" },
  "zakat.donatezakat": { en: "Donate Your Zakat", ur: "اپنی زکوٰۃ ادا کریں" },

  // Blog
  "blog.title": { en: "Blog", ur: "بلاگ" },
  "blog.subtitle": { en: "Stories, updates, and reflections from our journey.", ur: "ہمارے سفر کی کہانیاں، اپ ڈیٹس اور عکاسی۔" },
  "blog.readmore": { en: "Read More →", ur: "مزید پڑھیں →" },

  // Apply
  "apply.title": { en: "Apply for Help", ur: "مدد کے لیے درخواست" },
  "apply.subtitle": { en: "If you or your family need assistance, please fill out this form. Login is required.", ur: "اگر آپ یا آپ کے خاندان کو مدد چاہیے تو یہ فارم پُر کریں۔ لاگ ان ضروری ہے۔" },
  "apply.submit": { en: "Submit Application", ur: "درخواست جمع کرائیں" },
  "apply.submitted": { en: "Application Submitted", ur: "درخواست جمع ہو گئی" },
  "apply.submittedMsg": { en: "Your application has been received. Our team will review it and get back to you shortly, InshAllah.", ur: "آپ کی درخواست موصول ہو گئی ہے۔ ہماری ٹیم جلد آپ سے رابطہ کرے گی، انشاء اللہ۔" },

  // Courses
  "courses.title": { en: "Courses", ur: "کورسز" },
  "courses.subtitle": { en: "Educational resources coming soon.", ur: "تعلیمی وسائل جلد آ رہے ہیں۔" },
  "courses.coming": { en: "Courses will be available here soon. Stay tuned!", ur: "کورسز جلد یہاں دستیاب ہوں گے۔ جُڑے رہیں!" },

  // Login
  "login.title": { en: "Login", ur: "لاگ ان" },
  "login.subtitle": { en: "Sign in to your account", ur: "اپنے اکاؤنٹ میں سائن ان کریں" },
  "login.email": { en: "Email Address", ur: "ای میل" },
  "login.password": { en: "Password", ur: "پاس ورڈ" },
  "login.signin": { en: "Sign In", ur: "سائن ان" },
  "login.signup": { en: "Sign Up", ur: "سائن اپ" },
  "login.noaccount": { en: "Don't have an account?", ur: "اکاؤنٹ نہیں ہے؟" },
  "login.hasaccount": { en: "Already have an account?", ur: "پہلے سے اکاؤنٹ ہے؟" },
  "login.name": { en: "Full Name", ur: "پورا نام" },
  "login.createaccount": { en: "Create Account", ur: "اکاؤنٹ بنائیں" },

  // Footer
  "footer.tagline": { en: "A non-profit foundation serving humanity through compassion, dignity, and faith.", ur: "ایک غیر منافع بخش فاؤنڈیشن — ہمدردی، عزت اور ایمان کے ساتھ انسانیت کی خدمت۔" },
  "footer.quicklinks": { en: "Quick Links", ur: "فوری لنکس" },
  "footer.contact": { en: "Contact", ur: "رابطہ" },
  "footer.legal": { en: "Legal", ur: "قانونی" },
  "footer.privacy": { en: "Privacy Policy", ur: "رازداری کی پالیسی" },
  "footer.terms": { en: "Terms of Service", ur: "شرائط و ضوابط" },
  "footer.rights": { en: "© 2024 KAAVIISSH Foundation. All rights reserved.", ur: "© 2024 کاوش فاؤنڈیشن۔ جملہ حقوق محفوظ ہیں۔" },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  const dir = lang === "ur" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      <div dir={dir}>{children}</div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
