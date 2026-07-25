/**
 * 实时同步服务
 * 使用 BroadcastChannel + StorageEvent 实现跨标签页实时数据同步
 *
 * 使用方式：
 *   import { broadcast, subscribe, close } from '../services/sync';
 *
 *   // 监听数据变化
 *   subscribe('orders', (newOrders) => { setOrders(newOrders); });
 *
 *   // 广播数据变化
 *   broadcast('orders', updatedOrders);
 *
 *   // 关闭
 *   close();
 */

type SyncCallback<T = unknown> = (data: T) => void;

const CHANNEL_NAME = 'tablego_sync';
const listeners = new Map<string, Set<SyncCallback>>();

let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel | null {
  try {
    if (!channel) {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (event: MessageEvent<{ key: string; data: unknown }>) => {
        const { key, data } = event.data;
        const subs = listeners.get(key);
        if (subs) {
          subs.forEach((cb) => {
            try {
              cb(data);
            } catch (e) {
              console.warn(`Sync listener error for key "${key}"`, e);
            }
          });
        }
      };
    }
    return channel;
  } catch {
    // BroadcastChannel not supported (e.g., some older browsers)
    return null;
  }
}

/** 通知其他标签页数据已更新 */
export function broadcast<T = unknown>(key: string, data: T): void {
  const ch = getChannel();
  if (ch) {
    try {
      ch.postMessage({ key, data });
    } catch (e) {
      console.warn('BroadcastChannel postMessage failed', e);
    }
  }
  // 同时触发 StorageEvent（兼容同页面多上下文场景）
  try {
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: `tablego_db:${key}`,
        newValue: JSON.stringify({ key, data }),
      }),
    );
  } catch (e) {
    // ignore
  }
}

/** 订阅某个 key 的数据变化通知 */
export function subscribe<T = unknown>(key: string, callback: SyncCallback<T>): () => void {
  let subs = listeners.get(key);
  if (!subs) {
    subs = new Set();
    listeners.set(key, subs);
  }
  subs.add(callback as SyncCallback);

  // 同时监听 localStorage 的 storage 事件（跨标签页兼容）
  const storageHandler = (e: StorageEvent) => {
    if (e.key === `tablego_db:${key}` && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue) as { key: string; data: T };
        if (parsed.key === key) {
          callback(parsed.data);
        }
      } catch {
        // ignore parse errors
      }
    }
  };
  window.addEventListener('storage', storageHandler);

  // 返回取消订阅函数
  return () => {
    subs?.delete(callback as SyncCallback);
    window.removeEventListener('storage', storageHandler);
  };
}

/** 清理所有监听和 Channel */
export function close(): void {
  listeners.clear();
  if (channel) {
    channel.close();
    channel = null;
  }
}