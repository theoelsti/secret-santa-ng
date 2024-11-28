import "@/app/style/xmas.css";
import TokenInput from "@/components/token-input";
export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF8F8]">
      <ul className="text-center whitespace-nowrap overflow-hidden relative z-10 -mt-4 p-0 w-full lightrope">
        {[...Array(40)].map((_, i) => (
          <li key={i} />
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
