# Настройка «Слова»: Supabase + Vercel

Пошагово, ~10 минут. Ничего секретного в код не коммитим.

## 1. Проект Supabase

1. Зайдите на **supabase.com** → New project (бесплатный план).
2. Дождитесь, пока проект поднимется.
3. Слева **SQL Editor → New query** → вставьте содержимое `supabase/schema.sql` →
   **Run**. Создадутся таблицы, политики доступа (RLS), функция проверки кода и три
   пари. В конце добавится пример кода приглашения `SLOVO-2026`.
4. (Свой код) В SQL Editor выполните, заменив значение:
   ```sql
   insert into public.invite_codes (code, note) values ('ВАШ-КОД', 'наша группа');
   ```
   Раздайте этот код участникам — по нему они смогут зарегистрироваться.

## 2. Storage (фото профиля и отчётов)

1. Слева **Storage → Create bucket** → имя `avatars`, включите **Public bucket** → Create.
2. Ещё раз: bucket `post-images`, тоже **Public** → Create.
3. Для каждого бакета: вкладка **Policies → New policy → For full customization**,
   роль `authenticated`, операция **INSERT**, условие `true` (или оставьте шаблон
   «Allow authenticated uploads»). Чтение публичное, т.к. бакеты Public.

## 3. Отключить подтверждение email (проще для группы)

**Authentication → Providers → Email** → выключите **Confirm email** → Save.
Тогда после регистрации человек сразу попадает в приложение. (Можно оставить
включённым — тогда нужно подтверждать письмо перед первым входом.)

## 4. Ключи

**Project Settings → API** → скопируйте:
- **Project URL** → это `VITE_SUPABASE_URL`
- **anon public** key → это `VITE_SUPABASE_ANON_KEY`

Ключ `anon public` публичный по дизайну — его безопасно держать во фронтенде,
доступ ограничивают политики RLS. **Service role** ключ НИКОГДА не используем во фронте.

## 5. Локальный запуск (по желанию)

```bash
cd slovo
cp .env.example .env      # впишите два значения из шага 4
npm install
npm run dev               # http://localhost:5173
```

## 6. Деплой на Vercel

1. **Add New → Project** → импорт репозитория `mdvaliev-oss/Iman`.
2. **Root Directory** → выберите папку **`slovo`** (важно!).
3. **Environment Variables** → добавьте `VITE_SUPABASE_URL` и
   `VITE_SUPABASE_ANON_KEY` со значениями из шага 4.
4. **Deploy**. Получите ссылку `slovo-....vercel.app`.

Готово. Первый зашедший регистрируется по коду, заполняет профиль и три пари —
и появляется у остальных в «Участниках».
