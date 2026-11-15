import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "KANJILY : Pembelajaran Kanji Interaktif",
  description: "KANJILY - Aplikasi pembelajaran kanji interaktif berbasis web dengan kuis adaptif, animasi urutan goresan, dan pelacakan progres belajar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("kanji_theme");var s=window.matchMedia("(prefers-color-scheme: dark)").matches;if(t==="dark"||(!t&&s)||(t==="system"&&s)){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}}catch(e){}try{if(typeof MutationObserver!=="undefined"){var o=new MutationObserver(function(m){for(var i=0;i<m.length;i++){var a=m[i].attributeName;if(a&&(a==="bis_skin_checked"||a.indexOf("bis_")===0)){m[i].target.removeAttribute(a);}}});o.observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:["bis_skin_checked","bis_register"]});}}catch(e){}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 font-sans antialiased selection:bg-red-500/20 selection:text-red-700 dark:selection:text-red-300">
        <Suspense fallback={<div className="h-16 w-full border-b border-stone-200 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-950/90" />}>
          <Navbar />
        </Suspense>
        <main suppressHydrationWarning className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
        <footer suppressHydrationWarning className="border-t border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 backdrop-blur-sm py-6 text-center text-xs text-stone-700 dark:text-stone-300">
          <div suppressHydrationWarning className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="flex items-center gap-2">
              <span className="font-serif font-bold text-red-600 dark:text-red-500 text-sm">漢字</span>
              <span>KANJILY : Belajar Kanji Interaktif tanpa akun dan tanpa database</span>
            </p>
            <p className="text-stone-700 dark:text-stone-300">
              Data tersimpan secara lokal di peramban Anda.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
