const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const run = (cmd, cwd) => {
  console.log(`Running: ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
};

const backendDir = path.join(__dirname, 'backend');
if (!fs.existsSync(backendDir)) {
  fs.mkdirSync(backendDir);
}

run('npm init -y', backendDir);
run('npm install express cors dotenv jsonwebtoken @prisma/client', backendDir);
run('npm install prisma typescript ts-node-dev @types/express @types/cors @types/jsonwebtoken @types/node -D', backendDir);
run('npx tsc --init', backendDir);
run('npx prisma init', backendDir);
console.log('Backend initialized!');
