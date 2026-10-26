/** Common kitchen swaps shown on meal detail with full Persian localization support. */
const PAIRS = [
  {
    match: /butter/i,
    match_fa: /کره/i,
    name_fa: "کره",
    swap: "Olive oil or ghee",
    swap_fa: "روغن زیتون یا روغن حیوانی",
    note: "Use a little less oil",
    note_fa: "مقدار روغن را کمی کمتر کنید",
  },
  {
    match: /milk(?!\s*chocolate)/i,
    match_fa: /شیر/i,
    name_fa: "شیر",
    swap: "Oat or almond milk",
    swap_fa: "شیر جو دوسر یا شیر بادام",
    note: "Works in most cooking",
    note_fa: "برای اکثر دستورهای پخت مناسب است",
  },
  {
    match: /cream/i,
    match_fa: /خامه/i,
    name_fa: "خامه",
    swap: "Coconut cream or Greek yogurt",
    swap_fa: "خامه نارگیل یا ماست یونانی",
    note: "Yogurt off heat",
    note_fa: "ماست را پس از خاموش کردن شعله اضافه کنید",
  },
  {
    match: /egg/i,
    match_fa: /تخم[\s‌-]*مرغ/i,
    name_fa: "تخم‌مرغ",
    swap: "Flax egg (1 tbsp flax + 3 tbsp water)",
    swap_fa: "تخم کتان (۱ قاشق کتان + ۳ قاشق آب)",
    note: "Best for baking",
    note_fa: "بهترین گزینه برای کیک و شیرینی‌پزی",
  },
  {
    match: /chicken/i,
    match_fa: /مرغ/i,
    name_fa: "مرغ",
    swap: "Turkey, tofu, or chickpeas",
    swap_fa: "بوقلمون، توفو یا نخود",
    note: "Adjust cook time",
    note_fa: "زمان پخت را متناسب با جایگزین تنظیم کنید",
  },
  {
    match: /beef/i,
    match_fa: /گوشت|گوساله/i,
    name_fa: "گوشت گوساله",
    swap: "Lamb, mushrooms, or lentils",
    swap_fa: "گوشت گوسفندی، قارچ یا عدس",
    note: "Season boldly",
    note_fa: "ادویه‌جات را سخاوتمندانه استفاده کنید",
  },
  {
    match: /pork/i,
    match_fa: /خوک/i,
    name_fa: "گوشت",
    swap: "Chicken thighs or jackfruit",
    swap_fa: "ران مرغ یا گوشت بوقلمون",
    note: "Similar richness",
    note_fa: "بافت و لطافت مشابهی ایجاد می‌کند",
  },
  {
    match: /fish|salmon|cod|shrimp/i,
    match_fa: /ماهی|سالمون|میگو/i,
    name_fa: "ماهی یا میگو",
    swap: "Another firm white fish or tofu",
    swap_fa: "نوع دیگری از ماهی یا توفو",
    note: "Watch timing",
    note_fa: "به زمان پخت دقت فرمایید",
  },
  {
    match: /flour/i,
    match_fa: /آرد/i,
    name_fa: "آرد گندم",
    swap: "Gluten-free blend 1:1",
    swap_fa: "ترکیب آرد بدون گلوتن ۱ به ۱",
    note: "Or almond flour in some bakes",
    note_fa: "یا آرد بادام در برخی شیرینی‌ها",
  },
  {
    match: /pasta/i,
    match_fa: /پاستا|ماکارونی/i,
    name_fa: "پاستا",
    swap: "Rice noodles or zucchini ribbons",
    swap_fa: "نودل برنج یا کدو سبز نواری",
    note: "Sauce still shines",
    note_fa: "طعم و عطر سس به خوبی حفظ می‌شود",
  },
  {
    match: /rice/i,
    match_fa: /برنج/i,
    name_fa: "برنج",
    swap: "Quinoa, couscous, or cauliflower rice",
    swap_fa: "کینوا، بلغور یا برنج گل کلم",
    note: "Change texture",
    note_fa: "بافت غذا تغییر می‌کند و سبک‌تر است",
  },
  {
    match: /sugar/i,
    match_fa: /شکر/i,
    name_fa: "شکر",
    swap: "Honey or maple syrup",
    swap_fa: "عسل یا شیره افرا",
    note: "Reduce liquid slightly",
    note_fa: "مقدار مایعات غذا را کمی کاهش دهید",
  },
  {
    match: /soy sauce/i,
    match_fa: /سویا سس|سس سویا/i,
    name_fa: "سس سویا",
    swap: "Tamari or coconut aminos",
    swap_fa: "تاماری یا آمینوی نارگیل",
    note: "Gluten-free friendly",
    note_fa: "گزینه‌ای عالی برای رژیم بدون گلوتن",
  },
  {
    match: /cheese|mozzarella|parmesan|cheddar/i,
    match_fa: /پنیر/i,
    name_fa: "پنیر",
    swap: "Nutritional yeast or dairy-free cheese",
    swap_fa: "مخمر تغذیه‌ای یا پنیر گیاهی",
    note: "Salt to taste",
    note_fa: "میزان نمک را طبق ذائقه تنظیم کنید",
  },
  {
    match: /yogurt/i,
    match_fa: /ماست/i,
    name_fa: "ماست",
    swap: "Coconut yogurt or sour cream",
    swap_fa: "ماست نارگیل یا خامه ترش",
    note: "Check sweetness",
    note_fa: "میزان ترشی یا شیرینی آن را بسنجید",
  },
  {
    match: /tomato/i,
    match_fa: /گوجه/i,
    name_fa: "گوجه‌فرنگی",
    swap: "Roasted red peppers or passata",
    swap_fa: "فلفل قرمز کبابی یا پوره گوجه",
    note: "Similar body",
    note_fa: "غلظت و بافت مشابهی می‌دهد",
  },
  {
    match: /onion/i,
    match_fa: /پیاز/i,
    name_fa: "پیاز",
    swap: "Shallots or leeks",
    swap_fa: "موسیر یا تره‌فرنگی",
    note: "Gentler flavor",
    note_fa: "طعم ملایم‌تر و دلنشین‌تری دارد",
  },
  {
    match: /garlic/i,
    match_fa: /سیر/i,
    name_fa: "سیر",
    swap: "Garlic powder or asafoetida",
    swap_fa: "پودر سیر یا موسیر خشک",
    note: "Use sparingly",
    note_fa: "به مقدار کم استفاده شود",
  },
  {
    match: /lemon/i,
    match_fa: /لیمو/i,
    name_fa: "لیموترش",
    swap: "Lime or white wine vinegar",
    swap_fa: "لیموترش سبز یا سرکه سفید",
    note: "Bright acidity",
    note_fa: "ترشی تازه و شفاف ایجاد می‌کند",
  },
  {
    match: /bread/i,
    match_fa: /نان/i,
    name_fa: "نان",
    swap: "Tortillas or lettuce wraps",
    swap_fa: "نان تورتیلا یا برگ کاهو",
    note: "For sandwiches",
    note_fa: "مناسب برای ساندویچ و رپ‌های رژیمی",
  },
];

export function getSubstitutions(
  ingredients = [],
  limit = 5,
  language = "en",
  localizedIngredients = [],
) {
  const isPersian = language === "fa";
  const found = [];
  const seen = new Set();

  ingredients.forEach((line, idx) => {
    for (const pair of PAIRS) {
      const isMatched =
        pair.match.test(line) ||
        (pair.match_fa && isPersian && pair.match_fa.test(line)) ||
        (pair.match_fa &&
          localizedIngredients[idx] &&
          pair.match_fa.test(localizedIngredients[idx]));

      if (!isMatched) continue;

      const key = pair.swap;
      if (seen.has(key)) continue;
      seen.add(key);

      const original = isPersian
        ? pair.name_fa || localizedIngredients[idx] || line
        : line;

      found.push({
        original,
        swap: isPersian ? pair.swap_fa || pair.swap : pair.swap,
        note: isPersian ? pair.note_fa || pair.note : pair.note,
      });
      break;
    }
  });

  return found.slice(0, limit);
}
