/**
 * 规格选择弹窗
 * 用于选择商品规格：规格、甜度、冰量、加料、数量
 */
import { useState, useEffect } from 'react';
import Modal from './Modal';
import type { MenuItem } from '../../types/menu';
import type { CartTopping } from '../../types/cart';

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

// 示例规格数据结构
// 后续可以改为从后端加载
const getSpecGroups = (item: MenuItem) => {
  const groups = [];
  
  // 规格组
  if (item.categoryId === 'coffee') {
    groups.push({
      id: 'size',
      name: '规格',
      options: [
        { id: 'large', name: 'Large', extraPrice: 0 },
        { id: 'medium', name: 'Medium', extraPrice: 0 },
        { id: 'small', name: 'Small', extraPrice: 0 },
      ],
      required: true,
      multiple: false,
    });
  }
  
  // 甜度组
  groups.push({
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
  });
  
  // 冰量组
  groups.push({
    id: 'temperature',
    name: '冰量',
    options: [
      { id: 'normal', name: 'Normal Ice', extraPrice: 0 },
      { id: 'less', name: 'Less Ice', extraPrice: 0 },
      { id: 'none', name: 'No Ice', extraPrice: 0 },
    ],
    required: true,
    multiple: false,
  });
  
  // 加料组（可选）
  groups.push({
    id: 'toppings',
    name: '加料',
    options: [
      { id: 'pearl', name: 'Pearl', extraPrice: 1000 },
      { id: 'coconut_jelly', name: 'Coconut Jelly', extraPrice: 1000 },
      { id: 'cheese_foam', name: 'Cheese Foam', extraPrice: 1500 },
    ],
    required: false,
    multiple: true,
  });
  
  return groups;
};

// 对应的选项类型
interface OptionGroup {
  id: string;
  name: string;
  options: {
    id: string;
    name: string;
    extraPrice: number;
  }[];
  required: boolean;
  multiple: boolean;
}

export default function SpecModal({ item, open, onClose, onAddToCart }: Props) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | string[]>>({});
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  
  const specGroups = getSpecGroups(item);
  
  // 计算总价
  useEffect(() => {
    let price = item.price;
    
    // 添加选中规格的价格
    Object.entries(selectedOptions).forEach(([groupId, selections]) => {
      const group = specGroups.find(g => g.id === groupId);
      if (!group) return;
      
      if (group.multiple && Array.isArray(selections)) {
        // 多选的选项
        selections.forEach(selectionId => {
          const option = group.options.find(o => o.id === selectionId);
          if (option) {
            price += option.extraPrice;
          }
        });
      } else if (!group.multiple && typeof selections === 'string') {
        // 单选的选项
        const option = group.options.find(o => o.id === selections);
        if (option) {
          price += option.extraPrice;
        }
      }
    });
    
    setTotalPrice(price * quantity);
  }, [selectedOptions, quantity, item.price, specGroups]);
  
  // 检查是否所有必填项都被选中
  const isAllRequiredSelected = () => {
    return specGroups.every(group => {
      if (group.required) {
        if (group.multiple) {
          return Array.isArray(selectedOptions[group.id]) && (selectedOptions[group.id] as string[]).length > 0;
        } else {
          return selectedOptions[group.id] !== undefined && (selectedOptions[group.id] as string).length > 0;
        }
      }
      return true;
    });
  };
  
  const handleSelect = (groupId: string, optionId: string) => {
    const group = specGroups.find(g => g.id === groupId);
    if (!group) return;
    
    if (group.multiple) {
      // 多选逻辑
      const currentSelections = selectedOptions[groupId] as string[] || [];
      const newSelections = currentSelections.includes(optionId)
        ? currentSelections.filter(id => id !== optionId) // 移除
        : [...currentSelections, optionId]; // 添加
      
      setSelectedOptions({
        ...selectedOptions,
        [groupId]: newSelections
      });
    } else {
      // 单选逻辑
      setSelectedOptions({
        ...selectedOptions,
        [groupId]: optionId
      });
    }
  };
  
  const handleAddToCart = () => {
    const toppings: CartTopping[] = [];
    
    // 处理加料选项
    const toppingIds = selectedOptions['toppings'] as string[] || [];
    toppingIds.forEach(id => {
      const topping = specGroups.find(g => g.id === 'toppings')?.options.find(o => o.id === id);
      if (topping) {
        toppings.push({
          id: id,
          name: topping.name,
          price: topping.extraPrice,
          quantity: 1
        });
      }
    });
    
    const options = {
      temperature: selectedOptions['temperature'] as string | undefined,
      sugar: selectedOptions['sugar'] as string | undefined,
      toppings: toppings.length > 0 ? toppings : undefined,
    };
    
    // 设置一个小的延迟来确保modal先关闭，避免state冲突
    setTimeout(() => {
      onAddToCart(item, quantity, options);
    }, 10);
    onClose();
  };
  
  const renderGroup = (group: OptionGroup) => {
    const selectedValue = selectedOptions[group.id];
    
    return (
      <div key={group.id} className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">{group.name}</h3>
        <div className="flex flex-wrap gap-2">
          {group.options.map((option) => {
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
                  py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200
                  ${isSelected
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {option.name}
                {option.extraPrice > 0 && (
                  <span className="ml-1 text-xs">+{option.extraPrice.toLocaleString()}₫</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <Modal open={open} onClose={onClose} title={item.name.zh || item.name.en || '商品详情'}>
      <div className="p-4">
        {/* 商品信息 */}
        <div className="flex items-start mb-6">
          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
            <span className="text-2xl">
              {item.categoryId === 'coffee' && '☕'}
              {item.categoryId === 'tea' && '🍵'}
              {item.categoryId === 'milktea' && '🧋'}
              {item.categoryId === 'dessert' && '🍰'}
              {item.categoryId === 'food' && '🍜'}
            </span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900">{item.name.zh || item.name.en}</h2>
            <p className="text-red-600 font-bold text-lg mt-1">
              {item.price.toLocaleString()}₫
            </p>
          </div>
        </div>
        
        {/* 规格选项 */}
        {specGroups.map(group => renderGroup(group))}
        
        {/* 数量选择 */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">数量</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 text-lg font-bold
                         hover:bg-gray-200 active:scale-90 transition-all"
            >
              −
            </button>
            <span className="w-8 text-center text-lg font-bold text-gray-800">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-10 h-10 rounded-full bg-green-100 text-green-700 text-lg font-bold
                         hover:bg-green-200 active:scale-90 transition-all"
            >
              +
            </button>
          </div>
        </div>
        
        {/* 总价显示 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">总价：</span>
            <span className="text-xl font-bold text-red-600">{totalPrice.toLocaleString()}₫</span>
          </div>
        </div>
        
        {/* 加入购物车按钮 */}
        <button
          onClick={handleAddToCart}
          disabled={!isAllRequiredSelected()}
          className={`
            w-full py-4 text-base font-bold rounded-2xl transition-all duration-200
            ${isAllRequiredSelected()
              ? 'bg-red-600 text-white shadow-lg shadow-red-200 hover:bg-red-700 active:scale-[0.97]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          加入购物车
        </button>
      </div>
    </Modal>
  );
}