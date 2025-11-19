import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Back to homepage">
      <CheckCircle2 className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold tracking-tight text-foreground">
        TaskTrack
      </span>
    </Link>
  );
}
