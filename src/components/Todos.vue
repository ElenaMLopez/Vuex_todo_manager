<template>
  <div>
    <h3>To-Dos</h3>
    <div class="legend">
      <span>
        <span class="complete-box"></span> = Completada
      </span>
      <span>
        <span class="incomplete-box"></span> = Pendiente
      </span>
    </div>
    <div class="todos">
      <div 
        @dblclick="onDblClick(todo)" 
        v-for="todo in allTodos" 
        :key="todo.id"
        class="todo"
        :class="{'is-completed':todo.complete}"
      >
        {{todo.title}}
        <i @click="deleteTodo(todo.id)" class="fas fa-trash-alt"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Todos',
  methods: {
    ...mapActions(['fetchTodos', 'deleteTodo', 'updateTodo']),
    onDblClick(todo) {
      const updTodo = {
        id: todo.id,
        title: todo.title,
        complete: !todo.complete
      }
      console.log(updTodo.complete);
      this.updateTodo(updTodo)
    }
  },
  computed: mapGetters(['allTodos']),
  created() {
    this.fetchTodos();
  },
}
</script>

<style scoped>
.todos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}
.todo {
  border: 1px solid #046c3d68;
  background: orange;
  padding: 1rem;
  border-radius: 5px;
  text-align: center;
  position: relative;
  cursor: pointer;
}
.is-completed {
  background: #24b675;
  color: #fff;
}
i { 
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #fff;
  cursor: pointer;
}
.legend {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}
.complete-box {
  background-color: #24b675;
  display: inline-block;
  height: 16px;
  width: 16px;
}
.incomplete-box {
  background: orange;
  display: inline-block;
  height: 16px;
  width: 16px;
}

@media (max-width: 500px) {
  .todos {
    grid-template-columns: 1fr;
  }
}
</style>
