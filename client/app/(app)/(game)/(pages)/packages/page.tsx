import React from "react";
import { db } from "@/lib/db";
import { Badge, Button, Card, Heading } from "@/components/ui";
import BuyButton from "../../components/buy-button";
import { formatCurrency } from "@/lib/utils";
import { getAuth } from "@/app/actions/auth.actions";
import { siteConfig } from "@/resources/site";

export const revalidate = 10;
export const dynamic = 'force-dynamic';
export default async function page() {
    const packages = await db.package.findMany();
    const user = await getAuth();
    if (!user) return <div>You must be logged in to view this page.</div>;
    return (
        <div className="flex flex-col space-y-4 py-8 px-2">
            {packages
                .sort((a, b) => a.price - b.price)
                .map((pkg) => (
                    <Card key={pkg.id}>
                        <Card.Header>
                            <Card.Title className="flex justify-between">
                                <div className="flex items-center">
                                    {pkg.slug == "gold" ? (
                                        <Badge intent="primary" className="ml-1">
                                            <Heading level={3}>Gold</Heading>
                                            Popular
                                        </Badge>
                                    ) : (
                                        pkg.name
                                    )}
                                </div>
                                <Badge intent="success">{pkg.durationDays} days</Badge>
                            </Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <Heading>{formatCurrency(pkg.price)}</Heading>
                            <ol>
                                <li className="text-lg text-muted-fg">
                                    Clicks per day: &nbsp;
                                    <b className="text-fg">{pkg.maxClicksPerDay}</b>
                                </li>
                                <li className="text-lg text-muted-fg flex justify-between">
                                    <p>
                                        Average daily profts:&nbsp;
                                        <b className="text-fg">
                                            {formatCurrency(pkg.maxClicksPerDay/siteConfig.pointsDivider)}
                                        </b>
                                    </p>
                                </li>
                                <li className="text-lg text-muted-fg flex justify-between">
                                    <p>
                                        Points per click:&nbsp;
                                        <b className="text-fg">{pkg.pointsPerClick}</b>
                                    </p>
                                </li>
                            </ol>
                        </Card.Content>
                        <Card.Footer>
                            {user.packageId === pkg.id ? (
                                <Button
                                    shape="circle"
                                    className="w-full"
                                    intent="danger"
                                    isDisabled
                                >
                                    Current Package
                                </Button>
                            ) : (
                                <BuyButton pkg={pkg} />
                            )}
                        </Card.Footer>
                    </Card>
                ))}
        </div>
    );
}
