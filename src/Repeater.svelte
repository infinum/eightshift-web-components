<script>
	export let enabled = true;
	export let behavior = "show";
	export let logic = "and";
	export let conditions = [{ field: "", comparison: "is", value: "" }];
	export let fields;
	export let toggleable = null;
	export let value = null;
	export let autoclear = null;

	let elementRef;

	const showToggle = typeof toggleable !== 'undefined' && toggleable !== null;

	const doAutoClear = showToggle && typeof autoclear !== 'undefined' && autoclear !== null;

	const isJsonString = (input) => {
		try {
			JSON.parse(input);
		} catch (error) {
			return false;
		}

		return true;
	};

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

	// Fill in initial data if provided and in correct format.
	if (typeof value !== 'undefined' && value !== null && isJsonString(value)) {
		const parsed = JSON.parse(value);

		if (!Array.isArray(parsed) && Object.keys(parsed)?.length === 4) {
			const {
				enabled: newEnabled,
				behavior: newBehavior,
				logic: newLogic,
				conditions: newConditions,
			} = parsed;

			enabled = newEnabled;
			behavior = newBehavior;
			logic = newLogic;
			conditions = newConditions;
		}
	}

	const onEnabledChange = () => {
		triggerUpdateCustomEvent();

		if (doAutoClear && !enabled) {
			conditions = [{ field: "", comparison: "is", value: "" }];
			behavior = "show";
			logic = "and";
		}
	};
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
				<option value="show">Show</option>
				<option value="hide">Hide</option>
			</select>
			this field if
			<select bind:value={logic} on:change={triggerUpdateCustomEvent} part="header-logic-select">
				<option value="and">all</option>
				<option value="or">any</option>
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
					<option value="is">is</option>
					<option value="isnot">is not</option>
					<option value="gt">greater than</option>
					<option value="lt">less than</option>
					<option value="contains">contains</option>
					<option value="startsWith">starts with</option>
					<option value="endsWith">ends with</option>
				</select>

				<input type="text" bind:value={condition.value} on:change={triggerUpdateCustomEvent} part="item-value-input" />

				<button on:click={addCondition} part="add-condition-button">
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
					<button on:click={() => removeCondition(i)} part="remove-condition-button">
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
	}

	.conditional-logic-repeater,
	.conditional-logic-repeater * {
		box-sizing: border-box;
	}

	button {
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
	}

	button svg {
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
</style>
