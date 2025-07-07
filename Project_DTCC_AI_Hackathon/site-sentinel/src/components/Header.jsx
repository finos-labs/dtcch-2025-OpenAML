import dukeLogoDark from '../assets/images/duke_logo.svg';
import dukeLogoLight from '../assets/images/duke_logo_light.svg'
import sentinelLogo from '../assets/images/sentinel-logo.svg'
import { useTheme } from '../hooks/useTheme';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 z-20 w-full py-3 bg-white dark:bg-gray-950/80 backdrop-blur-lg px-4 md:px-8 border-b border-gray-200 dark:border-gray-800">
      <div className="flex flex-row items-start md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-end justify-start md:justify-center">
          <img src={sentinelLogo} alt="Sentinel" title='Sentinel' width={150} />
          {/* <h1 className="md:text-4xl text-3xl font-medium">Sentinel</h1> */}
          <span className="text-sm md:text-base text-gray-600 dark:text-gray-400">DTCC Hackathon 2025</span>
        </div>
        <div className="flex items-center justify-end gap-4">
          {theme ==='light' ? (
            <img src={dukeLogoDark} alt="Duke University" title="Duke University" width={100} />
          ) : (
            <img src={dukeLogoLight} alt="Duke University" title="Duke University" width={100} />
          ) 

          }

          <button
            className="p-2 rounded-full hover:dark:bg-slate-700 hover:bg-slate-100 transition-colors max-w-fit cursor-pointer"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <MdOutlineDarkMode size={24} /> : <MdOutlineLightMode size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
