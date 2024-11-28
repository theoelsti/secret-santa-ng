"use client";
import GiftManagement from "./gift-management";
import SantaInfo from "./santa-info";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#FAF8F8]">
      <main className="flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Secret-Santa 2024
        </h1>
        <SantaInfo />
        <GiftManagement />
      </main>

      <footer className="fixed bottom-0 w-full h-[0.1vh] text-center text-black leading-[60px]">
        Made with 💝 by <strong>Théophile</strong>
      </footer>
    </div>
  );
}
