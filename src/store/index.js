import Vuex from 'vuex';
import Vue from 'vue';
import todos from './modules/todos';

// Cargamos Vuex
Vue.use(Vuex);

// Creamos el store
export default new Vuex.Store({
  modules: {
    todos,
  }
});