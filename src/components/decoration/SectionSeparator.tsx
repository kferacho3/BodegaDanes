"use client";

export default function SectionSeparator() {
  return (
    <div className="my-8 flex w-full items-center justify-center relative">
      {/* Left chalk-like line */}
      <div
        className="h-[2px] w-1/4 bg-repeat-x"
        style={{
          backgroundImage: "url('/textures/chalk-red.png')",
          backgroundSize: "auto 100%",
        }}
      ></div>

      {/* 3 hollow chalk circles */}
      <div className="mx-4 flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-6 h-6">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <defs>
                <pattern
                  id={`chalkRedPattern-${i}`}
                  patternUnits="userSpaceOnUse"
                  width="24"
                  height="24"
                >
                  <image
                    href="/textures/chalk-red.png"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                  />
                </pattern>
              </defs>
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke={`url(#chalkRedPattern-${i})`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Right chalk-like line */}
      <div
        className="h-[2px] w-1/4 bg-repeat-x"
        style={{
          backgroundImage: "url('/textures/chalk-red.png')",
          backgroundSize: "auto 100%",
        }}
      ></div>
    </div>
  );
}
