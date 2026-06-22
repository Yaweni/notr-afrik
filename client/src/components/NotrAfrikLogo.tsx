export default function NotrAfrikLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse cx="32" cy="32" rx="28" ry="30" fill="#1E3A5F" />
      <path
        d="M16 16 Q32 4 48 16 L44 28 Q32 18 20 28 Z"
        fill="#0D1B3E"
        opacity="0.8"
      />
      <path
        d="M20 28 Q32 38 44 28 L40 44 Q32 50 24 44 Z"
        fill="#F0B429"
        opacity="0.9"
      />
      <circle cx="32" cy="20" r="2" fill="#F0B429" />
      <path
        d="M32 18 L38 12 M32 18 L26 12"
        stroke="#C41E3A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M36 24 Q48 30 52 40"
        stroke="#C41E3A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2 1"
      />
      <text
        x="70"
        y="28"
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontWeight="800"
        fontSize="18"
        fill="#0D1B3E"
      >
        NOTR
      </text>
      <text
        x="70"
        y="48"
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontWeight="800"
        fontSize="18"
        fill="#F0B429"
      >
        AFRIK
      </text>
    </svg>
  );
}
