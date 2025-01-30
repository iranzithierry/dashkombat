const didPackageExpired = (purchasedPackageAt: Date, packageDurationDays: number) => {
    const daysSincePurchase = Math.floor(
        (new Date().getTime() - purchasedPackageAt.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysSincePurchase > packageDurationDays) {
        return true;
    }
    return false;
};
export { didPackageExpired };
