
interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
}

export default function Skeleton({
  width = '100%',
  height = '16px',
  rounded = '8px',
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: rounded }}
    />
  );
}

/** 商品卡片骨架屏 */
export function ProductCardSkeleton() {
  return (
    <div className="flex gap-3 px-4 py-3">
      <Skeleton width="100px" height="100px" rounded="12px" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton width="70%" height="18px" />
        <Skeleton width="90%" height="14px" />
        <Skeleton width="40%" height="12px" />
        <div className="flex items-center justify-between mt-auto">
          <Skeleton width="60px" height="20px" />
          <Skeleton width="32px" height="32px" rounded="10px" />
        </div>
      </div>
    </div>
  );
}

/** 订单卡片骨架屏 */
export function OrderCardSkeleton() {
  return (
    <div className="px-4 py-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton width="120px" height="18px" />
        <Skeleton width="60px" height="22px" rounded="999px" />
      </div>
      <Skeleton width="100%" height="14px" />
      <Skeleton width="70%" height="14px" />
    </div>
  );
}