<template>
  <div id="app">
    <div class="container">
      <AddTodo />
      <FilterTodos />
      <Todos />
    </div>
  </div>
</template>

<script>
import Todos from './components/Todos.vue';
import AddTodo from './components/AddTodo.vue';
import FilterTodos from './components/FilterTodos';

export default {
  name: 'App',
  components: {
    FilterTodos,
    Todos,
    AddTodo,
  }
}
</script>

<style>
body {
  font-family: "Franklin", "Arial narrow", Arial, sans-serif;
  line-height: 1.6;
  background: #e8f7f7;
}

.container {
  max-width: 1100px;
  margin: auto;
  overflow: auto;
  padding: 0 2rem;
}
</style>