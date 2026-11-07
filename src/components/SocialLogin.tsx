'use client';

export default function SocialLogin(){
    return(
        <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-stone-950 border border-stone-800 hover:bg-stone-800 text-stone-300 py-3 rounded-xl text-xs font-medium transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"
                />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-stone-950 border border-stone-800 hover:bg-stone-800 text-stone-300 py-3 rounded-xl text-xs font-medium transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.67-.82 1.13-1.96.99-3.1-.98.04-2.19.66-2.88 1.47-.62.72-1.16 1.88-.99 3 1.09.08 2.22-.55 2.88-1.37z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>
    )
}