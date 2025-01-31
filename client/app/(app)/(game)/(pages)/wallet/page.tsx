import Link from "next/link";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { Card, Avatar, Separator } from "ui";
import { formatCurrency } from "@/lib/utils";
import { siteConfig } from "@/resources/site";
import { getAuth } from "@/app/actions/auth.actions";
import WithdrawComponent from "../../components/withdraw-component";
import { Clock, Wallet, Users, MousePointerClick, ChevronRight } from "lucide-react";
import LogoutButton from "../../components/logout-button";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export default async function UserProfile() {
    const user = await getAuth();
    if (!user) return <div>You must be logged in to view this page.</div>;
    const friendsInvited = await db.user.count({ where: { uplineId: user?.id } });
    return (
        <div className="w-full space-y-4 px-4 py-8">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
                <Avatar size="extra-large" src={user.image} initials={user.name[0]} />
                <div>
                    <h1 className="text-xl font-bold">{user.name}</h1>
                    <p className="text-muted-fg text-sm">
                        Member since {format(user.createdAt, "MMMM dd, yyyy")}
                    </p>
                </div>
            </div>
            <Card className="bg-muted">
                <Card.Header className="pb-0">
                    <Card.Title>Total Points</Card.Title>
                </Card.Header>
                <Card.Content className="pt-4">
                    <div className="text-3xl font-bold text-warning">
                        {user.pointsEarned.toLocaleString()}
                    </div>
                </Card.Content>
            </Card>

            <Card className="bg-muted">
                <Card.Header>
                    <Card.Title>Statistics</Card.Title>
                </Card.Header>
                <Card.Content className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-warning" />
                            <span className="text-muted-fg">Profit in your local currency</span>
                        </div>
                        <span className="font-semibold">
                            {formatCurrency(user.pointsEarned / siteConfig.pointsDivider)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <MousePointerClick className="w-4 h-4 text-warning" />
                            <span className="text-muted-fg">Total taps</span>
                        </div>
                        <span className="font-semibold">{user.totalClicks}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-warning" />
                            <span className="text-muted-fg">Friends invited</span>
                        </div>
                        <span className="font-semibold">{friendsInvited}</span>
                    </div>
                </Card.Content>
            </Card>
            <Card className="bg-muted">
                <Card.Header className="pb-0">
                    <Card.Title>Active Package</Card.Title>
                </Card.Header>
                <Card.Content className="space-y-3">
                    <div className="text-xl font-semibold">{user.package?.name} Package</div>
                    <div className="flex items-center gap-2 text-sm text-muted-fg">
                        <Clock className="w-4 h-4" />
                        <span>Expires On: </span>
                        <span className="text-fg">
                            {format(
                                new Date(
                                    (user.purchasedPackageAt as Date).getTime() +
                                        (user.package?.durationDays || 0) * 24 * 60 * 60 * 1000,
                                ),
                                "MMM dd, yyyy",
                            )}
                        </span>
                    </div>
                </Card.Content>
            </Card>
            <WithdrawComponent />

            <div className="space-y-3 pt-6">
                {[
                    {
                        url: "/privacy",
                        title: "Privacy Policy",
                    },
                    {
                        url: "/terms",
                        title: "Terms & Conditions",
                    },
                ].map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.url}
                        className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                        <span>{item.title}</span>
                        <ChevronRight className="w-4 h-4 text-muted-fg" />
                    </Link>
                ))}
            </div>
            <div className="pt-6">
                <Separator className="my-6 bg-muted" />
                <LogoutButton />
            </div>
        </div>
    );
}
