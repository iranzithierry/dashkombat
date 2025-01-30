/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
				port: "",
				pathname: "**",
			},
		],
		dangerouslyAllowSVG: true,
	},
	devIndicators: {
		appIsrStatus: false,
	}
}

export default nextConfig
