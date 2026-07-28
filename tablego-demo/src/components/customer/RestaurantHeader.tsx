/**
 * RestaurantHeader — 原岘港咖啡馆风格
 *
 * 四行固定布局：
 * 1. 店名（左） + 标语（右）
 * 2. 营业状态 + 桌号 + 🌐语言切换（右上角）
 * 3. Tab 切换（Menu / My Orders）
 * 4. 搜索框
 */
import { useLanguage } from '../../context/LanguageContext';
import { getRestaurantInfo } from '../../store/restaurantStore';
import { localizedText } from '../../utils/i18n';
import { useState } from 'react';
import LanguageSwitcher from '../common/LanguageSwitcher';

interface Props {
  tableNo: string;
  activeTab: 'menu' | 'orders';
  onTabChange: (tab: 'menu' | 'orders') => void;
  onSearch: (query: string) => void;
}

export default function RestaurantHeader({
  tableNo,
  activeTab,
  onTabChange,
  onSearch,
}: Props) {
  const { t, language } = useLanguage();
  const restaurant = getRestaurantInfo();
  const [searchQuery, setSearchQuery] = useState('');

  const restaurantName = localizedText(restaurant.name, language);
  const restaurantDesc = localizedText(restaurant.description, language);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="flex-shrink-0 bg-white">
      {/* === 第一行：店名（左） + 标语（右） === */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <h1 className="text-[17px] font-bold text-[#1A1A1A] truncate pr-2">
          {restaurantName || '岘港咖啡馆'}
        </h1>
        <p className="text-[12px] text-[#666666] flex-shrink-0">
          {restaurantDesc || '正宗越南美食，欢迎光临'}
        </p>
      </div>

      {/* === 第二行：营业状态 + 桌号 + 🌐语言切换（右上角） === */}
      <div className="relative flex items-center justify-between px-4 py-1">
        <div className="flex items-center gap-4">
          <span className="text-[12px] text-[#2E7D32] font-medium">
            ● {t('openNow') || 'Open Now'}
          </span>
          <span className="text-[12px] text-[#666666]">
            {t('table') || 'Table'} {tableNo}
          </span>
        </div>
        <LanguageSwitcher minimal />
      </div>

      {/* === 第三行：Tab 切换（Menu / My Orders） === */}
      <div className="flex border-b border-[#F0F0F0]">
        <button
          onClick={() => onTabChange('menu')}
          className={`flex-1 py-2.5 text-[14px] font-medium transition-colors
            ${activeTab === 'menu'
              ? 'text-[#E53935] border-b-[2px] border-[#E53935]'
              : 'text-[#999999] hover:text-[#666666]'
            }`}
        >
          {t('menu') || 'Menu'}
        </button>
        <button
          onClick={() => onTabChange('orders')}
          className={`flex-1 py-2.5 text-[14px] font-medium transition-colors
            ${activeTab === 'orders'
              ? 'text-[#E53935] border-b-[2px] border-[#E53935]'
              : 'text-[#999999] hover:text-[#666666]'
            }`}
        >
          {t('myOrders') || 'My Orders'}
        </button>
      </div>

      {/* === 第四行：搜索框 === */}
      <div className="px-4 py-2.5">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t('searchMenu') || 'Search menu...'}
            className="w-full h-10 pl-9 pr-4 rounded-[20px] bg-[#F3F3F3] text-[14px] text-[#1A1A1A]
                       placeholder-[#999999] border-none outline-none
                       focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
          />
        </div>
      </div>
    </div>
  );
}