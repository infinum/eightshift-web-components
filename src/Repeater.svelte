<script>
	export let enabled = true;
	export let behavior = "show";
	export let logic = "and";
	export let conditions = [{ field: "", comparison: "is", value: "" }];
	export let fields;
	export let hasUseToggle = false;

	// Convert the "id:label,id:label,..." input into actual objects.
	const splitFields = fields?.length > 0 ? JSON.parse(fields) : '';

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
	};
</script>

<svelte:options tag='conditional-logic-repeater' />

<div class="conditional-logic-repeater">
	{#if hasUseToggle}
		<label>
			<input type="checkbox" bind:checked={enabled} />
			Use conditional logic
		</label>
	{/if}

	{#if enabled || !hasUseToggle}
		<div class="conditional-logic-repeater__item">
			<select bind:value={behavior}>
				<option value="show">Show</option>
				<option value="hide">Hide</option>
			</select>
			this field if
			<select bind:value={logic}>
				<option value="and">all</option>
				<option value="or">any</option>
			</select>
			of the following match:
		</div>

		{#each conditions as condition, i (i)}
			<div class="conditional-logic-repeater__item">
				<select bind:value={condition.field}>
					{#if fields?.length > 0}
						{#each splitFields as item, j (j)}
							<option value={item.value}>{item.label}</option>
						{/each}
					{/if}
				</select>

				<select bind:value={condition.comparison}>
					<option value="is">is</option>
					<option value="isnot">is not</option>
					<option value="gt">greater than</option>
					<option value="lt">less than</option>
					<option value="contains">contains</option>
					<option value="startsWith">starts with</option>
					<option value="endsWith">ends with</option>
				</select>

				<input type="text" bind:value={condition.value} />

				<button on:click={addCondition}>
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
					<button on:click={() => removeCondition(i)}>
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
		--rptr-accent-color: var(
			--es-conditional-logic-repeater-accent,
			#29a3a3
		);
		--rptr-input-border-color: var(
			--es-conditional-logic-repeater-input-border,
			#8f9c9c
		);
		--rptr-font-size: var(--es-conditional-logic-repeater-accent, 0.9em);

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
