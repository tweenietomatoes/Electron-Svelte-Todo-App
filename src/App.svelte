<script>
import { onMount } from 'svelte';
const { ipcRenderer } = require('electron')


let todo = ''
let todos = []

let getTodos = () => {
ipcRenderer.send('giveTodos')

ipcRenderer.on('getTodos', (e, rows) => todos = rows)
}

let addTodo = () => {
ipcRenderer.send('addTodo', todo)
getTodos()
}

let clear = () => 
{
ipcRenderer.send('clearTodos')
ipcRenderer.on('clearedTodos', () => todos = [])
}

let quit = () => {
	ipcRenderer.send('quit')
}
onMount(() => { getTodos() })
</script>

<main>
	<form on:submit|preventDefault={addTodo}>
	<input type="text" bind:value={todo}>
	<button type="submit">Save</button>
	</form>
	<button on:click={clear}>Clear All</button>
	<button on:click={quit}>Exit</button>
	<h3>Todos:</h3>
	<br/>
	{#if todos.length === 0}
	There is no todos.
	{:else}
	{#each todos as todo}
	{todo.todo}
	<br/>
	{/each}
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>