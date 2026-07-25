import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * 扫码入口页
 * 当顾客扫描二维码时，访问 /table/:tableNo
 * 此组件自动读取桌号并设置到 URL 查询参数，然后跳转到菜单页
 */
export default function TableEntryPage() {
  const { tableNo } = useParams<{ tableNo: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!tableNo) {
      // 没有桌号，跳回首页
      navigate('/', { replace: true });
      return;
    }

    // 自动跳转到菜单页，桌号通过 URL 查询参数传递
    navigate(`/menu?table=${encodeURIComponent(tableNo.toUpperCase())}`, { replace: true });
  }, [tableNo, navigate]);
  // 加载中提示
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="text-6xl mb-4 animate-bounce">🍜</div>
      <p className="text-gray-500 text-sm">Loading table...</p>
    </div>
  );
}