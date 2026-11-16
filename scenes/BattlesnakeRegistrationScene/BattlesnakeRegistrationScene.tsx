'use client';

import { useQuery } from '@tanstack/react-query';
import { type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BracketInfo {
  id: string;
  label: string;
  capacity: number;
  remaining: number;
}

interface BracketsResponse {
  tournament: { name: string; dateLabel: string; venue: string };
  brackets: BracketInfo[];
}

type Field = 'name' | 'email' | 'bracket' | 'username' | 'snake' | 'form';

interface Verified {
  username: string;
  snakeName: string;
  snakeUrl: string;
}

const BRACKET_HINTS: Record<string, string> = {
  student: 'Currently enrolled in high school or post-secondary.',
  rookie: 'Your first or second Battlesnake tournament.',
  veteran: 'You have competed before and want the toughest games.',
};

const inputClass =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50';

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-sm text-red-600 dark:text-red-400">{message}</p> : null;

export const BattlesnakeRegistrationScene = () => {
  const { data, refetch } = useQuery({
    queryKey: ['battlesnake-brackets'],
    queryFn: async (): Promise<BracketsResponse> => {
      const res = await fetch('/api/battlesnake/register');
      if (!res.ok) throw new Error('Failed to load brackets');
      return res.json();
    },
  });

  const [form, setForm] = useState({ name: '', email: '', bracket: '', username: '', snake: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [verified, setVerified] = useState<Verified | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ bracket: string; snakeName: string } | null>(null);

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined, form: undefined }));
    if (key === 'username' || key === 'snake') setVerified(null);
  };

  const checkSnake = async () => {
    if (!form.username.trim() || !form.snake.trim()) return;
    setChecking(true);
    try {
      const res = await fetch('/api/battlesnake/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, snake: form.snake }),
      });
      const result = await res.json();
      if (result.ok) {
        setVerified(result.snake);
        setErrors((prev) => ({ ...prev, username: undefined, snake: undefined }));
      } else {
        setVerified(null);
        setErrors((prev) => ({ ...prev, [result.field]: result.error }));
      }
    } finally {
      setChecking(false);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/battlesnake/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (result.ok) {
        const bracket = data?.brackets.find((b) => b.id === form.bracket)?.label ?? form.bracket;
        setDone({ bracket, snakeName: result.registration.snake.snakeName });
      } else {
        setErrors({ [result.field]: result.error });
        refetch();
      }
    } catch {
      setErrors({ form: 'Something went wrong. Try again in a minute.' });
    } finally {
      setSubmitting(false);
    }
  };

  const tournament = data?.tournament;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
        Register your Battlesnake
      </h1>
      {tournament && (
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {tournament.dateLabel} at {tournament.venue}. Free to compete. Coming to watch? Grab a
          spectator spot on Eventbrite instead.
        </p>
      )}

      {done ? (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>You're in!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              {done.snakeName} is registered in the {done.bracket} bracket. Keep your snake's server
              running on game day, and bring a laptop in case you want to tweak it between rounds.
            </p>
            <p>
              Questions or strategy talk? Join #battlesnake in the{' '}
              <a className="underline" href="http://joinslack.hackregina.com/">
                HackRegina Slack
              </a>
              .
            </p>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-6" noValidate>
          <fieldset className="space-y-3">
            <legend className="font-semibold text-gray-900 dark:text-gray-50">Bracket</legend>
            {data?.brackets.map((bracket) => (
              <label
                key={bracket.id}
                className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 dark:border-gray-700 ${
                  bracket.remaining === 0 ? 'opacity-50' : ''
                }`}
              >
                <input
                  type="radio"
                  name="bracket"
                  value={bracket.id}
                  disabled={bracket.remaining === 0}
                  checked={form.bracket === bracket.id}
                  onChange={() => update('bracket', bracket.id)}
                  className="mt-1"
                />
                <span>
                  <span className="font-medium text-gray-900 dark:text-gray-50">
                    {bracket.label}
                  </span>{' '}
                  <span className="text-sm text-gray-500">
                    {bracket.remaining === 0
                      ? 'Full'
                      : `${bracket.remaining} of ${bracket.capacity} spots left`}
                  </span>
                  <span className="block text-sm text-gray-600 dark:text-gray-400">
                    {BRACKET_HINTS[bracket.id]}
                  </span>
                </span>
              </label>
            ))}
            <FieldError message={errors.bracket} />
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Your name
              </label>
              <input
                id="name"
                className={inputClass}
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                autoComplete="name"
              />
              <FieldError message={errors.name} />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                autoComplete="email"
              />
              <FieldError message={errors.email} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="username" className="mb-1 block text-sm font-medium">
                Battlesnake username
              </label>
              <input
                id="username"
                className={inputClass}
                value={form.username}
                onChange={(e) => update('username', e.target.value)}
                onBlur={checkSnake}
                placeholder="As shown on arena.battlesnake.com"
              />
              <FieldError message={errors.username} />
            </div>
            <div>
              <label htmlFor="snake" className="mb-1 block text-sm font-medium">
                Snake name or link
              </label>
              <input
                id="snake"
                className={inputClass}
                value={form.snake}
                onChange={(e) => update('snake', e.target.value)}
                onBlur={checkSnake}
              />
              <FieldError message={errors.snake} />
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            {checking
              ? 'Checking Battlesnake…'
              : verified
                ? `Found ${verified.snakeName} on ${verified.username}'s profile.`
                : 'Your snake must be public on arena.battlesnake.com. No snake yet? The quickstart gets one running in about 5 minutes.'}{' '}
            {!verified && !checking && (
              <a className="underline" href="https://docs.battlesnake.com/quickstart">
                Battlesnake quickstart
              </a>
            )}
          </p>

          <FieldError message={errors.form} />
          <Button type="submit" size="lg" disabled={submitting || !form.bracket}>
            {submitting ? 'Registering…' : 'Register'}
          </Button>
        </form>
      )}
    </div>
  );
};
