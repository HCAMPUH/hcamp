module.exports = {
  apps: [
    {
      name: "hcamp-backend",
      cwd: "/var/www/apps/strapi",
      script: "npm",
      args: "run start",
    },
    {
      name: "hcamp-frontend",
      cwd: "/var/www/apps/ui",
      script: ".next/standalone/apps/ui/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
}
