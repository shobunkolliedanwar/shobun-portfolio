import Image from "next/image";
import { Braces, Database, GitBranch, Server } from "lucide-react";
export function ProfilePortrait({ src, alt }: { src: string | null; alt: string }) {
  return <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-border-strong bg-bg-elevated">
    {src ? <Image src={src} alt={alt} fill sizes="(max-width:768px) 90vw,400px" priority className="object-cover"/> : <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-br from-[#214653] via-[#173044] to-[#102036] p-7">
      <div className="flex justify-between text-xs font-mono text-accent"><span>ENGINEERING / SYSTEMS</span><Braces size={20}/></div>
      <div className="relative flex justify-center py-8" aria-hidden="true"><div className="absolute -top-3 h-52 w-52 rounded-full border border-accent/15"/><div className="flex h-40 w-40 items-center justify-center rounded-3xl border border-accent/30 bg-bg/40 shadow-2xl"><Server size={68} strokeWidth={1} className="text-accent"/></div><Database size={34} className="absolute bottom-3 right-7 rounded-lg bg-bg-elevated p-1 text-accent"/><GitBranch size={30} className="absolute left-7 top-0 text-accent"/></div>
      <div><p className="text-3xl font-semibold tracking-tight text-white">Behind every great<br/>experience.</p><p className="mt-3 text-sm text-muted">Architecture. Logic. Connection.</p></div>
    </div>}
  </div>;
}
