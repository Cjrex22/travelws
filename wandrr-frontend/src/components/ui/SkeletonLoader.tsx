import { ReactNode } from 'react';

export default function SkeletonLoader({ className = "", children }: { className?: string, children?: ReactNode }) {
    if (children) {
        return (
            <div className={`relative overflow-hidden ${className}`}>
                <div className="absolute inset-0 bg-white/5 animate-pulse rounded-inherit" />
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
        );
    }
    return (
        <div className={`bg-white/5 animate-pulse rounded-lg relative overflow-hidden ${className}`}>
             <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
    );
}
