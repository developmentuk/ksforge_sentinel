import type { SentinelCommand } from './command.js';

export function createCommandRegistry(commands: readonly SentinelCommand[]) {
  const registry = new Map(commands.map((command) => [command.data.name, command]));
  if (registry.size !== commands.length) {
    throw new Error('Duplicate Discord command name detected.');
  }
  return registry;
}
