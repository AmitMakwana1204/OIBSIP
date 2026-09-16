const steps = [
  "Pizza Base",
  "Sauce",
  "Cheese",
  "Vegetables",
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-between max-w-3xl mx-auto mb-10">

      {steps.map((step, index) => {
        const number = index + 1;
        const active = number <= currentStep;

        return (
          <div
            key={step}
            className="flex items-center flex-1 last:flex-none"
          >

            <div className="flex flex-col items-center">

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                  active
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {number}
              </div>

              <span
                className={`text-xs mt-2 hidden sm:block font-semibold ${
                  active ? "text-red-600" : "text-gray-400"
                }`}
              >
                {step}
              </span>

            </div>

            {number < steps.length && (
              <div
                className={`h-1 flex-1 mx-2 rounded-full ${
                  number < currentStep
                    ? "bg-red-600"
                    : "bg-gray-200"
                }`}
              />
            )}

          </div>
        );
      })}

    </div>
  );
}