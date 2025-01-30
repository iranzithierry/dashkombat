import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const packages = [
    {
        name: "Platinum",
        slug: "platinum",
        price: 5000,
        priceInUsd: 5,
        durationDays: 14,
        pointsPerClick: 1,
        maxClicksPerDay: 5000,
    },
    {
        name: "Gold",
        slug: "gold",
        price: 50000,
        priceInUsd: 50,
        durationDays: 14,
        pointsPerClick: 5,
        maxClicksPerDay: 10000,
    },
    {
        name: "Diamond",
        slug: "diamond",
        price: 100000,
        priceInUsd: 100,
        durationDays: 21,
        pointsPerClick: 50,
        maxClicksPerDay: 20000,
    },
    {
        name: "Free",
        slug: "free",
        price: 0,
        priceInUsd: 0,
        durationDays: 7,
        pointsPerClick: 1,
        maxClicksPerDay: 200,
    },
];
const tasks = [
    {
        slug: "follow_us_twitter",
        name: "Follow our x @troy",
        points: 500,
    },
    {
        slug: "follow_us_instagram",
        name: "Follow our instagram @troy",
        points: 500,
    },
    {
        slug: "invite_3_friends",
        name: "Invite 3 Friends",
        points: 500,
    },
    {
        slug: "earn_1000_points",
        name: "Earn 1000 points",
        points: 2000,
    },
    {
        slug: "play_2_hours",
        name: "Play 2 hours",
        points: 500,
    },
];
async function main() {
    for (const pkg of packages) {
        await prisma.package.upsert({
            where: { slug: pkg.slug },
            update: pkg,
            create: pkg,
        });
    }
    for (const task of tasks) {
        await prisma.task.upsert({
            where: { slug: task.slug },
            update: task,
            create: task,
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
