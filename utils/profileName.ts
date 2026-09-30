const BYTES_LITERAL_PATTERN = /(^|\s)b(['"])((?:\\.|(?!\2).)*?)\2(?=\s|$)/g;
const BYTES_ESCAPE_PATTERN = /\\(x[0-9a-f]{2}|.)/gi;

export const cleanProfileName = (name: string | null | undefined): string | null => {
  const cleaned = name
    ?.replace(
      BYTES_LITERAL_PATTERN,
      (_match, leading: string, _quote: string, literal: string) =>
        leading + decodeBytesLiteral(literal),
    )
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned || null;
};

const decodeBytesLiteral = (literal: string): string => {
  const binary = literal.replace(BYTES_ESCAPE_PATTERN, (_match, escaped: string) =>
    escaped.length === 3 ? String.fromCharCode(Number.parseInt(escaped.slice(1), 16)) : escaped,
  );
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
};
