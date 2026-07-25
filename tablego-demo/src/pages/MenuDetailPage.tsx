import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useOrder } from '../context/OrderContext';
import { getMenuItems } from '../store';
import type { MultiLangText } from '../types';

/**
 * 菜品详情页
 * - 点击菜单卡片后进入
 * - 展示菜品详情、甜度选择、冰量选择、备注
 * - 确认后加入购物车
 *
 * 注意：Demo 版使用内联甜度/冰量选项，不依赖后端数据
 */
type SugarLevel = 'less' | 'normal' | 'extra';
type IceLevel = 'less' | 'normal' | 'extra';

const sugarOptions: { value: SugarLevel; key: string }[] = [
  { value: 'less', key: 'menuDetail.sugarLess' },
  { value: 'normal', key: 'menuDetail.sugarNormal' },
  { value: 'extra', key: 'menuDetail.sugarExtra' },
];

const iceOptions: { value: IceLevel; key: string }[] = [
  { value: 'less', key: 'menuDetail.iceLess' },
  { value: 'normal', key: 'menuDetail.iceNormal' },
  { value: 'extra', key: 'menuDetail.iceExtra' },
];

/** 从 MultiLangText 中获取当前语言的文本 */
function localizedText(text: MultiLangText | undefined, lang: string): string {
  if (!text) return '';
  switch (lang) {
    case 'vi': return text.vi || text.en || text.zh;
    case 'zh': return text.zh || text.en || text.vi;
    case 'en': return text.en || text.vi || text.zh;
    case 'ko': return text.en || text.vi || text.zh;
    case 'ja': return text.en || text.vi || text.zh;
    default:   return text.en || text.vi || text.zh;
  }
}

/** 简单价格格式化 */
function formatPrice(price: number): string {
  return `${price.toLocaleString()}₫`;
}

export default function MenuDetailPage() {
  const { menuItemId } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { addToCart } = useOrder();

  // 查找菜品
  const item = getMenuItems().find((m) => m.id === menuItemId);

  // 本地状态
  const [sugarLevel, setSugarLevel] = useState<SugarLevel>('normal');
  const [iceLevel, setIceLevel] = useState<IceLevel>('normal');
  const [remark, setRemark] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4">
        <span className="text-5xl mb-4">🔍</span>
        <p className="text-gray-500">{t('menu.notFound')}</p>
        <button onClick={() => navigate('/menu')} className="mt-4 text-green-600 font-medium">
          {t('menu.back')}
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(item, quantity);
    setAdded(true);
    setTimeout(() => {
      navigate('/menu');
    }, 600);
  };

  return (
    <div className="px-4 py-4">
      {/* 图片占位 */}
      <div className="image-placeholder h-48 w-full rounded-2xl mb-4">
        <span className="text-6xl">
          {item.categoryId === 'coffee' && '☕'}
          {item.categoryId === 'tea' && '🍵'}
          {item.categoryId === 'milktea' && '🧋'}
          {item.categoryId === 'dessert' && '🍰'}
          {item.categoryId === 'food' && '🍜'}
        </span>
      </div>

      {/* 标题和价格 */}
      <div className="mb-2">
        <h1 className="text-xl font-bold text-gray-800 mb-1">{localizedText(item.name, language)}</h1>
        <p className="text-sm text-gray-500 mb-3">{localizedText(item.description, language)}</p>
        <span className="text-2xl font-bold text-green-700">{formatPrice(item.price)}</span>
      </div>

      {/* 甜度选择 */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('menuDetail.sugar')}</h3>
        <div className="flex gap-2">
          {sugarOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSugarLevel(opt.value)}
              className={`
                flex-1 py-2.5 rounded-xl text-xs font-medium transition-all duration-200
                ${sugarLevel === opt.value
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {t(opt.key)}
            </button>
          ))}
        </div>
      </div>

      {/* 冰量选择 */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('menuDetail.ice')}</h3>
        <div className="flex gap-2">
          {iceOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setIceLevel(opt.value)}
              className={`
                flex-1 py-2.5 rounded-xl text-xs font-medium transition-all duration-200
                ${iceLevel === opt.value
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {t(opt.key)}
            </button>
          ))}
        </div>
      </div>

      {/* 备注输入框 */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('menuDetail.remark')}</h3>
        <input
          type="text"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder={t('menuDetail.remarkPlaceholder')}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-700
                     placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300
                     transition-all"
        />
      </div>

      {/* 数量选择 */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('menuDetail.quantity')}</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 text-lg font-bold
                       hover:bg-gray-200 active:scale-90 transition-all"
          >
            −
          </button>
          <span className="w-8 text-center text-lg font-bold text-gray-800">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-10 rounded-full bg-green-100 text-green-700 text-lg font-bold
                       hover:bg-green-200 active:scale-90 transition-all"
          >
            +
          </button>
        </div>
      </div>

      {/* 加入购物车按钮 */}
      <button
        onClick={handleAddToCart}
        disabled={added}
        className={`
          w-full py-4 text-base font-bold rounded-2xl transition-all duration-200 mb-4
          ${added
            ? 'bg-green-100 text-green-700'
            : 'bg-green-600 text-white shadow-lg shadow-green-200 hover:bg-green-700 active:scale-[0.97]'
          }
        `}
      >
        {added ? `✓ ${t('menu.added')}` : `${t('menuDetail.addToCart')} — ${formatPrice(item.price * quantity)}`}
      </button>
    </div>
  );
}