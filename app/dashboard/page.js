import "@/app/style/xmas.css";
import Dashboard from "@/components/dashboard";
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F8]">
      <ul className="text-center whitespace-nowrap overflow-hidden relative z-10 -mt-4 p-0 w-full lightrope">
        {[...Array(40)].map((_, i) => (
          <li key={i} />
        ))}
      </ul>
      <Dashboard />
    </div>
  );
}
