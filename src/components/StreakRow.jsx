/* Строка списка на вкладке «Серии»: только название, покрашенное по типу
   (грехи — красным, благие дела — зелёным). Без цифр. */
export default function StreakRow({ T, name, color }) {
  return (
    <div
      style={{
        background: `${color}14`,
        border: `1px solid ${color}55`,
        borderLeft: `3px solid ${color}`,
        borderRadius: T.radius,
      }}
      className="flex items-center px-3 py-2.5"
    >
      <span style={{ width: 7, height: 7, background: color, borderRadius: 999 }} className="mr-2.5 shrink-0" />
      <span style={{ color: T.text }} className="text-sm">{name}</span>
    </div>
  );
}
