import { createSlice } from "@reduxjs/toolkit";

const collectors = createSlice({
	name: "collectors",
	initialState: {
		selected: null,
		value: {},
	},
	reducers: {
		createCollector: (state, action) => {
			if (Object.keys(state.value).length === 0)
				return {
					selected: action.payload,
					value: {
						[action.payload]: [],
					},
				};
			return {
				...state,
				value: {
					...state.value,
					[action.payload]: [],
				},
			};
		},
		deleteCollector: (state, action) => {
			if (action.payload === state.selected) return state;
			const updatedValue = { ...state.value };
			delete updatedValue[action.payload.trim()];
			return {
				...state,
				value: updatedValue,
			};
		},
		updateSelected: (state, action) => {
			if (!Object.keys(state.value).includes(action.payload)) return state;
			const selected = Object.keys(state.value).find(
				(collector) =>
					collector.toLowerCase() === action.payload.toLowerCase().trim()
			);
			return {
				...state,
				selected,
			};
		},
		collectCharacter: (state, action) => {
			if (!state.selected || !Object.keys(state.value).includes(state.selected))
				return state;
			if (state.value[state.selected]?.length === 10) return state;
			state.value[state.selected]?.push(action.payload);
			return state;
		},
		giveUpCharacter: (state, action) => {
			if (!state.selected || !Object.keys(state.value).includes(state.selected))
				return state;
			state.value[state.selected] = state.value[state.selected]?.filter(
				(character) => character.id !== action.payload.id
			);
			return state;
		},
	},
});

export const {
	createCollector,
	deleteCollector,
	updateSelected,
	collectCharacter,
	giveUpCharacter,
} = collectors.actions;

export default collectors.reducer;
