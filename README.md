# Support Teacher App

Replaces an Excel attendance/homework sheet for one support teacher. See
`/docs` (or the planning doc you already have) for full architecture.

## Status: All 3 phases complete

- [x] Project scaffold (Vite + React 19 + TypeScript + Tailwind v4)
- [x] Supabase client, full schema + RLS migration
- [x] Auth (login, session persistence, protected routes)
- [x] Dashboard: Month selector, Date selector, Group list
- [x] Group Page: back button, group name, Attendance/Homework tabs
- [x] Attendance: segmented control (Present/Absent/Reason), auto-save on tap, optimistic + rollback on failure
- [x] Homework: numeric input (0–100 integers only), save on Enter/blur, empty ≠ 0, clearing a field deletes the record
- [x] Manage Students: add / edit (name, group status) / delete, as a simple centered modal — no drawers
- [x] Error handling, loading states, and empty states on every data view
- [x] Zero TypeScript errors, production build verified

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a Supabase project** at supabase.com, then run the migrations in
   `supabase/migrations/` in order, either via the SQL editor in the Supabase
   dashboard or the Supabase CLI:
   ```bash
   supabase db push
   ```
   `0002_seed_groups.sql` seeds example groups — edit the names first to match
   your real groups.

3. **Create your teacher login.** In the Supabase dashboard, go to
   Authentication → Users → Add User, and create the one account you'll use
   to log in. There is no public sign-up flow — this app has exactly one user.

4. **Environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your
   Supabase project's API settings.

5. **Run it**
   ```bash
   npm run dev
   ```

## What works

Log in → land on the Dashboard, defaulted to the current month and today's
date → pick a different month/date if needed (date choices never go past
today) → tap a group → mark attendance (tap Present/Absent/Reason — saves
immediately, no save button) → switch to the Homework tab (type a score,
press Enter or tab away — saves immediately, no debounce) → tap "Manage
students" to add, edit, or delete students in this group.

**Attendance:** exactly one of Present/Absent/Reason per student per day.
Re-tapping the already-selected option does nothing (nothing changed). A
failed save rolls the row back and shows "Not saved — tap to retry."

**Homework:** any integer 0–100. Letters, symbols, decimals, negatives, and
values over 100 are rejected as you type, not after submitting. An empty
field means "not graded yet" — it is never treated as a score of 0, and
clearing a field that had a score deletes that record rather than saving 0.

**Students:** "Manage students" opens a centered modal (not a drawer) with
the full roster for that group, an inline add form, and per-student
Edit/Delete. Edits require pressing Save (deliberate, unlike the
auto-saving Attendance/Homework fields). Delete requires an inline
confirmation and is a permanent, cascading delete — it also removes that
student's attendance and homework history. Deactivating a student (via
Edit → Status → Inactive) is the routine way to remove them from the
active roster while keeping their history intact; use Delete only for
genuine mistakes (e.g. a duplicate or misspelled entry added by accident).

Refreshing mid-navigation, or hitting the back button, preserves the
month/date/group/tab you were on.
