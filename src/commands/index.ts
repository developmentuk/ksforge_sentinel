import { eventCommand } from './event.js';
import { forgeCommand } from './forge.js';
import { giftCodeCommand } from './giftcode.js';
import { heroCommand } from './hero.js';

export const commands = [forgeCommand, heroCommand, eventCommand, giftCodeCommand] as const;
