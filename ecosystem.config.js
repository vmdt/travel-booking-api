module.exports = {
	apps: [
		{
			name: "travelife-be",
			script: "src/server.js",
			instances: 1,
			cwd: "/usr/src/app",
			max_memory_restart: "100M",
		},
	],
};
