export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-800 bg-[#0B0F19] py-8 text-gray-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-gray-300">
              CyberGuard &copy; {currentYear}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Educational Cyber Risk Visualizer &amp; Attack Path Simulator.
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs text-gray-400">
              Developed for the <span className="text-blue-400 font-medium">IBM SkillsBuild</span> + <span className="text-purple-400 font-medium">GTU SBTP 2026</span> Program
            </p>
            <p className="mt-1 text-[11px] text-gray-600">
              This application is simulated for educational purposes and does not execute real-world network attacks.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
