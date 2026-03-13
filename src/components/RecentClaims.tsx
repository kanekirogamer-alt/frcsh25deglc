import { useEffect, useState, useRef } from "react";

const names = [
  "Laura B.", "Lena M.", "Emma K.", "Sophie H.", "Anna L.",
  "Mira S.", "Nina R.", "Lea W.", "Luisa T.", "Jana D.",
  "Lisa P.", "Clara G.", "Hannah J.", "Nora B.", "Elara F.",
  "Finn K.", "Lukas M.", "Noah S.", "Leon P.", "Tim H.",
  "Felix W.", "Maxim R.", "Jonas D.", "Theo L.", "Kai B.",
  "Jona G.", "Liam T.", "Elias K.", "Ben J.", "Mats V.",
  "Sophia N.", "Isabella C.", "Charlotte E.", "Amelia O.", "Ella S.",
  "Olivia H.", "Ava R.", "Mila L.", "Marie D.", "Luna K.",
  "Louis M.", "Samuel H.", "Victor K.", "Oskar W.", "Paul B.",
  "Jakob T.", "Carl R.", "Otto P.", "Henry L.", "August S.",
  "Fiona N.", "Lola R.", "Zoe M.", "Hanna K.", "Paulina L.",
  "Kira S.", "Maike H.", "Maja D.", "Sabine W.", "Jens T.",
];

const getRandomName = (excludeNames: string[] = []): string => {
  let name: string;
  do {
    name = names[Math.floor(Math.random() * names.length)];
  } while (excludeNames.includes(name));
  return name;
};

const randomAmount = () => Math.floor(Math.random() * 241) + 60;

const randomActivityMessage = () => {
  const amount = randomAmount();
  return `Hat ${amount}€ durch das Abschließen von Angeboten erhalten`;
};

const formatElapsed = (seconds: number) => {
  if (seconds < 60) return `vor ${seconds} s`;
  return `vor ${Math.floor(seconds / 60)} m`;
};

interface ClaimEntry {
  name: string;
  activity: string;
  createdAt: number;
}

const RecentClaims = () => {
  const [claims, setClaims] = useState<ClaimEntry[]>([]);
  const [, setTick] = useState(0);
  const intervalRef = useRef<number>();

  useEffect(() => {
    const now = Date.now();
    const usedNames: string[] = [];
    const initial: ClaimEntry[] = Array.from({ length: 3 }, (_, i) => {
      const name = getRandomName(usedNames);
      usedNames.push(name);
      return {
        name,
        activity: randomActivityMessage(),
        createdAt: now - (i + 1) * 7000,
      };
    });
    setClaims(initial);

    const addClaim = () => {
      setClaims((prev) => {
        const currentNames = prev.slice(0, 4).map(c => c.name);
        const newName = getRandomName(currentNames);
        return [
          { name: newName, activity: randomActivityMessage(), createdAt: Date.now() },
          ...prev.slice(0, 4),
        ];
      });
      intervalRef.current = window.setTimeout(addClaim, 5000 + Math.random() * 2000);
    };
    intervalRef.current = window.setTimeout(addClaim, 5000 + Math.random() * 2000);

    const tickInterval = setInterval(() => setTick((t) => t + 1), 1000);

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      clearInterval(tickInterval);
    };
  }, []);

  return (
    <div className="px-6 mt-6 pb-10">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Aktuelle Auszahlungen
      </h3>
      <div className="space-y-2">
        {claims.map((claim, i) => {
          const elapsed = Math.max(0, Math.round((Date.now() - claim.createdAt) / 1000));
          return (
            <div
              key={`${claim.name}-${claim.createdAt}`}
              className={`flex items-center justify-between py-2.5 px-4 rounded-xl bg-card border border-border ${i === 0 ? "fade-in" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-accent-foreground">
                  {claim.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{claim.name}</p>
                  <p className="text-xs text-muted-foreground">{claim.activity}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{elapsed < 2 ? "Gerade eben" : formatElapsed(elapsed)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentClaims;
