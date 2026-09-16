import {
  CheckCircle2,
  ChefHat,
  Bike,
} from "lucide-react";

const statuses = [
  {
    title: "Order Received",
    description: "Your order has been confirmed.",
    icon: CheckCircle2,
  },
  {
    title: "In Kitchen",
    description: "Your pizza is being prepared.",
    icon: ChefHat,
  },
  {
    title: "Sent to Delivery",
    description: "Your pizza is on its way.",
    icon: Bike,
  },
];

export default function OrderStatus({ current = 1 }) {
  return (
    <div className="space-y-7">

      {statuses.map((status, index) => {
        const number = index + 1;
        const completed = number <= current;
        const Icon = status.icon;

        return (
          <div
            key={status.title}
            className="flex gap-4"
          >

            <div className="flex flex-col items-center">

              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  completed
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Icon size={21} />
              </div>

              {number < statuses.length && (
                <div
                  className={`w-0.5 h-12 mt-2 ${
                    number < current
                      ? "bg-red-600"
                      : "bg-gray-200"
                  }`}
                />
              )}

            </div>

            <div className="pt-1">

              <h3
                className={`font-black ${
                  completed
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                {status.title}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {status.description}
              </p>

            </div>

          </div>
        );
      })}

    </div>
  );
}