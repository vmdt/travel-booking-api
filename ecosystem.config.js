module.exports = {
	apps: [
		{
			name: "travelife-be",
			script: "src/server.js",
			instances: 2,
			cwd: "/usr/src/app",
			max_memory_restart: "1G",
		},
	],
};
