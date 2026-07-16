export interface PageHeaderProps {
  icon?: string;
  eyebrow?: string;
  heading: string;
  subheading?: string;
}

/** The eyebrow + title + underline banner used at the top of almost every
 *  content page (About, Contact, Terms, Business, …) — a Page Builder
 *  layout ("Page Header / Banner") so any page can start with one. */
export default function PageHeader({ icon, eyebrow, heading, subheading }: PageHeaderProps) {
  return (
    <div className="w-full bg-[#0f0f0f] py-20 text-right" dir="rtl">
      <div className="max-w-3xl mx-auto px-8">
        {icon && (
          <div className="flex justify-end mb-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center">
              <i className={`${icon} text-2xl text-[#1a1a1a]`}></i>
            </div>
          </div>
        )}
        {eyebrow && (
          <p className="text-xs font-medium tracking-[0.35em] text-[#3ab4f2] uppercase mb-4">{eyebrow}</p>
        )}
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-white leading-tight">{heading}</h1>
        <div className="mt-5 flex justify-end">
          <span className="block w-16 h-px bg-white/30"></span>
        </div>
        {subheading && (
          <p className="text-white/60 text-base leading-relaxed mt-5 max-w-xl mr-0 ml-auto">{subheading}</p>
        )}
      </div>
    </div>
  );
}
