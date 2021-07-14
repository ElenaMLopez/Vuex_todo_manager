<template>
  <div>
    <h3>Agregar tarea</h3>
    <div class="add">
      <form @submit="onSubmit">
        <input type="text" v-model="title" placeholder="Agrega una tarea">
        <input type="submit" value="Agregar">
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: 'AddTodo',
  data() {
    return {
      title: '',
    }
  },
  methods: {
    ...mapActions(['addTodo']),
    onSubmit(e) {
      e.preventDefault();
      this.addTodo(this.title);
    },
  },
}
</script>

<style scoped>
form {
  display: flex;
}
input[type="text"] {
  border: 1px solid #046c3d68;
  color: #025731;
  flex: 10;
  outline: 0;
  padding: 10px;
}
input[type="submit"] {
  background: #41b883;
  border: 1px solid #046c3d68;
  color: #fff;
  cursor: pointer;
  flex: 2;
}
</style>