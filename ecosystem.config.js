module.exports = {
  apps: [
    {
      name: "hcamp-frontend",
      cwd: "/var/www/apps/ui",
      script: ".next/standalone/apps/ui/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "hcamp-backend",
      cwd: "/var/www/apps/strapi",
      script: "npm",
      args: "run start",
    },
  ],
}
