'use client';

import { useQuery } from '@tanstack/react-query';
import { type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';

interface BracketInfo {
  id: string;
  label: string;
  capacity: number;
  remaining: number;
}

interface BracketsResponse {
  tournament: { name: string; dateLabel: string; venue: string; eventUrl: string };
  brackets: BracketInfo[];
}

interface ArenaSnake {
  id: string;
  name: string;
}

type Field = 'bracket' | 'username' | 'snake' | 'form';

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
  const { data, isError, refetch } = useQuery({
    queryKey: ['battlesnake-brackets'],
    queryFn: async (): Promise<BracketsResponse> => {
      const res = await fetch('/api/battlesnake/register');
      if (!res.ok) throw new Error('Failed to load brackets');
      return res.json();
    },
  });

  const [bracket, setBracket] = useState('');
  const [username, setUsername] = useState('');
  const [snakes, setSnakes] = useState<ArenaSnake[] | null>(null);
  const [snakeId, setSnakeId] = useState('');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [loadingSnakes, setLoadingSnakes] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const findSnakes = async () => {
    if (!username.trim()) return;
    setLoadingSnakes(true);
    setErrors({});
    try {
      const res = await fetch(`/api/battlesnake/snakes?username=${encodeURIComponent(username)}`);
      const result = await res.json();
      if (!result.ok) {
        setSnakes(null);
        setErrors({ username: result.error });
        return;
      }
      setUsername(result.username);
      setSnakes(result.snakes);
      setSnakeId(result.snakes.length === 1 ? result.snakes[0].id : '');
      if (!result.snakes.length) {
        setErrors({
          snake: `${result.username} has no public snakes yet. Create one on arena.battlesnake.com (it doesn't need to work yet), then find your snakes again.`,
        });
      }
    } catch {
      setErrors({ username: "We couldn't reach Battlesnake. Try again in a minute." });
    } finally {
      setLoadingSnakes(false);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!snakes) return findSnakes();
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch('/api/battlesnake/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bracket, username, snake: snakeId }),
      });
      const result = await res.json();
      if (result.ok) {
        window.location.assign(result.checkoutUrl);
        return;
      }
      setErrors({ [result.field]: result.error });
      refetch();
    } catch {
      setErrors({ form: 'Something went wrong. Try again in a minute.' });
    }
    setSubmitting(false);
  };

  const tournament = data?.tournament;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">
        Register your Battlesnake
      </h1>
      {tournament && (
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {tournament.dateLabel} at {tournament.venue}. Free to compete. Coming to watch?{' '}
          <a className="underline" href={tournament.eventUrl}>
            Get a spectator ticket on Eventbrite
          </a>
          .
        </p>
      )}
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Your snake doesn't need to be ready yet. We just need its name so we can add it to the
        tournament. You'll finish on Eventbrite, which sends your confirmation.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-6" noValidate>
        <fieldset className="space-y-3">
          <legend className="font-semibold">
            1. Pick a bracket
          </legend>
          {isError && <FieldError message="We couldn't load the brackets. Refresh to try again." />}
          {data?.brackets.map((b) => (
            <label
              key={b.id}
              className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 dark:border-gray-700 ${
                b.remaining === 0 ? 'opacity-50' : ''
              }`}
            >
              <input
                type="radio"
                name="bracket"
                value={b.id}
                disabled={b.remaining === 0}
                checked={bracket === b.id}
                onChange={() => {
                  setBracket(b.id);
                  setErrors({});
                }}
                className="mt-1"
              />
              <span>
                <span className="font-medium">{b.label}</span>{' '}
                <span className="text-sm text-gray-500">
                  {b.remaining === 0 ? 'Full' : `${b.remaining} of ${b.capacity} spots left`}
                </span>
                <span className="block text-sm text-gray-500 dark:text-gray-400">
                  {BRACKET_HINTS[b.id]}
                </span>
              </span>
            </label>
          ))}
          <FieldError message={errors.bracket} />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="font-semibold">
            2. Pick your snake
          </legend>
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium">
              Battlesnake username
            </label>
            <div className="flex gap-2">
              <input
                id="username"
                className={inputClass}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setSnakes(null);
                  setSnakeId('');
                }}
                placeholder="As shown on arena.battlesnake.com"
              />
              <Button type="button" variant="outline" onClick={findSnakes} disabled={loadingSnakes}>
                {loadingSnakes ? 'Looking…' : 'Find my snakes'}
              </Button>
            </div>
            <FieldError message={errors.username} />
            <p className="mt-1 text-sm text-gray-500">
              No account yet? Sign up at{' '}
              <a className="underline" href="https://arena.battlesnake.com/">
                arena.battlesnake.com
              </a>{' '}
              and follow the{' '}
              <a className="underline" href="https://docs.battlesnake.com/quickstart">
                quickstart
              </a>
              .
            </p>
          </div>

          {snakes && snakes.length > 0 && (
            <div>
              <label htmlFor="snake" className="mb-1 block text-sm font-medium">
                Snake
              </label>
              <select
                id="snake"
                className={inputClass}
                value={snakeId}
                onChange={(e) => {
                  setSnakeId(e.target.value);
                  setErrors({});
                }}
              >
                <option value="">Choose a snake</option>
                {snakes.map((snake) => (
                  <option key={snake.id} value={snake.id}>
                    {snake.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <FieldError message={errors.snake} />
        </fieldset>

        <FieldError message={errors.form} />
        <Button type="submit" size="lg" disabled={submitting || !bracket || !snakeId}>
          {submitting ? 'Reserving your spot…' : 'Continue to Eventbrite'}
        </Button>
      </form>
    </div>
  );
};
