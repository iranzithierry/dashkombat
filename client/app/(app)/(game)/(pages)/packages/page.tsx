import { Badge, Button, Card, Heading } from "@/components/ui";
import { db } from "@/lib/db";
import React from "react";
import BuyButton from "../../components/buy-button";
import { formatCurrency } from "@/lib/utils";

export default async function page() {
    const packages = await db.package.findMany();
    return (
        <div className="flex flex-col space-y-4 py-8">
            {packages
                .sort((a, b) => a.price - b.price)
                .map((pkg) => (
                    <Card key={pkg.id}>
                        <Card.Header>
                            <Card.Title className="flex justify-between">
                                <div className="flex items-center">
                                    {pkg.name == "Gold" ? (
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
                            <Heading>
                                {formatCurrency(pkg.price)}
                            </Heading>
                            <ol>
                                <li className="text-lg text-muted-fg">
                                    Clicks per day: &nbsp;
                                    <b className="text-fg">{pkg.maxClicksPerDay}</b>
                                </li>
                                <li className="text-lg text-muted-fg flex justify-between">
                                    <p>
                                        Points per click:{" "}
                                        <b className="text-fg">{pkg.pointsPerClick}</b>
                                    </p>
                                </li>
                            </ol>
                        </Card.Content>
                        <Card.Footer>
                            <BuyButton pkg={pkg} />
                        </Card.Footer>
                    </Card>
                ))}
        </div>
    );
}
