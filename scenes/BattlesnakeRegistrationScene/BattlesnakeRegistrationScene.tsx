'use client';

import { useQuery } from '@tanstack/react-query';
import { type FormEvent, type ReactNode, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { EventbriteCheckout } from './EventbriteCheckout';

interface BracketInfo {
  id: string;
  label: string;
  capacity: number;
  remaining: number;
}

interface SpectatorInfo {
  id: string;
  label: string;
  ticketClassName: string;
  remaining: number;
}

interface OptionsResponse {
  tournament: { eventId: string; name: string; dateLabel: string; venue: string; eventUrl: string };
  brackets: BracketInfo[];
  spectators: SpectatorInfo[];
}

interface ArenaSnake {
  id: string;
  name: string;
}

type Role = 'compete' | 'watch';
type Field = 'bracket' | 'email' | 'username' | 'snake' | 'form';

const BRACKET_HINTS: Record<string, string> = {
  student: 'Currently enrolled in high school or post-secondary.',
  rookie: 'Your first or second Battlesnake tournament.',
  veteran: 'You have competed before and want the toughest games.',
};

const SPECTATOR_HINTS: Record<string, string> = {
  inPerson: 'Watch the games live at the Cultivator.',
  virtual: 'Watch the livestream from anywhere.',
};

const inputClass =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50';

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-sm text-red-600 dark:text-red-400">{message}</p> : null;

const Choice = ({
  name,
  value,
  checked,
  disabled,
  onSelect,
  title,
  detail,
  hint,
}: {
  name: string;
  value: string;
  checked: boolean;
  disabled?: boolean;
  onSelect: () => void;
  title: string;
  detail?: string;
  hint?: ReactNode;
}) => (
  <label
    className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 dark:border-gray-700 ${
      disabled ? 'cursor-not-allowed opacity-50' : ''
    }`}
  >
    <input
      type="radio"
      name={name}
      value={value}
      disabled={disabled}
      checked={checked}
      onChange={onSelect}
      className="mt-1"
    />
    <span>
      <span className="font-medium">{title}</span>{' '}
      {detail && <span className="text-sm text-gray-500">{detail}</span>}
      {hint && <span className="block text-sm text-gray-500 dark:text-gray-400">{hint}</span>}
    </span>
  </label>
);

const spotsLabel = (remaining: number, capacity?: number) =>
  remaining === 0
    ? 'Full'
    : capacity
      ? `${remaining} of ${capacity} spots left`
      : `${remaining} spots left`;

export const BattlesnakeRegistrationScene = () => {
  const { data, isError, refetch } = useQuery({
    queryKey: ['battlesnake-options'],
    queryFn: async (): Promise<OptionsResponse> => {
      const res = await fetch('/api/battlesnake/register');
      if (!res.ok) throw new Error('Failed to load tickets');
      return res.json();
    },
  });

  const [role, setRole] = useState<Role | ''>('');
  const [spectator, setSpectator] = useState('');
  const [bracket, setBracket] = useState('');
  const [username, setUsername] = useState('');
  const [snakes, setSnakes] = useState<ArenaSnake[] | null>(null);
  const [snakeId, setSnakeId] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [loadingSnakes, setLoadingSnakes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reservation, setReservation] = useState<{
    code: string;
    checkoutUrl: string;
    snakeName: string;
  } | null>(null);
  const [complete, setComplete] = useState(false);
  const onOrderComplete = useCallback(() => setComplete(true), []);

  const tournament = data?.tournament;
  const spectatorChoice = data?.spectators.find((s) => s.id === spectator);
  const snakeName = snakes?.find((s) => s.id === snakeId)?.name;

  const resetReservation = () => {
    setReservation(null);
    setErrors({});
  };

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
          snake: `${result.username} has no snakes yet. Create one on arena.battlesnake.com (it can be an empty starter snake), then find your snakes again.`,
        });
      }
    } catch {
      setErrors({ username: "We couldn't reach Battlesnake. Try again in a minute." });
    } finally {
      setLoadingSnakes(false);
    }
  };

  const reserve = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch('/api/battlesnake/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bracket, email, username, snake: snakeId }),
      });
      const result = await res.json();
      if (result.ok) {
        setReservation({
          code: result.code,
          checkoutUrl: result.checkoutUrl,
          snakeName: result.snake.snakeName,
        });
      } else {
        setErrors({ [result.field]: result.error });
        refetch();
      }
    } catch {
      setErrors({ form: 'Something went wrong. Try again in a minute.' });
    }
    setSubmitting(false);
  };

  const competitorReady = role === 'compete' && !!bracket && !!snakeId;
  const spectatorReady = role === 'watch' && !!spectatorChoice;

  if (complete) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold">You're registered!</h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          {role === 'compete'
            ? `${reservation?.snakeName} is in the tournament. `
            : `You have a ${spectatorChoice?.label.toLowerCase()} spectator ticket. `}
          Eventbrite has emailed your ticket. Join #battlesnake in the{' '}
          <a className="underline" href="http://joinslack.hackregina.com/">
            HackRegina Slack
          </a>{' '}
          for questions and strategy talk.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold">Battlesnake 2026 registration</h1>
        {tournament && (
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {tournament.dateLabel} at {tournament.venue}. Free to compete and to watch.
          </p>
        )}
        {isError && <FieldError message="We couldn't load the tickets. Refresh to try again." />}
      </div>

      <fieldset className="space-y-3">
        <legend className="font-semibold">1. Are you competing or watching?</legend>
        <Choice
          name="role"
          value="compete"
          checked={role === 'compete'}
          onSelect={() => {
            setRole('compete');
            resetReservation();
          }}
          title="Competing"
          hint="Enter a snake in the Student, Rookie or Veteran tournament."
        />
        <Choice
          name="role"
          value="watch"
          checked={role === 'watch'}
          onSelect={() => {
            setRole('watch');
            resetReservation();
          }}
          title="Spectating"
          hint="Watch the games in person or online."
        />
      </fieldset>

      {role === 'compete' && (
        <fieldset className="space-y-3">
          <legend className="font-semibold">2. Pick your bracket and snake</legend>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You only need a Battlesnake account and a snake with a name. Your snake's code doesn't
            need to be ready, and you can keep working on it until the tournament starts.
          </p>
          {data?.brackets.map((b) => (
            <Choice
              key={b.id}
              name="bracket"
              value={b.id}
              checked={bracket === b.id}
              disabled={b.remaining === 0}
              onSelect={() => {
                setBracket(b.id);
                resetReservation();
              }}
              title={b.label}
              detail={spotsLabel(b.remaining, b.capacity)}
              hint={BRACKET_HINTS[b.id]}
            />
          ))}
          <FieldError message={errors.bracket} />

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
                  resetReservation();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    findSnakes();
                  }
                }}
                placeholder="As shown on arena.battlesnake.com"
              />
              <Button
                type="button"
                variant="outline"
                className="text-gray-900"
                onClick={findSnakes}
                disabled={loadingSnakes}
              >
                {loadingSnakes ? 'Looking…' : 'Find my snakes'}
              </Button>
            </div>
            <FieldError message={errors.username} />
            <p className="mt-1 text-sm text-gray-500">
              No account yet? Sign up at{' '}
              <a className="underline" href="https://arena.battlesnake.com/">
                arena.battlesnake.com
              </a>{' '}
              and create a snake. The{' '}
              <a className="underline" href="https://docs.battlesnake.com/quickstart">
                quickstart
              </a>{' '}
              shows how.
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
                  resetReservation();
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
      )}

      {role === 'watch' && (
        <fieldset className="space-y-3">
          <legend className="font-semibold">2. How will you watch?</legend>
          {data?.spectators.map((s) => (
            <Choice
              key={s.id}
              name="spectator"
              value={s.id}
              checked={spectator === s.id}
              disabled={s.remaining === 0}
              onSelect={() => setSpectator(s.id)}
              title={s.label}
              detail={spotsLabel(s.remaining)}
              hint={SPECTATOR_HINTS[s.id]}
            />
          ))}
        </fieldset>
      )}

      {(competitorReady || spectatorReady) && tournament && (
        <section className="space-y-3">
          <h2 className="font-semibold">3. Your details</h2>

          {role === 'compete' && !reservation && (
            <form onSubmit={reserve} className="space-y-3" noValidate>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({});
                  }}
                />
                <p className="mt-1 text-sm text-gray-500">
                  If you've already registered, we'll let you know instead of booking a second spot.
                </p>
                <FieldError message={errors.email} />
              </div>
              <FieldError message={errors.form} />
              <Button type="submit" disabled={submitting || !email.trim()}>
                {submitting ? `Holding a spot for ${snakeName}…` : 'Continue'}
              </Button>
            </form>
          )}

          {role === 'compete' && reservation && (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We've held a {data?.brackets.find((b) => b.id === bracket)?.label} spot for{' '}
                {reservation.snakeName}. Finish with your name and the event questions below, and
                Eventbrite will email your ticket. Use {email} so we can match you to your snake.
              </p>
              <EventbriteCheckout
                key={reservation.code}
                eventId={tournament.eventId}
                promoCode={reservation.code}
                fallbackUrl={reservation.checkoutUrl}
                onOrderComplete={onOrderComplete}
              />
            </>
          )}

          {spectatorReady && spectatorChoice && (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose the "{spectatorChoice.ticketClassName}" ticket below and fill in your
                details. Eventbrite will email your ticket.
              </p>
              <EventbriteCheckout
                key={spectatorChoice.id}
                eventId={tournament.eventId}
                fallbackUrl={tournament.eventUrl}
                onOrderComplete={onOrderComplete}
              />
            </>
          )}
        </section>
      )}
    </div>
  );
};
