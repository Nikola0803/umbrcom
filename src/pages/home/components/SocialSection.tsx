const socialLinks = [
  { icon: "ri-tiktok-line", href: "https://www.tiktok.com/@1umbrcom", label: "TikTok", color: "#000" },
  { icon: "ri-youtube-line", href: "https://www.youtube.com/@umbrcom", label: "YouTube", color: "#FF0000" },
  { icon: "ri-facebook-circle-line", href: "https://www.facebook.com/profile.php?id=61577915652778", label: "Facebook", color: "#1877F2" },
  { icon: "ri-whatsapp-line", href: "#", label: "WhatsApp", color: "#25D366" },
  { icon: "ri-instagram-line", href: "https://www.instagram.com/umbrcomisrael/", label: "Instagram", color: "#C13584" },
  { icon: "ri-telegram-line", href: "#", label: "Telegram", color: "#0088cc" },
];

export default function SocialSection() {
  return (
    <section className="w-full border-t border-b border-[#ede9e1] bg-white py-4">
      <div className="max-w-5xl mx-auto px-8 flex items-center justify-center gap-2">
        <span className="text-[11px] font-medium tracking-[0.25em] text-[#aaa] uppercase ml-5">
          עקבו אחרינו
        </span>
        {socialLinks.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="nofollow noopener noreferrer"
            aria-label={s.label}
            className="group w-8 h-8 flex items-center justify-center rounded-full text-[#bbb] hover:text-[#444] transition-colors cursor-pointer"
          >
            <i className={`${s.icon} text-lg`}></i>
          </a>
        ))}
      </div>
    </section>
  );
}
