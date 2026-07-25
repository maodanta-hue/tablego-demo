import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

/**
 * 管理员登录页
 * - 简单密码保护（演示用，密码固定为 admin123）
 * - 登录成功后跳转到 /admin/dashboard
 */
export default function AdminLoginPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  // 演示环境，固定密码
  const ADMIN_PASSWORD = 'admin123';

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setError(false);
      navigate('/admin/dashboard');
    } else {
      setError(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-6 py-8">
      <div className="text-5xl mb-5">🔐</div>
      <h1 className="text-xl font-bold text-gray-800 mb-2">
        {t('admin.login.title')}
      </h1>

      <div className="w-full max-w-xs mt-6">
        <label className="block text-sm text-gray-500 mb-2">
          {t('admin.login.password')}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError(false);
          }}
          onKeyDown={handleKeyDown}
          placeholder="******"
          className={`w-full py-3 px-4 rounded-xl border-2 bg-white text-gray-800 outline-none
            transition-colors placeholder:text-gray-300
            ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-green-400'}
          `}
        />

        {error && (
          <p className="text-red-500 text-xs mt-2">
            {t('admin.login.error')}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={!password}
          className={`w-full mt-4 py-4 text-base font-bold rounded-2xl transition-all duration-200
            ${
              password
                ? 'bg-green-600 text-white shadow-lg shadow-green-200 hover:bg-green-700 active:scale-[0.97]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          {t('admin.login.button')}
        </button>
      </div>
    </div>
  );
}