import { useRef } from "react";

const PinInput = ({ value, onChange, onComplete, error, autoFocus = false }) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && value.length === 6 && onComplete) {
      e.preventDefault();
      onComplete();
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hidden native input capturing keyboard and paste */}
      <input
        ref={inputRef}
        type="password"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, "").slice(0, 6);
          onChange(val);
          if (val.length === 6 && onComplete) {
            onComplete(val);
          }
        }}
        onKeyDown={handleKeyDown}
        className="sr-only"
        tabIndex={0}
      />

      {/* Modern 6-box visual grid */}
      <div
        onClick={handleClick}
        className="flex items-center justify-center gap-2.5 sm:gap-3 cursor-pointer py-1 select-none"
      >
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const isFilled = value.length > index;
          const isCurrent = value.length === index;

          return (
            <div
              key={index}
              className={`w-11 h-13 sm:w-12 sm:h-14 rounded-xl border flex items-center justify-center text-xl font-bold transition-all duration-200 ${
                isFilled
                  ? "border-purple-500 bg-purple-500/15 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.35)] scale-105"
                  : isCurrent
                  ? "border-purple-400 bg-[#0c1022] ring-2 ring-purple-500/25 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                  : "border-gray-800 bg-[#080b1a] text-gray-600 hover:border-gray-700"
              } ${error ? "border-red-500/60 ring-red-500/20" : ""}`}
            >
              {isFilled ? (
                <span className="w-2.5 h-2.5 rounded-full bg-purple-300 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
              ) : isCurrent ? (
                <span className="w-0.5 h-5 bg-purple-400 animate-pulse" />
              ) : (
                ""
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-gray-500 mt-2">
        Click to focus • Enter 6 digits
      </p>
    </div>
  );
};

export default PinInput;

