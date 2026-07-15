import { useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../../components/feature/PageLayout";

type Mode = "login" | "register";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <PageLayout>
      <section className="min-h-[80vh] w-full bg-white flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-md">
          {/* Toggle tabs */}
          <div className="flex rounded-xl border border-[#ede9e1] overflow-hidden mb-8" dir="rtl">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setSubmitted(false); }}
                className={`flex-1 py-3 text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                  mode === m
                    ? "bg-[#1a1a1a] text-white"
                    : "text-[#888] hover:text-[#1a1a1a] bg-white"
                }`}
              >
                {m === "login" ? "התחברות" : "הרשמה"}
              </button>
            ))}
          </div>

          <div className="text-right mb-8">
            <h1 className="font-serif text-3xl font-light text-[#1a1410] mb-1">
              {mode === "login" ? "ברוכים השבים" : "הצטרפו אלינו"}
            </h1>
            <p className="text-sm text-[#9a8a7a]">
              {mode === "login"
                ? "התחברו לחשבון הקיים שלכם"
                : "צרו חשבון חדש — זה מהיר ופשוט"}
            </p>
          </div>

          {submitted ? (
            <div className="bg-[#f0faf4] border border-[#a8d8b8] rounded-2xl p-6 text-right">
              <i className="ri-checkbox-circle-line text-3xl text-[#2d7a3a] mb-2 block"></i>
              <p className="text-sm font-medium text-[#2d7a3a]">
                {mode === "login" ? "התחברת בהצלחה!" : "נרשמת בהצלחה! ברוך הבא."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
              {mode === "register" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">שם מלא</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="ישראל ישראלי"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-right text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">טלפון</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="050-000-0000"
                      dir="ltr"
                      className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-left text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">כתובת אימייל</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  dir="ltr"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-left text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">סיסמה</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="לפחות 8 תווים"
                  dir="ltr"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-left text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors"
                />
              </div>

              {mode === "login" && (
                <div className="text-right">
                  <a href="#" className="text-xs text-[#3ab4f2] hover:underline">שכחתי סיסמה</a>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 bg-[#1a1a1a] hover:bg-[#333] text-white text-sm font-semibold tracking-widest py-4 rounded-xl transition-colors duration-300 cursor-pointer"
              >
                {mode === "login" ? "התחברות" : "יצירת חשבון"}
              </button>

              <div className="relative flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-[#ede9e1]" />
                <span className="text-xs text-[#bbb]">או</span>
                <div className="flex-1 h-px bg-[#ede9e1]" />
              </div>

              <p className="text-right text-xs text-[#9a8a7a]">
                {mode === "login" ? "אין לכם חשבון? " : "יש לכם חשבון? "}
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="text-[#1a1a1a] font-semibold hover:underline cursor-pointer"
                >
                  {mode === "login" ? "הרשמה בחינם" : "התחברות"}
                </button>
              </p>
            </form>
          )}

          <div className="mt-8 text-right">
            <Link to="/contact" className="text-xs text-[#bbb] hover:text-[#1a1a1a] transition-colors">
              צריכים עזרה? צרו קשר
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
