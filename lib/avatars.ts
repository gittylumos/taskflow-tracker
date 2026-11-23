/** Avatar value formats: "initials" | "emoji:<char>" | "pixel:<seed>" */
export const EMOJI_AVATARS = ["🦊", "🐼", "🐙", "🦉", "🐸", "🦄", "🐳", "🦁", "🐧", "🐝", "🦋", "🤖"];
export const PIXEL_SEEDS = ["fox", "owl", "bot", "cat", "ghost", "sprout", "comet", "ember", "wave", "moss", "plum", "dune"];

export const avatarOptions: string[] = [
  "initials",
  ...EMOJI_AVATARS.map((e) => `emoji:${e}`),
  ...PIXEL_SEEDS.map((s) => `pixel:${s}`),
];

export function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 5x5 horizontally-symmetric sprite + hue, derived from a seed. */
export function pixelSprite(seed: string) {
  const h = hash(seed);
  const cells: boolean[][] = [];
  for (let y = 0; y < 5; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < 3; x++) row.push(((h >> (y * 3 + x)) & 1) === 1);
    cells.push([row[0], row[1], row[2], row[1], row[0]]);
  }
  return { cells, hue: h % 360 };
}
