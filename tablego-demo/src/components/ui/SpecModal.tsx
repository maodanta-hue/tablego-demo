/**
 * SpecModal — 柠香小筑规格弹窗 (Bottom Sheet 样式)
 *
 * - 从底部滑出，顶部圆角 20px
 * - 拖拽手柄 + 半透明遮罩
 * - 规格/甜度/冰量/加料 圆角选项按钮
 * - 数量加减圆形按钮 + 总价
 * - "加入购物车" 按钮（主色填充）
 *
 * 注意：弹窗关闭由父组件控制（不再使用 setTimeout）
 */
import { useState, useEffect, useMemo, useRef } from 'react';
import type { MenuItem } from '../../types/menu';
import type { CartTopping } from '../../types/cart';
import { useLanguage } from '../../context/LanguageContext';
import { localizedText } from '../../utils/i18n';

interface Props {
  item: MenuItem;
  open: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, options: {
    temperature?: string;
    sugar?: string;
    toppings?: CartTopping[];
  }) => void;
}

interface OptionGroup {
  id: string;
  name: string;
  options: { id: string; name: string; extraPrice: number }[];
  required: boolean;
  multiple: boolean;
}

/** 生成规格组 */
function getSpecGroups(): OptionGroup[] {
  return [
    {
      id: 'sugar',
      name: '甜度',
      options: [
        { id: '100', name: '100%', extraPrice: 0 },
        { id: '70', name: '70%', extraPrice: 0 },
        { id: '50', name: '50%', extraPrice: 0 },
        { id: '30', name: '30%', extraPrice: 0 },
        { id: '0', name: '0%', extraPrice: 0 },
      ],
      required: true,
      multiple: false,
    },
    {
      id: 'temperature',
      name: '冰量',
      options: [
        { id: 'normal', name: 'Đá bình thường', extraPrice: 0 },
        { id: 'less', name: 'Ít đá', extraPrice: 0 },
        { id: 'none', name: 'Không đá', extraPrice: 0 },
      ],
      required: true,
      multiple: false,
    },
    {
      id: 'toppings',
      name: '加料',
      options: [
        { id: 'pearl', name: 'Trân châu', extraPrice: 1000 },
        { id: 'coconut_jelly', name: 'Thạch dừa', extraPrice: 1000 },
        { id: 'cheese_foam', name: 'Kem cheese', extraPrice: 1500 },
      ],
      required: false,
      multiple: true,
    },
  ];
}

export default function SpecModal({ item, open, onClose, onAddToCart }: Props) {
  const { t, language } = useLanguage();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | string[]>>({});
  const [quantity, setQuantity] = useState(1);
  const specGroups = useMemo(() => getSpecGroups(), []);
  const isAddingRef = useRef(false);

  // 同步计算总价（不使用 useEffect，确保生产环境稳定）
  const totalPrice = (() => {
    let price = item.price;
    Object.entries(selectedOptions).forEach(([groupId, selections]) => {
      const group = specGroups.find(g => g.id === groupId);
      if (!group) return;
      if (group.multiple && Array.isArray(selections)) {
        selections.forEach(sid => {
          const opt = group.options.find(o => o.id === sid);
          if (opt) price += opt.extraPrice;
        });
      } else if (!group.multiple && typeof selections === 'string') {
        const opt = group.options.find(o => o.id === selections);
        if (opt) price += opt.extraPrice;
      }
    });
    return price * quantity;
  })();

  // 重置状态
  useEffect(() => {
    if (open) {
      setSelectedOptions({});
      setQuantity(1);
    }
  }, [open]);

  const isAllRequired = () =>
    specGroups.every(group => {
      if (!group.required) return true;
      const val = selectedOptions[group.id];
      if (group.multiple) return Array.isArray(val) && val.length > 0;
      return val !== undefined && String(val).length > 0;
    });

  const handleSelect = (groupId: string, optionId: string) => {
    const group = specGroups.find(g => g.id === groupId);
    if (!group) return;
    if (group.multiple) {
      const current = (selectedOptions[groupId] as string[]) || [];
      setSelectedOptions({
        ...selectedOptions,
        [groupId]: current.includes(optionId)
          ? current.filter(id => id !== optionId)
          : [...current, optionId],
      });
    } else {
      setSelectedOptions({ ...selectedOptions, [groupId]: optionId });
    }
  };

  const handleAddToCart = () => {
    if (isAddingRef.current) return;
    isAddingRef.current = true;

    const toppings: CartTopping[] = [];
    const toppingIds = (selectedOptions['toppings'] as string[]) || [];
    toppingIds.forEach(id => {
      const opt = specGroups.find(g => g.id === 'toppings')?.options.find(o => o.id === id);
      if (opt) toppings.push({ id, name: opt.name, price: opt.extraPrice, quantity: 1 });
    });
    
    onAddToCart(item, quantity, {
      temperature: selectedOptions['temperature'] as string | undefined,
      sugar: selectedOptions['sugar'] as string | undefined,
      toppings: toppings.length > 0 ? toppings : undefined,
    });

    setTimeout(() => {
      isAddingRef.current = false;
    }, 300);
  };

  if (!open) return null;

  return (
    <>
      {/* 半透明遮罩 */}
      <div
        className="fixed inset-0 z-50 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet 面板 */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-[20px]
                   max-h-[85vh] overflow-y-auto
                   shadow-[0_-4px_20px_rgba(0,0,0,0.1)]
                   animate-slide-up"
        style={{ maxWidth: '430px', margin: '0 auto', left: 0, right: 0 }}
      >
        {/* 拖拽手柄 */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#DDDDDD]" />
        </div>

        <div className="px-4 pb-6">
          {/* === 商品信息 === */}
          <div className="flex items-start gap-3 mb-5">
            <div className="w-[80px] h-[80px] rounded-[12px] bg-gray-100 flex items-center justify-center flex-shrink-0">
              <span className="text-4xl">
                {item.categoryId === 'coffee' && '☕'}
                {item.categoryId === 'tea' && '🍵'}
                {item.categoryId === 'milktea' && '🧋'}
                {item.categoryId === 'dessert' && '🍰'}
                {item.categoryId === 'food' && '🍜'}
                {!['coffee','tea','milktea','dessert','food'].includes(item.categoryId) && '🍽️'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[16px] font-semibold text-[#1A1A1A] leading-tight">
                {localizedText(item.name, language)}
              </h2>
              <p className="text-[16px] font-bold text-[#E53935] mt-1">
                {t('app.currency')}{item.price.toLocaleString()}
              </p>
            </div>
          </div>

          {/* === 规格选项 === */}
          {specGroups.map(group => {
            const selectedValue = selectedOptions[group.id];
            return (
              <div key={group.id} className="mb-5">
                <h3 className="text-[14px] font-semibold text-[#1A1A1A] mb-2.5">
                  {group.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.options.map(option => {
                    let isSelected = false;
                    if (group.multiple) {
                      isSelected = Array.isArray(selectedValue) && selectedValue.includes(option.id);
                    } else {
                      isSelected = selectedValue === option.id;
                    }
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelect(group.id, option.id)}
                        className={`
                          px-4 py-2 rounded-[10px] text-[13px] font-medium
                          transition-all duration-150
                          ${isSelected
                            ? 'bg-[#2E7D32] text-white shadow-sm'
                            : 'bg-gray-100 text-[#666666] hover:bg-gray-200'
                          }
                        `}
                      >
                        {option.name}
                        {option.extraPrice > 0 && (
                          <span className="ml-1 text-[11px] opacity-80">
                            +{t('app.currency')}{option.extraPrice.toLocaleString()}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* === 数量 === */}
          <div className="mb-5">
            <h3 className="text-[14px] font-semibold text-[#1A1A1A] mb-2.5">
              {t('quantity') || 'Số lượng'}
            </h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 text-lg font-bold
                           hover:bg-gray-200 active:scale-90 transition-all flex items-center justify-center"
              >
                −
              </button>
              <span className="w-8 text-center text-[18px] font-bold text-[#1A1A1A]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-9 h-9 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-lg font-bold
                           hover:bg-[#C8E6C9] active:scale-90 transition-all flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* === 总价 + 加入购物车 === */}
          <div className="flex items-center justify-between pt-4 border-t border-[#F0F0F0]">
            <div>
              <span className="text-[13px] text-[#999999]">
                {t('total') || 'Tổng cộng'}:
              </span>
              <span className="ml-2 text-[20px] font-bold text-[#E53935]">
                {t('app.currency')}{totalPrice.toLocaleString()}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!isAllRequired()}
              className={`
                px-6 py-3 rounded-[12px] text-[15px] font-semibold
                transition-all duration-200
                ${isAllRequired()
                  ? 'bg-[#E53935] text-white shadow-[0_4px_12px_rgba(229,57,53,0.25)] hover:bg-[#C62828] active:scale-[0.97]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {t('addToCart') || 'Thêm vào giỏ'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}