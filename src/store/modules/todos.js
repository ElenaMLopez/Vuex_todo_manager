import axios from 'axios';

const state = {
  todos: [],
};

const getters = {
  allTodos: (state) => state.todos,
};

const actions = {
  async fetchTodos({ commit }) {
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    );
    commit('setTodos', response.data);
  },
  async addTodo({ commit }, title) {
    const response = await axios.post('https://jsonplaceholder.typicode.com/todos', {
      title,
      complete: false,
    })
    commit('addTodo', response.data);
  },
  async deleteTodo({ commit }, id) {
    await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
    commit('removeTodo', id);
  }
};

const mutations = {
  setTodos: (state, todos) => (state.todos = todos),
  addTodo: (state, todo) => state.todos.unshift(todo),
  removeTodo: (state, id) => state.todos = state.todos.filter(todo => todo.id !== id),
};

export default {
  state,
  getters,
  actions,
  mutations,
}


