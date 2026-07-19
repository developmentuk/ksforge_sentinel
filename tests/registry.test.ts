import { describe, expect, it } from 'vitest';
import { commands } from '../src/commands/index.js';
import { createCommandRegistry } from '../src/core/registry.js';

describe('command registry', () => {
  it('registers every command with a unique name', () => {
    const registry = createCommandRegistry(commands);
    expect(registry.size).toBe(commands.length);
    expect([...registry.keys()]).toEqual(['forge', 'hero', 'event', 'giftcode']);
  });
});
