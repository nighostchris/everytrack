import * as BaseDropdownMenu from '@radix-ui/react-dropdown-menu';

import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownMenuContent } from './DropdownMenuContent';
import { DropdownMenuSeparator } from './DropdownMenuSeparator';

export const DropdownMenu = BaseDropdownMenu.Root;

export const DropdownMenuTrigger = BaseDropdownMenu.Trigger;

export { DropdownMenuItem, DropdownMenuContent, DropdownMenuSeparator };

export default DropdownMenu;
