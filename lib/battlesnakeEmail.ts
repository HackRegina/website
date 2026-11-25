import { sendMessage } from '@/fetch/sendMessage';
import type { Registration } from '@/lib/battlesnakeRegistrations';
import { BRACKETS, TOURNAMENT } from '@/lib/battlesnakeTournament';

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** The confirmation a competitor gets after registering on the site. */
export const confirmationEmail = (registration: Registration) => {
  const bracket = BRACKETS[registration.bracket].label;
  const { snakeName, snakeUrl, username } = registration.snake;
  const lines = [
    `Hi ${registration.firstName},`,
    `You're registered for ${TOURNAMENT.name} in the ${bracket} bracket with ${snakeName} (${username}).`,
    `When: ${TOURNAMENT.dateLabel}`,
    `Where: ${TOURNAMENT.venue}`,
    "Your snake doesn't need to be ready yet. Keep improving it on arena.battlesnake.com until the tournament starts.",
    'Questions or strategy talk: join #battlesnake in the HackRegina Slack at http://joinslack.hackregina.com/',
    "Can't make it anymore? Reply to this email so we can give your spot to someone else.",
    'See you there,\nHackRegina',
  ];
  const html = lines
    .map((line) =>
      escapeHtml(line)
        .replace(escapeHtml(snakeName), `<a href="${snakeUrl}">${escapeHtml(snakeName)}</a>`)
        .replace(
          'http://joinslack.hackregina.com/',
          '<a href="http://joinslack.hackregina.com/">joinslack.hackregina.com</a>',
        )
        .replace(/\n/g, '<br>'),
    )
    .map((line) => `<p>${line}</p>`)
    .join('\n');
  return {
    subject: `You're registered for ${TOURNAMENT.name}`,
    text: lines.join('\n\n'),
    html,
  };
};

/**
 * Emails the competitor through Resend. Returns false when email isn't set up or the
 * send fails, so a registration is never lost because of email.
 */
export const sendConfirmationEmail = async (registration: Registration): Promise<boolean> => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not set, so no Battlesnake confirmation was emailed');
    return false;
  }
  const from = process.env.BATTLESNAKE_EMAIL_FROM ?? 'HackRegina <info@hackregina.com>';
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [registration.email],
        reply_to: process.env.BATTLESNAKE_EMAIL_REPLY_TO ?? 'info@hackregina.com',
        ...confirmationEmail(registration),
      }),
    });
    if (!res.ok) {
      console.error('Battlesnake confirmation email failed', res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('Battlesnake confirmation email failed', error);
    return false;
  }
};

/** Tells organizers in Slack, when BATTLESNAKE_SLACK_CHANNEL is set. */
export const notifyOrganizers = async (registration: Registration, emailed: boolean) => {
  const channel = process.env.BATTLESNAKE_SLACK_CHANNEL;
  if (!channel) return;
  const { snakeName, snakeUrl, username } = registration.snake;
  try {
    await sendMessage({
      channel,
      text: `New ${BRACKETS[registration.bracket].label} competitor: ${registration.firstName} ${registration.lastName} with <${snakeUrl}|${snakeName}> (${username}).${emailed ? '' : ' Their confirmation email did not send.'}`,
    });
  } catch {
    // Already logged by sendMessage. The registration is saved either way.
  }
};
