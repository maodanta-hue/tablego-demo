import { useLanguage } from '../../context/LanguageContext';
import { languageConfigs } from '../../data/languageConfig';
/**
 * 语言切换器
 * 横向排列的语言按钮，点击切换
 */
export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {languageConfigs.map((cfg) => (
        <button
          key={cfg.code}
          onClick={() => setLanguage(cfg.code)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
            transition-all duration-200
            ${
              language === cfg.code
                ? 'bg-green-600 text-white shadow-sm ring-2 ring-green-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95'
            }
          `}
        >
          <span className="text-sm">{cfg.flag}</span>
          <span>{cfg.nativeName}</span>
        </button>
      ))}
    </div>
  );
}