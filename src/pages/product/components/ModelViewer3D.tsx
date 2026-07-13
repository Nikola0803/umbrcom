import { useEffect, useRef, useState } from "react";

interface ModelViewer3DProps {
  productName: string;
  productSku: string;
}

// Demo GLB model — a publicly available 3D model for demonstration
const DEMO_MODEL_URL = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";
const DEMO_USDZ_URL = "https://modelviewer.dev/shared-assets/models/Astronaut.usdz";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          "ios-src"?: string;
          alt?: string;
          ar?: boolean;
          "ar-modes"?: string;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          "shadow-intensity"?: string;
          exposure?: string;
          style?: React.CSSProperties;
          loading?: string;
          reveal?: string;
        },
        HTMLElement
      >;
    }
  }
}

export default function ModelViewer3D({ productName, productSku }: ModelViewer3DProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const viewerRef = useRef<HTMLElement>(null);

  // AR deep-link — opens model-viewer AR experience on mobile
  const arUrl = `https://modelviewer.dev/editor/?model=${encodeURIComponent(DEMO_MODEL_URL)}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(arUrl)}&color=1a1410&bgcolor=faf8f5&margin=10`;

  useEffect(() => {
    if (document.querySelector('script[data-mv-loader]')) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
    script.setAttribute("data-mv-loader", "true");
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  const toggleRotate = () => {
    const mv = viewerRef.current as any;
    if (!mv) return;
    if (isRotating) {
      mv.removeAttribute("auto-rotate");
    } else {
      mv.setAttribute("auto-rotate", "");
    }
    setIsRotating((r) => !r);
  };

  return (
    <div className="w-full" dir="rtl">
      {/* 3D Viewer */}
      <div className="relative bg-[#f5f2ed] overflow-hidden" style={{ height: 480 }}>
        {!scriptLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#9a8a7a]">טוען מודל תלת-מימדי...</p>
          </div>
        )}

        {scriptLoaded && (
          // @ts-expect-error — model-viewer is a custom element loaded via CDN
          <model-viewer
            ref={viewerRef}
            src={DEMO_MODEL_URL}
            ios-src={DEMO_USDZ_URL}
            alt={`מודל תלת-מימדי של ${productName}`}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            shadow-intensity="0.8"
            exposure="1.1"
            loading="eager"
            reveal="auto"
            style={{ width: "100%", height: "100%", background: "transparent" }}
          />
        )}

        {/* Badge */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 flex items-center gap-2 text-[11px] font-medium text-[#1a1410]">
          <i className="ri-box-3-line text-[#1a1a1a]"></i>
          תצוגה תלת-מימדית
        </div>

        {/* Rotate toggle */}
        <div className="absolute bottom-4 left-4">
          <button
            onClick={toggleRotate}
            className="bg-white/80 backdrop-blur-sm px-3 py-1.5 text-[11px] font-medium text-[#1a1410] flex items-center gap-1.5 hover:bg-white transition-colors cursor-pointer"
          >
            <i className={`${isRotating ? "ri-pause-line" : "ri-play-line"} text-[#1a1a1a]`}></i>
            {isRotating ? "עצור סיבוב" : "הפעל סיבוב"}
          </button>
        </div>
      </div>

      {/* Controls hint bar */}
      <div className="bg-[#faf8f5] border border-[#ede9e1] border-t-0 px-6 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-5 text-[11px] text-[#9a8a7a]">
          <span className="flex items-center gap-1.5">
            <i className="ri-cursor-line text-[#1a1a1a]"></i>
            גרור לסיבוב
          </span>
          <span className="flex items-center gap-1.5">
            <i className="ri-zoom-in-line text-[#1a1a1a]"></i>
            גלגלת לזום
          </span>
          <span className="flex items-center gap-1.5">
            <i className="ri-drag-move-2-line text-[#1a1a1a]"></i>
            שתי אצבעות להזזה
          </span>
        </div>
        <p className="text-[10px] text-[#bbb]">מק״ט: {productSku}</p>
      </div>

      {/* AR Section */}
      <div className="mt-6 border border-[#ede9e1] rounded-2xl bg-white p-6">
        <div className="flex items-start justify-between gap-8 flex-wrap">
          {/* Info */}
          <div className="flex-1 min-w-[220px]">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 flex items-center justify-center bg-[#1a1a1a]/10">
                <i className="ri-camera-3-line text-[#1a1a1a] text-xl"></i>
              </div>
              <h3 className="font-semibold text-sm text-[#1a1410]">מציאות רבודה (AR)</h3>
            </div>
            <p className="text-xs text-[#6a5e52] leading-relaxed mb-4">
              ראו איך הברז ייראה בבית שלכם לפני הרכישה! סרקו את קוד ה-QR עם הסמארטפון כדי לפתוח את חוויית ה-AR ישירות בחלל שלכם.
            </p>

            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-xs text-[#9a8a7a]">
                <i className="ri-apple-line text-[#1a1410]"></i>
                <span>iOS — נפתח ב-Quick Look (Safari)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#9a8a7a]">
                <i className="ri-android-line text-[#4caf50]"></i>
                <span>Android — נפתח ב-Scene Viewer (Chrome)</span>
              </div>
            </div>

            <button
              onClick={() => setQrVisible((v) => !v)}
              className="flex items-center gap-2 bg-[#1a1410] text-white text-xs font-semibold tracking-widest px-5 py-3 rounded-full hover:bg-[#1a1a1a] transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-qr-code-line"></i>
              {qrVisible ? "הסתר QR" : "הצג QR לצפייה ב-AR"}
            </button>
          </div>

          {/* QR Code */}
          {qrVisible && (
            <div className="flex flex-col items-center gap-3">
              <div className="bg-[#faf8f5] p-4 border border-[#ede9e1] rounded-xl">
                <img
                  src={qrApiUrl}
                  alt="QR code לצפייה ב-AR"
                  className="w-[160px] h-[160px]"
                />
              </div>
              <p className="text-[10px] text-[#9a8a7a] text-center max-w-[160px] leading-relaxed">
                סרקו עם מצלמת הטלפון לפתיחת AR
              </p>
              <a
                href={arUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-[10px] text-[#1a1a1a] underline cursor-pointer"
              >
                פתח בדפדפן
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Compatible apps note */}
      <div className="mt-3 flex items-center gap-2 text-[10px] text-[#bbb]">
        <i className="ri-information-line"></i>
        <span>תואם לאפליקציות AR: IKEA Place, Amazon AR, Google Scene Viewer, Apple Quick Look ועוד</span>
      </div>
    </div>
  );
}
