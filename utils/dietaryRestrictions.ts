export interface EventbriteAnswer {
  question?: string;
  answer?: string | null;
}

const DIETARY_QUESTION_PATTERN = /dietary|allerg/i;
const NO_RESTRICTION_PATTERN =
  /^(no|none|nope|nah|n\/?a|nil|nothing|no restrictions?|-+|\.+)[.!]*$/i;

export const dietaryRestrictionsFromAnswers = (
  answers: EventbriteAnswer[] | undefined,
): string | null => {
  const answer = answers
    ?.find((candidate) => DIETARY_QUESTION_PATTERN.test(candidate.question ?? ''))
    ?.answer?.trim();
  if (!answer || NO_RESTRICTION_PATTERN.test(answer)) return null;
  return answer;
};
