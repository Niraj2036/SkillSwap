const SpinnerOverlay = ({
  size = 32,         
  color = "text-blue-400",
}: {
  size?: number;
  color?: string;
}) =>{
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <svg
        className={`animate-spin ${color}`}
        width={size}
        height={size}
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="opacity-25"
        />
        <path
          d="M22 12a10 10 0 00-10-10"
          stroke="currentColor"
          strokeWidth="4"
          className="opacity-75"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default SpinnerOverlay
