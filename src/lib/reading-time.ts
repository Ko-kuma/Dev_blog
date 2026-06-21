const KOREAN_CHARS_PER_MINUTE = 500;
const ENGLISH_WORDS_PER_MINUTE = 220;

export function getReadingTime(content: string) {
  const normalized = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[{}[\]#>*_~|-]/g, " ");

  const koreanChars = (normalized.match(/[가-힣]/g) || []).length;
  const englishWords = normalized
    .replace(/[가-힣]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = Math.ceil(
    koreanChars / KOREAN_CHARS_PER_MINUTE + englishWords / ENGLISH_WORDS_PER_MINUTE,
  );

  return Math.max(1, minutes);
}
