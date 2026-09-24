import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getIngredients } from "../services/api";

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

/* =========================================================
   CONSTANTS
========================================================= */

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 20;

const steps = [
  {
    number: 1,
    title: "Base",
    icon: "🍕",
  },
  {
    number: 2,
    title: "Sauce",
    icon: "🍅",
  },
  {
    number: 3,
    title: "Cheese",
    icon: "🧀",
  },
  {
    number: 4,
    title: "Toppings",
    icon: "🌿",
  },
];

/* =========================================================
   HELPERS
========================================================= */

const getPrice = (item) => {
  const price = Number(item?.price);

  return Number.isFinite(price) && price >= 0 ? price : 0;
};

const isAvailable = (item) => {
  return item && item.isAvailable !== false;
};

const itemStillExists = (item, list) => {
  if (!item?._id) return false;

  return list.some(
    (availableItem) => availableItem._id === item._id
  );
};

/* =========================================================
   COMPONENT
========================================================= */

export default function PizzaBuilder() {
  const navigate = useNavigate();
  const location = useLocation();

  /* -------------------------------------------------------
     Pizza selected from Dashboard / PizzaCard
  ------------------------------------------------------- */

  const selectedPizza = location.state?.pizza || null;

  /* -------------------------------------------------------
     Step
  ------------------------------------------------------- */

  const [step, setStep] = useState(1);

  /* -------------------------------------------------------
     Ingredients
  ------------------------------------------------------- */

  const [ingredients, setIngredients] = useState({
    base: [],
    sauce: [],
    cheese: [],
    topping: [],
  });

  /* -------------------------------------------------------
     Loading / Error
  ------------------------------------------------------- */

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* -------------------------------------------------------
     Pizza selection
  ------------------------------------------------------- */

  const [pizza, setPizza] = useState({
    base: null,
    sauce: null,
    cheese: null,
    vegetables: [],
  });

  /* -------------------------------------------------------
     Quantity
  ------------------------------------------------------- */

  const [quantity, setQuantity] = useState(1);

  /* -------------------------------------------------------
     Validation
  ------------------------------------------------------- */

  const [validationError, setValidationError] = useState("");

/* =========================================================
   FETCH INGREDIENTS
========================================================= */

useEffect(() => {
  let isMounted = true;

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getIngredients();

      const list = Array.isArray(
        response?.data?.ingredients
      )
        ? response.data.ingredients
        : [];

      if (!isMounted) return;

      setIngredients({
        base: list.filter(
          (item) =>
            item.type === "base" &&
            item.isAvailable !== false
        ),

        sauce: list.filter(
          (item) =>
            item.type === "sauce" &&
            item.isAvailable !== false
        ),

        cheese: list.filter(
          (item) =>
            item.type === "cheese" &&
            item.isAvailable !== false
        ),

        topping: list.filter(
          (item) =>
            item.type === "topping" &&
            item.isAvailable !== false
        ),
      });
    } catch (err) {
      console.error(
        "Ingredient fetch error:",
        err
      );

      if (!isMounted) return;

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load pizza ingredients. Please check your backend connection."
      );
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchIngredients();

  return () => {
    isMounted = false;
  };
}, []);

  /* =========================================================
     SET DEFAULT INGREDIENTS
  ========================================================= */

  useEffect(() => {
    if (loading) return;

    setPizza((prev) => {
      const baseStillValid = itemStillExists(
        prev.base,
        ingredients.base
      );

      const sauceStillValid = itemStillExists(
        prev.sauce,
        ingredients.sauce
      );

      const cheeseStillValid = itemStillExists(
        prev.cheese,
        ingredients.cheese
      );

      const validToppings = prev.vegetables.filter(
        (item) => itemStillExists(item, ingredients.topping)
      );

      return {
        ...prev,

        base: baseStillValid
          ? prev.base
          : ingredients.base[0] || null,

        sauce: sauceStillValid
          ? prev.sauce
          : ingredients.sauce[0] || null,

        cheese: cheeseStillValid
          ? prev.cheese
          : ingredients.cheese[0] || null,

        vegetables: validToppings,
      };
    });
  }, [loading, ingredients]);

  /* =========================================================
     SELECT SINGLE INGREDIENT
  ========================================================= */

  const selectSingle = (type, item) => {
    if (!item || !isAvailable(item)) return;

    setValidationError("");

    setPizza((prev) => ({
      ...prev,
      [type]: item,
    }));
  };

  /* =========================================================
     TOGGLE TOPPING
  ========================================================= */

  const toggleVegetable = (item) => {
    if (!item || !isAvailable(item)) return;

    setValidationError("");

    setPizza((prev) => {
      const exists = prev.vegetables.some(
        (vegetable) => vegetable._id === item._id
      );

      if (exists) {
        return {
          ...prev,
          vegetables: prev.vegetables.filter(
            (vegetable) => vegetable._id !== item._id
          ),
        };
      }

      return {
        ...prev,
        vegetables: [...prev.vegetables, item],
      };
    });
  };

/* =========================================================
   PRICE CALCULATION
========================================================= */

  const singlePizzaPrice = useMemo(() => {
  const basePrice = getPrice(pizza.base);
  const saucePrice = getPrice(pizza.sauce);
  const cheesePrice = getPrice(pizza.cheese);

  const toppingsPrice = pizza.vegetables.reduce(
    (sum, item) => sum + getPrice(item),
    0
  );

  return (
    basePrice +
    saucePrice +
    cheesePrice +
    toppingsPrice
  );
}, [pizza]);

const total = useMemo(() => {
  return singlePizzaPrice * quantity;
}, [singlePizzaPrice, quantity]);

  /* =========================================================
     STEP TITLE
  ========================================================= */

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Choose Your Pizza Base";

      case 2:
        return "Pick Your Favourite Sauce";

      case 3:
        return "Make It Extra Cheesy";

      case 4:
        return "Load It With Toppings";

      default:
        return "Customize Your Pizza";
    }
  };

  /* =========================================================
     STEP SUBTITLE
  ========================================================= */

  const getStepSubtitle = () => {
    switch (step) {
      case 1:
        return "Start with the perfect crust for your dream pizza.";

      case 2:
        return "Choose the flavour that makes every bite delicious.";

      case 3:
        return "Because there is no such thing as too much cheese.";

      case 4:
        return "Add fresh toppings and make your pizza truly yours.";

      default:
        return "Customize every delicious layer exactly the way you like.";
    }
  };

  /* =========================================================
     VALIDATE CURRENT STEP
  ========================================================= */

  const validateStep = () => {
    setValidationError("");

    if (step === 1) {
      if (!pizza.base) {
        setValidationError(
          "Please select a pizza base before continuing."
        );

        return false;
      }

      if (!isAvailable(pizza.base)) {
        setValidationError(
          "Selected pizza base is no longer available."
        );

        return false;
      }
    }

    if (step === 2) {
      if (!pizza.sauce) {
        setValidationError(
          "Please select a sauce before continuing."
        );

        return false;
      }

      if (!isAvailable(pizza.sauce)) {
        setValidationError(
          "Selected sauce is no longer available."
        );

        return false;
      }
    }

    if (step === 3) {
      if (!pizza.cheese) {
        setValidationError(
          "Please select a cheese option before continuing."
        );

        return false;
      }

      if (!isAvailable(pizza.cheese)) {
        setValidationError(
          "Selected cheese is no longer available."
        );

        return false;
      }
    }

    if (step === 4) {
      const unavailableTopping = pizza.vegetables.find(
        (item) => !isAvailable(item)
      );

      if (unavailableTopping) {
        setValidationError(
          `${unavailableTopping.name} is no longer available.`
        );

        return false;
      }
    }

    return true;
  };

  /* =========================================================
     NEXT STEP
  ========================================================= */

  const nextStep = () => {
    if (!validateStep()) return;

    if (step < 4) {
      setStep((prev) => prev + 1);
      return;
    }

    /*
      Clean order payload.
      Only send required information to Order Summary.
    */

    const orderPizza = {
      base: pizza.base,
      sauce: pizza.sauce,
      cheese: pizza.cheese,
      vegetables: pizza.vegetables,
    };

    navigate("/order-summary", {
      state: {
        pizza: orderPizza,
        total,
        quantity,
        singlePizzaPrice,
        selectedPizza,
      },
    });
  };

  /* =========================================================
     PREVIOUS STEP
  ========================================================= */

  const previousStep = () => {
    setValidationError("");

    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  /* =========================================================
     QUANTITY
  ========================================================= */

  const decreaseQuantity = () => {
    setQuantity((prev) =>
      Math.max(MIN_QUANTITY, prev - 1)
    );
  };

  const increaseQuantity = () => {
    setQuantity((prev) =>
      Math.min(MAX_QUANTITY, prev + 1)
    );
  };

  /* =========================================================
     RETRY
  ========================================================= */

  const retryIngredients = () => {
    window.location.reload();
  };

  /* =========================================================
     LOADING SCREEN
  ========================================================= */

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gradient-to-b from-orange-50/60 via-white to-gray-50 flex items-center justify-center px-5">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mx-auto" />

            <h2 className="text-xl font-black text-gray-900 mt-6">
              Preparing Pizza Builder
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Loading fresh ingredients...
            </p>
          </div>
        </main>
      </>
    );
  }

  /* =========================================================
     ERROR SCREEN
  ========================================================= */

  if (error) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gradient-to-b from-orange-50/60 via-white to-gray-50 flex items-center justify-center px-5">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 text-center max-w-md w-full">
            <div className="text-6xl">🍕</div>

            <h2 className="text-2xl font-black text-gray-900 mt-5">
              Ingredients Not Available
            </h2>

            <p className="text-gray-500 text-sm mt-3 leading-6">
              {error}
            </p>

            <button
              type="button"
              onClick={retryIngredients}
              className="mt-6 bg-red-600 text-white px-6 py-3 rounded-xl font-black hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        </main>
      </>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-orange-50/60 via-white to-gray-50 pb-14">

        {/* =================================================
            TOP OFFER STRIP
        ================================================= */}

        <div className="bg-gray-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold">
            <Flame
              size={16}
              className="text-orange-400"
            />

            <span>
              Build your dream pizza & get FREE
              delivery today!
            </span>

            <Sparkles
              size={15}
              className="text-yellow-400"
            />
          </div>
        </div>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold text-sm transition"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="text-center max-w-3xl mx-auto mt-5">

            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider">
              <ChefHat size={16} />
              Pizza Builder
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 mt-4 tracking-tight">
              Create Your{" "}
              <span className="text-red-600">
                Perfect Pizza
              </span>
            </h1>

            <p className="text-gray-500 mt-3 text-sm sm:text-base">
              Your pizza. Your rules. Your flavour.
              <br className="hidden sm:block" />
              Customize every delicious layer exactly
              the way you like.
            </p>
          </div>

          {/* =================================================
              PROGRESS
          ================================================= */}

          <div className="mt-8 mb-8">
            <StepIndicator currentStep={step} />
          </div>

          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div className="grid lg:grid-cols-[minmax(0,1fr)_370px] gap-7 items-start">

            {/* =================================================
                BUILDER SECTION
            ================================================= */}

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

                {/* Validation Error */}

                {validationError && (
                  <div
                    role="alert"
                    className="mb-5 flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3"
                  >
                    <span className="text-lg">⚠️</span>

                    <p className="text-sm font-semibold">
                      {validationError}
                    </p>
                  </div>
                )}

                {/* BASE */}

                {step === 1 && (
                  ingredients.base.length > 0 ? (
                    <SelectionStep
                      items={ingredients.base}
                      selected={pizza.base}
                      onSelect={(item) =>
                        selectSingle("base", item)
                      }
                    />
                  ) : (
                    <EmptyOptions text="No pizza bases available." />
                  )
                )}

                {/* SAUCE */}

                {step === 2 && (
                  ingredients.sauce.length > 0 ? (
                    <SelectionStep
                      items={ingredients.sauce}
                      selected={pizza.sauce}
                      onSelect={(item) =>
                        selectSingle("sauce", item)
                      }
                    />
                  ) : (
                    <EmptyOptions text="No sauces available." />
                  )
                )}

                {/* CHEESE */}

                {step === 3 && (
                  ingredients.cheese.length > 0 ? (
                    <SelectionStep
                      items={ingredients.cheese}
                      selected={pizza.cheese}
                      onSelect={(item) =>
                        selectSingle("cheese", item)
                      }
                    />
                  ) : (
                    <EmptyOptions text="No cheese options available." />
                  )
                )}

                {/* TOPPINGS */}

                {step === 4 && (
                  ingredients.topping.length > 0 ? (
                    <VegetableStep
                      vegetables={ingredients.topping}
                      selected={pizza.vegetables}
                      onToggle={toggleVegetable}
                    />
                  ) : (
                    <EmptyOptions text="No toppings available." />
                  )
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
                      {step === 4
                        ? "Review & Order"
                        : "Continue"}
                    </span>

                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </section>

            {/* =================================================
                PREVIEW
            ================================================= */}

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
                        {selectedPizza?.name ||
                          "Custom Pizza"}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full text-xs font-bold">
                      <Star
                        size={13}
                        className="fill-yellow-400 text-yellow-400"
                      />

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

                    {pizza.base && (
                      <IngredientPill
                        icon={pizza.base.icon || "🍕"}
                        text={pizza.base.name}
                      />
                    )}

                    {pizza.sauce && (
                      <IngredientPill
                        icon={pizza.sauce.icon || "🍅"}
                        text={pizza.sauce.name}
                      />
                    )}

                    {pizza.cheese && (
                      <IngredientPill
                        icon={pizza.cheese.icon || "🧀"}
                        text={pizza.cheese.name}
                      />
                    )}

                    {pizza.vegetables.map((item) => (
                      <IngredientPill
                        key={item._id}
                        icon={item.icon || "🌿"}
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
                      <p className="font-bold">
                        Quantity
                      </p>

                      <p className="text-xs text-gray-500 mt-0.5">
                        How many pizzas?
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1">

                      <button
                        type="button"
                        onClick={decreaseQuantity}
                        disabled={quantity <= MIN_QUANTITY}
                        aria-label="Decrease quantity"
                        className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="w-9 text-center font-black">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={increaseQuantity}
                        disabled={quantity >= MAX_QUANTITY}
                        aria-label="Increase quantity"
                        className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} />
                      </button>

                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 text-right mt-2">
                    Maximum {MAX_QUANTITY} pizzas
                  </p>

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

          {/* =================================================
              BOTTOM TRUST SECTION
          ================================================= */}

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

/* =========================================================
   SELECTION STEP
========================================================= */

function SelectionStep({
  items,
  selected,
  onSelect,
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">

      {items.map((item) => {

        const active =
          selected?._id === item._id;

        return (
          <button
            type="button"
            key={item._id}
            onClick={() => onSelect(item)}
            disabled={!isAvailable(item)}
            className={`relative group text-left rounded-2xl border-2 p-4 sm:p-5 transition-all duration-200 ${
              active
                ? "border-red-600 bg-red-50 shadow-md shadow-red-100"
                : "border-gray-100 bg-white hover:border-orange-200 hover:shadow-md"
            } ${
              !isAvailable(item)
                ? "opacity-50 cursor-not-allowed"
                : ""
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
                {item.icon || "🍕"}
              </div>

              <div className="min-w-0 flex-1">

                <p className="font-black text-gray-900">
                  {item.name}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {item.description ||
                    "Fresh and delicious choice for your pizza."}
                </p>

                <p
                  className={`text-sm font-extrabold mt-2 ${
                    getPrice(item) === 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {getPrice(item) === 0
                    ? "Included"
                    : `+ ₹${getPrice(item)}`}
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

/* =========================================================
   TOPPING STEP
========================================================= */

function VegetableStep({
  vegetables,
  selected,
  onToggle,
}) {
  return (
    <div>

      <div className="flex items-center gap-2 mb-5 bg-green-50 border border-green-100 rounded-xl px-4 py-3">

        <Leaf
          size={18}
          className="text-green-600"
        />

        <p className="text-sm font-semibold text-green-800">
          Add as many fresh toppings as you want.
        </p>

        <span className="ml-auto text-xs font-black text-green-600">
          {selected.length} selected
        </span>

      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

        {vegetables.map((item) => {

          const active =
            selected.some(
              (vegetable) =>
                vegetable._id === item._id
            );

          return (
            <button
              type="button"
              key={item._id}
              onClick={() => onToggle(item)}
              disabled={!isAvailable(item)}
              className={`relative p-4 rounded-2xl border-2 text-center transition-all ${
                active
                  ? "border-green-500 bg-green-50 shadow-md shadow-green-100"
                  : "border-gray-100 hover:border-green-200 hover:bg-green-50/40"
              } ${
                !isAvailable(item)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >

              {active && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Check
                    size={12}
                    strokeWidth={3}
                  />
                </div>
              )}

              <div className="text-3xl">
                {item.icon || "🌿"}
              </div>

              <p className="font-bold text-sm mt-2">
                {item.name}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                + ₹{getPrice(item)}
              </p>

            </button>
          );
        })}

      </div>
    </div>
  );
}

/* =========================================================
   EMPTY OPTIONS
========================================================= */

function EmptyOptions({ text }) {
  return (
    <div className="py-14 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">

      <div className="text-5xl">
        🍕
      </div>

      <p className="font-black text-gray-800 mt-4">
        No options available
      </p>

      <p className="text-sm text-gray-500 mt-1">
        {text}
      </p>

    </div>
  );
}

/* =========================================================
   INGREDIENT PILL
========================================================= */

function IngredientPill({
  icon,
  text,
}) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1.5 text-[11px] text-gray-300">
      <span>{icon}</span>
      {text}
    </span>
  );
}

/* =========================================================
   TRUST ITEM
========================================================= */

function TrustItem({
  icon,
  text,
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-300">
      {icon}
      {text}
    </div>
  );
}

/* =========================================================
   BOTTOM FEATURE
========================================================= */

function BottomFeature({
  icon,
  title,
  text,
}) {
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