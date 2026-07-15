import { defineAction } from 'astro:actions';

let clicks = 0;

export const server = {
	getClicks: defineAction({
		handler: async () => ({ clicks }),
	}),
	incrementClick: defineAction({
		handler: async () => {
			clicks += 1;
			return { clicks };
		},
	}),
};
