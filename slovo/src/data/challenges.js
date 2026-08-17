/* Три пари. key совпадает с challenge_key в базе. */
import { Globe, Palette, Swords } from "lucide-react";

export const CHALLENGES = [
  {
    key: "country",
    n: 1,
    title: "Страна",
    icon: Globe,
    tagline: "Стать настоящим экспертом по культуре, истории и языку выбранной страны.",
    choiceLabel: "Какую страну выбираешь?",
    choicePlaceholder: "Например: Япония",
    goalPlaceholder: "10-минутный рассказ, после которого захочется туда поехать…",
  },
  {
    key: "craft",
    n: 2,
    title: "Творчество",
    icon: Palette,
    tagline: "Довести до конца одну оригинальную работу в новом для себя виде творчества. Без нейросетей.",
    choiceLabel: "Какой вид творчества?",
    choicePlaceholder: "Например: масляная живопись",
    goalPlaceholder: "Что создашь и как это должно тронуть людей…",
  },
  {
    key: "flaw",
    n: 3,
    title: "Недостаток",
    icon: Swords,
    tagline: "Честно назвать свой главный недостаток и полгода осознанно с ним воевать.",
    choiceLabel: "С каким недостатком воюешь?",
    choicePlaceholder: "Например: прокрастинация",
    goalPlaceholder: "Как поймёшь, что изменился; что конкретно перестанешь делать…",
  },
];

export const CHALLENGE_BY_KEY = Object.fromEntries(CHALLENGES.map((c) => [c.key, c]));
