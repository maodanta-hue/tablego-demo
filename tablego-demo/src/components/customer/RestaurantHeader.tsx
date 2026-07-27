/**
 * RestaurantHeader — 餐厅信息头部（商业级）
 * 
 * 布局：
 * - 背景图 180px + 模糊效果 + 半透明黑色遮罩
 * - 左侧 Logo + 中间餐厅名/描述/营业状态/桌号 + 右上语言切换
 * - 下方 Tab 导航：Menu / My Orders（红色下划线）
 */
import { useLanguage } from '../../context/LanguageContext';
import { useOrder } from '../../context/OrderContext';
import { getRestaurantInfo } from '../../store/restaurantStore';
import LanguageSwitcher from '../common/LanguageSwitcher';

interface Props {
  activeTab: 'menu' | 'orders';
  onTabChange: (tab: 'menu' | 'orders') => void;
}

export default function RestaurantHeader({ activeTab, onTabChange }: Props) {
  const { t } = useLanguage();
  const { currentTable } = useOrder();
  const restaurant = getRestaurantInfo();

  const bgImage = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop';

  return (
    <div className="flex-shrink-0">
      {/* ===== Hero Section with Background ===== */}
      <div className="relative h-[180px] overflow-hidden">
        {/* Background Image with blur */}
        <img
          src={bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110"
          style={{ filter: 'blur(5px)' }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-start px-5 pt-5">
          {/* Left: Logo */}
          <div className="flex-shrink-0 w-[56px] h-[56px] rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl border border-white/20 shadow-lg">
            <span>{restaurant.logo}</span>
          </div>

          {/* Center: Name & Info */}
          <div className="flex-1 min-w-0 ml-3 mt-1">
            <h1 className="text-[22px] font-bold text-white leading-tight truncate">
              {restaurant.name.zh || t('restaurantName')}
            </h1>
            <p className="text-[12px] text-white/70 mt-0.5 truncate">
              {restaurant.description.zh || t('restaurantDesc')}
            </p>
            <div className="flex items-center gap-4 mt-2">
              {/* Open Status */}
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${restaurant.open ? 'bg-[#4CAF50]' : 'bg-gray-400'} shadow-sm`} />
                <span className={`text-[12px] font-medium ${restaurant.open ? 'text-[#81C784]' : 'text-gray-400'}`}>
                  {restaurant.open ? (t('openNow') || 'Open Now') : (t('closed') || 'Closed')}
                </span>
              </div>
              {/* Table No */}
              <div className="flex items-center gap-1 text-white/70">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-[12px] font-medium">
                  {(t('table') || 'Table')} {currentTable}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Language Switch */}
          <div className="flex-shrink-0 ml-2 self-start">
            <LanguageSwitcher minimal />
          </div>
        </div>
      </div>

      {/* ===== Tab Navigation ===== */}
      <div className="flex bg-white border-b border-gray-100">
        <button
          onClick={() => onTabChange('menu')}
          className={`flex-1 h-[46px] text-[15px] font-medium relative transition-colors ${
            activeTab === 'menu'
              ? 'text-[#E53935]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('menu') || 'Menu'}
          {activeTab === 'menu' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-[#E53935] rounded-full" />
          )}
        </button>
        <button
          onClick={() => onTabChange('orders')}
          className={`flex-1 h-[46px] text-[15px] font-medium relative transition-colors ${
            activeTab === 'orders'
              ? 'text-[#E53935]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('myOrders') || 'My Orders'}
          {activeTab === 'orders' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-[#E53935] rounded-full" />
          )}
        </button>
      </div>
    </div>
  );
}