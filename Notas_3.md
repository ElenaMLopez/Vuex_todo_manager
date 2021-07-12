# Crear los componentes básicos


## Componente Todos.

Creamos un componente en la carpeta `components` que tendrá la lista de ToDos:
```html
<template>
<div class="container">
  <Todos />
</div>
</template>

<script>
import Todos from './components/Todos.vue'

export default {
  name: 'App',
  components: {
    Todos,
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
```

## Crear la carpeta `store`.

Dentro de la carpeta raíz, creamos la carpeta que va a contener el *Store*. Dentro de ella creamos el archivo `index.js` que será el punto de entrada de vuex. Aquí es donde se combinan los módulos que tengamos. Debemos importar Vuex, y también debemos importar vue, así como los módulos que vallamos a usar, aunque aun no hemos creado ninguno, pero lo haremos después.

- Se debe cargar Vuex, es decir, comunicarle a Vue que va a utilizar Vuex.
- Creamos el store y lo exportamos. A esta directiva se le han de pasar los módulos que tengamos.

```js
import Vuex from 'vuex';
import Vue from 'vue';
import Todos from './modules/todos';

// Cargamos Vuex
Vue.use(Vuex);

// Creamos el Store
export default new Vuex.Store({
  modules: {
    Todos,
  }
})
```

- Así mismo en nuestro main.js debemos decir que nuestra instancia utiliza vuex. Siguiendo la forma de Vue3 queda:

```js
import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

createApp(App).use(store).mount('#app')
``` 

## Creando los módulos.

Dentro de la carpeta de *store* creamos la carpeta *modules* y en ella el archivo `todos.js` que tendrá lo relativo al estado de todos. 
```js
// En este archivo definimos State, getters y actions
import axios from 'axios';

const state = {
  todos: [
    {
      id: 1,
      title: 'Todo 1',
    },
    {
      id: 2,
      title: 'Todo 2',
    },
    {
      id: 3,
      title: 'Todo 3',
    },
  ]
};

const getters = {};

const actions = {};

const mutations = {};

export default {
  state,
  getters,
  actions,
  mutations,
}
```
- Para poder acceder a las dos tareas que tiene de momento, ha de crearse un getter, que se podrá llamar desde cualquier componente para ver que hay en el estado en ese momento:

```js
const getters = {
  allTodos: (state) => state.todos
};
```
- Ahora en nuestro componente `Todos.vue` podemos utilizar el getter:

