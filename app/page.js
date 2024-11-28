import TokenInput from "@/components/token-input";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF8F8]">
      <ul className="text-center whitespace-nowrap overflow-hidden relative z-10 -mt-4 p-0 w-full">
        {[...Array(40)].map((_, i) => (
          <li
            key={i}
            className={`
            relative list-none m-5 inline-block w-3 h-7 rounded-full
            ${
              i % 2
                ? "animate-flash-2 bg-[rgba(0,255,255,1)] shadow-[0_4.67px_24px_3px_rgba(0,255,255,0.5)]"
                : ""
            }
            ${
              i % 4 === 2
                ? "animate-flash-3 bg-[rgba(247,0,148,1)] shadow-[0_4.67px_24px_3px_rgba(247,0,148,1)]"
                : ""
            }
            ${
              !(i % 2) && i % 4 !== 2
                ? "animate-flash-1 bg-[rgba(0,247,165,1)] shadow-[0_4.67px_24px_3px_rgba(0,247,165,1)]"
                : ""
            }
            before:content-[''] before:absolute before:bg-[#222] before:w-2.5 before:h-2.5 before:rounded before:top-[-5px] before:left-[1px]
            after:content-[''] after:absolute after:w-[52px] after:h-[19px] after:border-b-2 after:border-[#222] after:rounded-full after:top-[-14px] after:left-[9px]
            first:ml-[-40px] last:after:content-none
          `}
          />
        ))}
      </ul>

      <main className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-4xl font-bold text-center mb-8">
          Secret-Santa 2024
        </h1>

        <TokenInput />
      </main>

      <footer className="fixed bottom-0 w-full h-[0.1vh] text-center text-black leading-[60px]">
        Made with 💝 by <strong>Théophile</strong>
      </footer>
    </div>
  );
}
