import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { execSync } from 'node:child_process';

async function main() {
  const rl = createInterface({ input, output });

  let name = (await rl.question('Migration name: ')).trim();
  rl.close();

  if (!name) {
    name = 'GeneratedMigration';
  }

  const command = `npm run typeorm -- migration:generate ./src/migrations/${name}`;
  execSync(command, { stdio: 'inherit' });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
