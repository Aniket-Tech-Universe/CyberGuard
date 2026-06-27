export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/[0.04] bg-[#0B0F19] py-12 text-gray-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left space-y-1">
            <p className="text-xs font-semibold tracking-wide text-gray-300">
              CyberGuard &copy; {currentYear}
            </p>
            <p className="text-[11px] text-gray-500 font-sans tracking-normal">
              Educational Cyber Risk Visualizer &amp; Attack Path Simulator.
            </p>
          </div>
          <div className="text-center md:text-right space-y-1">
            <p className="text-[10px] text-gray-600 leading-normal max-w-md font-sans">
              This application is simulated for threat modeling education purposes and does not execute real-world network attacks or scan active systems.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
