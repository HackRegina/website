const placeholderImagesByEventName: [string, string][] = [
  ['Beer & Code Together', '/images/beer-n-code-together-placeholder.png'],
  ['Code Together', '/images/code-together-placeholder.png'],
  ["Lunch n' Learn", '/images/lunch-n-learn-placeholder.png'],
  ['Battlesnake', '/images/battlesnake-placeholder.png'],
];

export const eventPlaceholderImage = (eventName: string): string | undefined =>
  placeholderImagesByEventName.find(([recurringEvent]) => eventName.includes(recurringEvent))?.[1];
