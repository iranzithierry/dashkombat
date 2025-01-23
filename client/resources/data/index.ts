export const levelNames = [
    "Rookie",
    "Epic",
    "Legendary",
    "Master",
    "GrandMaster",
    "Lord",
    "DemiGod",
    "Eternal",
    "King",
];

export const levelMinPoints = [
    0, // Rookie
    10_000, // Epic
    50_000, // Legendary
    500_000, // Master
    5_000_000, // GrandMaster
    50_000_000, // Lord
    500_000_000, // DemiGod
    1_000_000_000, // Eternal
];

export function getLevelName(points: number): string {
    for (let i = levelMinPoints.length - 1; i >= 0; i--) {
        if (points >= (levelMinPoints[i] as number)) {
            return levelNames[i] as string;
        }
    }
    return "King";
}
