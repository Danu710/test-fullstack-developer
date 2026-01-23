// hero.ts
import { heroui } from '@heroui/react';
export default heroui();

@import "tailwindcss";
@plugin './hero.ts';
/* Note: You may need to change the path to fit your project structure */
@source '../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}';
@custom-variant dark (&:is(.dark *));