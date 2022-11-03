<script>
	const isJsonString = (input) => {
		try {
			JSON.parse(input);
		} catch (error) {
			return false;
		}

		return true;
	};

	export let behaviors = null;
	export let logics = null;
	export let comparisons = null;

	const defaultBehaviors = {
		show: 'Show',
		hide: 'Hide',
	};

	const defaultLogics = {
		all: 'all',
		any: 'any',
	};

	const defaultComparisons = {
		is: 'is',
		isn: 'is not',
		gt: 'greater than',
		gte: 'greater than or equal',
		lt: 'less than',
		lte: 'less than or equal',
		c: 'contains',
		sw: 'starts with',
		ew: 'ends with',
	};

	const behaviorOptions = typeof behaviors !== 'undefined' && behaviors !== null && isJsonString(behaviors) ? JSON.parse(behaviors) : defaultBehaviors;
	const logicOptions = typeof logics !== 'undefined' && logics !== null && isJsonString(logics) ? JSON.parse(logics) : defaultLogics;
	const comparisonOptions = typeof comparisons !== 'undefined' && comparisons !== null && isJsonString(comparisons) ? JSON.parse(comparisons) : defaultComparisons;

	const defaultState = {
		enabled: true,
		behavior: Object.keys(behaviorOptions)[0],
		logic: Object.keys(logicOptions)[0],
		conditions: [{ field: "", comparison: Object.keys(comparisonOptions)[0], value: "" }],
	};

	export let enabled = defaultState.enabled;
	export let behavior = defaultState.behavior;
	export let logic = defaultState.logic;
	export let conditions = structuredClone(defaultState.conditions);
	export let fields;
	export let toggleable = null;
	export let value = null;
	export let autoclear = null;

	let elementRef;

	const showToggle = typeof toggleable !== 'undefined' && toggleable !== null;
	const doAutoClear = showToggle && typeof autoclear !== 'undefined' && autoclear !== null;

	// Parse the field data from JSON string.
	const parsedFields = fields?.length > 0 && isJsonString(fields) ? JSON.parse(fields) : '';

	// Add new item.
	const addCondition = () => {
		// Needs to be a = assignment to trigger a UI update in Svelte.
		conditions = [
			...conditions,
			{
				field: "",
				comparison: "is",
				value: "",
			},
		];
	};

	// Remove an item.
	const removeCondition = (i) => {
		// Needs to be a = assignment to trigger a UI update in Svelte.
		conditions = conditions.filter((_, index) => index !== i);

		triggerUpdateCustomEvent();
	};

	const triggerUpdateCustomEvent = () => {
		const data = {
				detail: {
					enabled,
					behavior,
					logic,
					conditions,
				},
				composed: true,
		};

		elementRef.dispatchEvent(new CustomEvent('es-conditional-logic-repeater-update', data));
	};

	const onEnabledChange = () => {
		triggerUpdateCustomEvent();

		if (doAutoClear && !enabled) {
			conditions = structuredClone(defaultState.conditions);
			behavior = defaultState.behavior;
			logic = defaultState.logic;
		}
	};

	const resetData = () => {
		conditions = [];
		conditions = structuredClone(defaultState.conditions);
		behavior = defaultState.behavior;
		logic = defaultState.logic;

		triggerUpdateCustomEvent();
	}

	// Fill in initial data if provided and in correct format.
	if (typeof value !== 'undefined' && value !== null && isJsonString(value)) {
		const parsed = JSON.parse(value);

		if (!Array.isArray(parsed) && Object.keys(parsed)?.length >= 1) {
			enabled = parsed?.enabled ?? defaultState.enabled;
			behavior = parsed?.behavior ?? defaultState.behavior;
			logic = parsed?.logic ?? defaultState.logic;
			conditions = parsed?.conditions ?? structuredClone(defaultState.conditions);
		}
	}

	$: isClearable = conditions.length > 1 || (conditions.length === 1 && (conditions[0]?.field?.length > 0 || conditions[0]?.value?.length > 0));
</script>

<svelte:options tag='conditional-logic-repeater' />

<div class="conditional-logic-repeater" bind:this={elementRef} part="container">
	{#if showToggle}
		<label part="use-toggle-label">
			<input type="checkbox" bind:checked={enabled} on:change={onEnabledChange} part="use-toggle-checkbox {enabled ? 'use-toggle-checkbox-enabled' : ''}" />
			Use conditional logic
		</label>
	{/if}

	{#if enabled || !showToggle}
		<div class="conditional-logic-repeater__item" part="header">
			<select bind:value={behavior} on:change={triggerUpdateCustomEvent} part="header-behavior-select">
				{#each Object.entries(behaviorOptions) as [value, label], j (j)}
					<option value={value}>{label}</option>
				{/each}
			</select>
			this field if
			<select bind:value={logic} on:change={triggerUpdateCustomEvent} part="header-logic-select">
				{#each Object.entries(logicOptions) as [value, label], j (j)}
					<option value={value}>{label}</option>
				{/each}
			</select>
			of the following match:
		</div>

		{#each conditions as condition, i (i)}
			<div class="conditional-logic-repeater__item" part="item">
				<select bind:value={condition.field} on:change={triggerUpdateCustomEvent} part="item-field-select">
					{#if fields?.length > 0}
						{#each parsedFields as item, j (j)}
							<option value={item.value}>{item.label}</option>
						{/each}
					{/if}
				</select>

				<select bind:value={condition.comparison} on:change={triggerUpdateCustomEvent} part="item-comparison-select">
					{#each Object.entries(comparisonOptions) as [value, label], j (j)}
						<option value={value}>{label}</option>
					{/each}
				</select>

				<input type="text" bind:value={condition.value} on:change={triggerUpdateCustomEvent} part="item-value-input" />

				<button class="icon-button" on:click={addCondition} part="add-condition-button">
					<svg
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M1 10H10M19 10H10M10 10V1M10 10V19"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
				</button>

				{#if i > 0}
					<button class="icon-button" on:click={() => removeCondition(i)} part="remove-condition-button">
						<svg
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M1 10H19"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
							/>
						</svg>
					</button>
				{/if}
			</div>
		{/each}

		<button class="button" on:click={resetData} disabled={!isClearable} part="clear-button">Clear</button>
	{/if}
</div>

<style>
	.conditional-logic-repeater {
		--rptr-font-family: system-ui, sans-serif;
		--rptr-accent-color: var(--es-conditional-logic-repeater-accent, #29a3a3);
		--rptr-input-border-color: var(--es-conditional-logic-repeater-input-border, #8f9c9c);
		--rptr-font-size: var(--es-conditional-logic-repeater-font-size, 0.9em);

		font-family: system-ui, sans-serif;
		font-size: var(--rptr-font-size);

		display: flex;
		flex-direction: column;
		gap: 1rem;

		width: var(--es-conditional-logic-repeater-width, max-content);
	}

	.conditional-logic-repeater,
	.conditional-logic-repeater * {
		box-sizing: border-box;
	}

	.icon-button {
		padding: 0.25rem;
		border: 0;
		margin: 0;

		width: 1.75rem;
		height: 1.75rem;

		background-color: transparent;
		color: var(--rptr-accent-color);

		border: 1px solid var(--rptr-accent-color);
		border-radius: 100rem;

		display: flex;
		align-items: center;
		justify-content: center;

		cursor: pointer;

		transition: box-shadow 0.3s ease-out;
	}

	.icon-button svg {
		width: 1rem;
		height: 1rem;
	}

	input[type="checkbox"] {
		width: 1.25rem;
		height: 1.25rem;
		accent-color: var(--rptr-accent-color);
	}

	input[type="text"],
	select {
		height: 2.5rem;
		border-radius: 0.25rem;
		border: 1px solid var(--rptr-input-border-color);
		padding: 0.5rem;
		outline-color: var(--es-conditional-logic-repeater-accent);
		accent-color: var(--es-conditional-logic-repeater-accent);

		transition: box-shadow 0.3s ease-out;
	}

	label,
	.conditional-logic-repeater__item {
		display: flex;
		align-items: center;
		line-height: 1;
	}

	label {
		gap: 0.25rem;
	}

	.conditional-logic-repeater__item {
		gap: 0.75rem;
	}

	.button {
		padding: 0.5rem 1rem;
		border: 0;
		margin: 0;

		background-color: transparent;
		color: var(--rptr-accent-color);

		border: 1px solid var(--rptr-accent-color);
		border-radius: 0.25rem;

		display: inline-flex;
		align-items: center;
		justify-content: center;

		cursor: pointer;

		font-weight: 500;

		margin-left: auto;

		transition: box-shadow 0.3s ease-out;
	}

	.button:not(:disabled):hover {
		box-shadow: 0 0 0 1px var(--rptr-accent-color);
	}

	.button:disabled {
		border-color: var(--rptr-input-border-color);
		color: var(--rptr-input-border-color);
		cursor: not-allowed;
	}

	@supports selector(:focus-visible) {
		.icon-button:focus,
		input[type="text"]:focus,
		select:focus,
		.button:focus {
			outline: none;
		}

		.icon-button:not(:disabled):focus:focus-visible,
		input[type="text"]:not(:disabled):focus:focus-visible,
		select:not(:disabled):focus:focus-visible,
		.button:not(:disabled):focus:focus-visible {
			border-color: var(--rptr-accent-color);
			box-shadow: 0 0 0 3px var(--es-conditional-logic-repeater-focus-outline-overlay-color, rgb(255 255 255 / 0.7)), 0 0 0 3px var(--rptr-accent-color);
		}
	}

	@supports not selector(:focus-visible) {
		.icon-button:not(:disabled):focus,
		input[type="text"]:not(:disabled):focus,
		select:not(:disabled):focus,
		.button:not(:disabled):focus {
			border-color: var(--rptr-accent-color);
			outline: none;
			box-shadow: 0 0 0 3px var(--es-conditional-logic-repeater-focus-outline-overlay-color, rgb(255 255 255 / 0.7)), 0 0 0 3px var(--rptr-accent-color);
		}
	}
</style>
