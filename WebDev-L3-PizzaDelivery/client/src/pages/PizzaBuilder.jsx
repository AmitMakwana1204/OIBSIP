import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import StepIndicator from "../components/StepIndicator";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChefHat,
  Clock3,
  Flame,
  Leaf,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Utensils,
} from "lucide-react";

const bases = [
  {
    name: "Classic Crust",
    price: 0,
    icon: "🍞",
    description: "Golden, crispy & classic",
  },
  {
    name: "Thin Crust",
    price: 30,
    icon: "🥖",
    description: "Light, thin & extra crispy",
  },
  {
    name: "Cheese Burst",
    price: 80,
    icon: "🧀",
    description: "Loaded with molten cheese",
    popular: true,
  },
  {
    name: "Whole Wheat",
    price: 40,
    icon: "🌾",
    description: "A wholesome tasty choice",
  },
  {
    name: "Pan Crust",
    price: 50,
    icon: "🍕",
    description: "Soft, thick & buttery",
  },
];

const sauces = [
  {
    name: "Classic Tomato",
    price: 0,
    icon: "🍅",
    description: "Rich Italian tomato sauce",
  },
  {
    name: "BBQ Sauce",
    price: 30,
    icon: "🔥",
    description: "Smoky, sweet & bold",
    popular: true,
  },
  {
    name: "Peri Peri",
    price: 35,
    icon: "🌶️",
    description: "Hot & spicy kick",
  },
  {
    name: "Pesto",
    price: 45,
    icon: "🌿",
    description: "Fresh basil & herbs",
  },
  {
    name: "Spicy Garlic",
    price: 30,
    icon: "🧄",
    description: "Creamy garlic with heat",
  },
];

const cheeses = [
  {
    name: "Mozzarella",
    price: 0,
    icon: "🧀",
    description: "Classic stretchy cheese",
  },
  {
    name: "Cheddar",
    price: 40,
    icon: "🧀",
    description: "Sharp & creamy",
    popular: true,
  },
  {
    name: "Parmesan",
    price: 50,
    icon: "🧀",
    description: "Rich & nutty flavour",
  },
];

const vegetables = [
  {
    name: "Onion",
    price: 20,
    icon: "🧅",
  },
  {
    name: "Capsicum",
    price: 20,
    icon: "🫑",
  },
  {
    name: "Sweet Corn",
    price: 25,
    icon: "🌽",
  },
  {
    name: "Olives",
    price: 30,
    icon: "🫒",
  },
  {
    name: "Mushroom",
    price: 30,
    icon: "🍄",
  },
  {
    name: "Jalapeño",
    price: 25,
    icon: "🌶️",
  },
  {
    name: "Tomato",
    price: 20,
    icon: "🍅",
  },
];

const steps = [
  { number: 1, title: "Base", icon: "🍕" },
  { number: 2, title: "Sauce", icon: "🍅" },
  { number: 3, title: "Cheese", icon: "🧀" },
  { number: 4, title: "Toppings", icon: "🌿" },
];

export default function PizzaBuilder() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [pizza, setPizza] = useState({
    base: bases[0],
    sauce: sauces[0],
    cheese: cheeses[0],
    vegetables: [],
  });

  const [quantity, setQuantity] = useState(1);

  const selectSingle = (type, item) => {
    setPizza((prev) => ({
      ...prev,
      [type]: item,
    }));
  };

  const toggleVegetable = (item) => {
    setPizza((prev) => {
      const exists = prev.vegetables.some(
        (vegetable) => vegetable.name === item.name
      );

      return {
        ...prev,
        vegetables: exists
          ? prev.vegetables.filter(
              (vegetable) => vegetable.name !== item.name
            )
          : [...prev.vegetables, item],
      };
    });
  };

  const singlePizzaPrice = useMemo(() => {
    return (
      199 +
      pizza.base.price +
      pizza.sauce.price +
      pizza.cheese.price +
      pizza.vegetables.reduce((sum, item) => sum + item.price, 0)
    );
  }, [pizza]);

  const total = singlePizzaPrice * quantity;

  const nextStep = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      navigate("/order-summary", {
        state: {
          pizza,
          total,
          quantity,
        },
      });
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const getStepTitle = () => {
    if (step === 1) return "Choose Your Pizza Base";
    if (step === 2) return "Pick Your Favourite Sauce";
    if (step === 3) return "Make It Extra Cheesy";
    return "Load It With Toppings";
  };

  const getStepSubtitle = () => {
    if (step === 1)
      return "Start with the perfect crust for your dream pizza.";
    if (step === 2)
      return "Choose the flavour that makes every bite delicious.";
    if (step === 3)
      return "Because there is no such thing as too much cheese.";
    return "Add fresh toppings and make your pizza truly yours.";
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-orange-50/60 via-white to-gray-50 pb-14">
        {/* Top Offer Strip */}
        <div className="bg-gray-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold">
            <Flame size={16} className="text-orange-400" />
            <span>Build your dream pizza & get FREE delivery today!</span>
            <Sparkles size={15} className="text-yellow-400" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider">
              <ChefHat size={16} />
              Pizza Builder
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 mt-4 tracking-tight">
              Create Your{" "}
              <span className="text-red-600">Perfect Pizza</span>
            </h1>

            <p className="text-gray-500 mt-3 text-sm sm:text-base">
              Your pizza. Your rules. Your flavour.
              <br className="hidden sm:block" />
              Customize every delicious layer exactly the way you like.
            </p>
          </div>

          {/* Progress */}
          <div className="mt-8 mb-8">
            <StepIndicator currentStep={step} />
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-[minmax(0,1fr)_370px] gap-7 items-start">
            {/* Builder Section */}
            <section className="bg-white rounded-[28px] border border-gray-100 shadow-[0_15px_50px_rgba(0,0,0,0.06)] overflow-hidden">
              {/* Section Header */}
              <div className="p-5 sm:p-7 border-b border-gray-100 bg-gradient-to-r from-white to-orange-50/50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
                      Step {step} of 4
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mt-1">
                      {getStepTitle()}
                    </h2>

                    <p className="text-gray-500 mt-2 text-sm">
                      {getStepSubtitle()}
                    </p>
                  </div>

                  <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-red-50 items-center justify-center text-2xl">
                    {steps[step - 1].icon}
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="p-5 sm:p-7">
                {step === 1 && (
                  <SelectionStep
                    items={bases}
                    selected={pizza.base}
                    onSelect={(item) => selectSingle("base", item)}
                  />
                )}

                {step === 2 && (
                  <SelectionStep
                    items={sauces}
                    selected={pizza.sauce}
                    onSelect={(item) => selectSingle("sauce", item)}
                  />
                )}

                {step === 3 && (
                  <SelectionStep
                    items={cheeses}
                    selected={pizza.cheese}
                    onSelect={(item) => selectSingle("cheese", item)}
                  />
                )}

                {step === 4 && (
                  <VegetableStep
                    vegetables={vegetables}
                    selected={pizza.vegetables}
                    onToggle={toggleVegetable}
                  />
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    disabled={step === 1}
                    onClick={previousStep}
                    className="px-4 sm:px-5 py-3 rounded-xl font-bold text-gray-700 flex items-center gap-2 hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={18} />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-5 sm:px-7 py-3.5 rounded-xl bg-red-600 text-white font-black flex items-center justify-center gap-2 hover:bg-red-700 active:scale-[0.98] transition shadow-lg shadow-red-600/20"
                  >
                    <span>
                      {step === 4 ? "Review & Order" : "Continue"}
                    </span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </section>

            {/* Preview */}
            <aside className="lg:sticky lg:top-24">
              <div className="bg-gray-950 rounded-[28px] text-white overflow-hidden shadow-2xl">
                {/* Preview Header */}
                <div className="p-5 sm:p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black tracking-[0.18em] text-orange-400">
                        YOUR CREATION
                      </p>
                      <h3 className="text-xl font-black mt-1">
                        Custom Pizza
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full text-xs font-bold">
                      <Star size={13} className="fill-yellow-400 text-yellow-400" />
                      4.9
                    </div>
                  </div>
                </div>

                {/* Pizza Visual */}
                <div className="relative px-5 pt-6">
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-52 h-52 bg-red-500/10 rounded-full blur-3xl" />

                  <div className="relative mx-auto w-52 h-52 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-orange-200 via-orange-300 to-red-400 shadow-[0_20px_50px_rgba(249,115,22,0.3)] flex items-center justify-center border-[10px] border-orange-100">
                    <div className="w-[88%] h-[88%] rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-inner">
                      <div className="text-7xl sm:text-8xl drop-shadow-lg">
                        🍕
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected ingredients */}
                <div className="px-5 sm:px-6 mt-6">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                    Selected ingredients
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <IngredientPill
                      icon="🍕"
                      text={pizza.base.name}
                    />
                    <IngredientPill
                      icon="🍅"
                      text={pizza.sauce.name}
                    />
                    <IngredientPill
                      icon="🧀"
                      text={pizza.cheese.name}
                    />

                    {pizza.vegetables.map((item) => (
                      <IngredientPill
                        key={item.name}
                        icon={item.icon}
                        text={item.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="mx-5 sm:mx-6 mt-6 rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      Pizza price
                    </span>
                    <span className="font-semibold">
                      ₹{singlePizzaPrice}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-400">
                      Quantity
                    </span>
                    <span className="font-semibold">
                      × {quantity}
                    </span>
                  </div>

                  <div className="border-t border-white/10 mt-4 pt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-gray-500">
                        TOTAL
                      </p>
                      <p className="text-3xl font-black mt-1">
                        ₹{total}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 px-2.5 py-1 rounded-full text-[11px] font-bold">
                        <Check size={12} />
                        Great choice!
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="px-5 sm:px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">Quantity</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        How many pizzas?
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((prev) => Math.max(1, prev - 1))
                        }
                        className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 transition"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="w-9 text-center font-black">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((prev) => prev + 1)
                        }
                        className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Trust */}
                <div className="px-5 sm:px-6 pb-6">
                  <div className="grid grid-cols-3 gap-2">
                    <TrustItem
                      icon={<Clock3 size={15} />}
                      text="30 Min"
                    />
                    <TrustItem
                      icon={<ShieldCheck size={15} />}
                      text="Secure"
                    />
                    <TrustItem
                      icon={<Leaf size={15} />}
                      text="Fresh"
                    />
                  </div>
                </div>
              </div>

              {/* Offer Card */}
              <div className="mt-4 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-4 text-white shadow-lg shadow-red-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                    <Flame size={20} />
                  </div>

                  <div>
                    <p className="font-black text-sm">
                      First order special!
                    </p>
                    <p className="text-xs text-white/80 mt-0.5">
                      Get 20% OFF your first PizzaHub order.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Bottom Trust Section */}
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="grid sm:grid-cols-3 gap-5">
              <BottomFeature
                icon={<Utensils size={20} />}
                title="Made Fresh"
                text="Prepared after you order"
              />

              <BottomFeature
                icon={<Clock3 size={20} />}
                title="Fast Delivery"
                text="Hot pizza at your doorstep"
              />

              <BottomFeature
                icon={<ShieldCheck size={20} />}
                title="Safe & Secure"
                text="Easy and secure checkout"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

/* ---------------- Selection Step ---------------- */

function SelectionStep({ items, selected, onSelect }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {items.map((item) => {
        const active = selected?.name === item.name;

        return (
          <button
            type="button"
            key={item.name}
            onClick={() => onSelect(item)}
            className={`relative group text-left rounded-2xl border-2 p-4 sm:p-5 transition-all duration-200 ${
              active
                ? "border-red-600 bg-red-50 shadow-md shadow-red-100"
                : "border-gray-100 bg-white hover:border-orange-200 hover:shadow-md"
            }`}
          >
            {item.popular && (
              <span className="absolute -top-2.5 left-4 bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                Popular
              </span>
            )}

            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-3xl transition ${
                  active
                    ? "bg-white shadow-sm"
                    : "bg-gray-50 group-hover:bg-orange-50"
                }`}
              >
                {item.icon}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-black text-gray-900">
                  {item.name}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {item.description}
                </p>

                <p
                  className={`text-sm font-extrabold mt-2 ${
                    item.price === 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {item.price === 0
                    ? "Included"
                    : `+ ₹${item.price}`}
                </p>
              </div>

              <div
                className={`w-7 h-7 shrink-0 rounded-full border-2 flex items-center justify-center transition ${
                  active
                    ? "border-red-600 bg-red-600"
                    : "border-gray-200 group-hover:border-red-300"
                }`}
              >
                {active && (
                  <Check
                    size={15}
                    strokeWidth={3}
                    className="text-white"
                  />
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Vegetable Step ---------------- */

function VegetableStep({
  vegetables,
  selected,
  onToggle,
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
        <Leaf size={18} className="text-green-600" />

        <p className="text-sm font-semibold text-green-800">
          Add as many fresh toppings as you want.
        </p>

        <span className="ml-auto text-xs font-black text-green-600">
          {selected.length} selected
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {vegetables.map((item) => {
          const active = selected.some(
            (vegetable) => vegetable.name === item.name
          );

          return (
            <button
              type="button"
              key={item.name}
              onClick={() => onToggle(item)}
              className={`relative p-4 rounded-2xl border-2 text-center transition-all ${
                active
                  ? "border-green-500 bg-green-50 shadow-md shadow-green-100"
                  : "border-gray-100 hover:border-green-200 hover:bg-green-50/40"
              }`}
            >
              {active && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}

              <div className="text-3xl">{item.icon}</div>

              <p className="font-bold text-sm mt-2">
                {item.name}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                + ₹{item.price}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Small Components ---------------- */

function IngredientPill({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1.5 text-[11px] text-gray-300">
      <span>{icon}</span>
      {text}
    </span>
  );
}

function TrustItem({ icon, text }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-300">
      {icon}
      {text}
    </div>
  );
}

function BottomFeature({ icon, title, text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 shrink-0 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
        {icon}
      </div>

      <div>
        <p className="font-black text-gray-900 text-sm">
          {title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {text}
        </p>
      </div>
    </div>
  );
}