# Obtener datos de JSONplaceholder para


## Realizar la obtención de Datos

Obiamente no queremos tener un estado hardcodeado, sino obtener los datos de JSONPlaceholder en este caso. Para ello vamos a hacer una petición a la api, y luego almacenar lo que nos devuelve en el store. 

En nuestro archivo del módulo de todos (`store/modules/todos.js`), eliminamos las tareas hardcodeadas que tenemos:

```js
const state = {
  todos: [],
};
```

- Como hemos comentado, haremos la llamada a la API dentro de la directiva de `actions` y estas realizarán un commit de la acción que desencadenará la mutación que actualizará el estado. Esto es así, porque las mutaciones deben gestionar tan solo [procesos síncronos](https://elabismodenull.wordpress.com/2017/06/05/vuejs-las-mutaciones-y-acciones-en-vuex/), de esta forma la llamada asíncrona a la API de JSONPlaceholder la gestiona una acción, y esta acción es la que realiza el commit para que la mutación altere el *Strore*.
>Ahora imagine que estamos depurando la aplicación y mirando los registros de mutación de devtool. Por cada mutación registrada, devtool deberá capturar instantáneas del estado "antes" y "después". Sin embargo, la devolución de llamada asincrónica dentro de la mutación de ejemplo anterior lo hace imposible: la devolución de llamada aún no se llama cuando se confirma la mutación, y no hay forma de que devtool sepa cuándo se llamará realmente la devolución de llamada: cualquier mutación de estado realizada en la devolución de llamada es esencialmente imposible de rastrear! 
[Vuex Mutations](https://vuex.vuejs.org/guide/mutations.html#mutations-must-be-synchronous)

#

- De esta forma nuestro archivo, haremos una llamada asíncrona, que realizará un commit, y tras esto la mutación cambiará el contenido del *Store*. El archivo `todos.js` queda de la siguiente forma:

```js
import axios from 'axios';

const state = {
  todos: [],
};

const getters = {
  allTodos: (state) => state.todos,
};
// Llamada asíncrona:
const actions = {
  async fetchTodos({ commit }) {
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    );
    // Commit con el método 'setTodos' definido en la mutación.
    commit('setTodos', response.data);
  }
};
// Método síncrono que muta el estado con los datos obtenidos en la acción
const mutations = {
  setTodos: (state, todos) => (state.todos = todos)
};

export default {
  state,
  getters,
  actions,
  mutations,
}
```

>**NOTA**: 
>Dentro de las acciones, definimos la función asíncrona que pide los datos, pasando como parámetro un objeto, en este caso `({ commit })`, de manera que no estamos llamando a la mutación directamente, sino que estamos realizando un destructuring de JS6, que nos permite tomar esta propiedad en concreto, se pueden pasar más propiedades como `state` por ejemplo.

- Ahora ya tenemos los datos en nuestro *State*, pero para mostrarlos en nuestro componente desde el inicio, tenemos que llamar a esta acción. Como queremos que se llame desde el principio vamos a hacerlo en el ciclo de vida de `create`, y de esta forma la llamada se realizará en el momento de creación de nuestro componente.

- En el archivo de `Todos.vue`, realizamos un `dispatch` de la acción, que es la forma de solicitar a vue que ponga en marcha la operativa de esta acción:
>Puede enviar acciones en componentes con `this.$store.dispatch('xxx')`, o usar el helper `mapActions`, que asigna métodos de componentes a la llamada `store.dispatch` (requiere de la inyección de `store` en la raíz )
[Vuex Dispatching Actions in Components](https://vuex.vuejs.org/guide/actions.html#dispatching-actions-in-components)

```js
<script>
// Agregamos 'mapActions'
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Todos',
  methods: {
    // Generamos el metodo que llama a la acción.
    // Usamos mapActions,
    ...mapActions(['fetchTodos'])
    },
  computed: mapGetters(['allTodos']),
  created() {
    this.fetchTodos();
  }
}
</script>
```
Sin usar el helper de `mapActions` se haría así, resultando más bervoso, puede ser más explicativo si no se entiende que es `mapActions`, pero puede volverse algo demasiado grande si tenemos muchas [acciones, mutaciones y getters](https://blog.openreplay.com/learn-how-mapping-works-in-vuex) y un store lleno de cosas:

```js
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Todos',
  methods: {
    fetchTodos() {
      return this.$store.dispatch('fetchTodos')
    }
    // ...mapActions(['fetchTodos'])
    },
  computed: mapGetters(['allTodos']),
  // Llamamos al método fetchTodos en el momento de crear el componente
  created() {
    this.fetchTodos();
  }
}
</script>
```

## Añadir tareas:

- Primero vamos a crear la funcionalidad y después el componente. Tomamos el archivo `todos.js` de nuestro módulo del store y agregamos una acción y su correspondiente mutación del estado:

```js
const actions = {
  async fetchTodos({ commit }) {
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    );
    commit('setTodos', response.data);
  },
  // Realizamos el post a JSONPlacejolder 
  //(que lo almacena temporalmente y hasta que no se haga una nueva petición)
  async addTodo({ commit }, title) {
    const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
      title,
      complete: false,
    })
    // Lanzamos un commit que ejecutará la mutación 'addTodo'
    commit('addTodo', response.data);
  }
};

const mutations = {
  setTodos: (state, todos) => (state.todos = todos),
  // Agregamos la tarea al store, insertandola al principio para que salga en primer lugar
  addTodo: (state, todo) => state.todos.unshift(todo),
};
```
- Creamos el nuevo componente `AddTodo.vue`:
```html
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
    // Declaramos la acción de agregar tarea recientemente hecha
    ...mapActions(['addTodo']),
    onSubmit(e) {
      e.preventDefault(); // evita la recarga de la página
      // Le pasamos el título de la tarea que es con lo que 'addTodo' realiza el post a la API
      this.addTodo(this.title);
    }
  }
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
```
- En el momento de enviar el formulario, se setea el título en data, y se le pasa como parámetro a la acción, que una vez concluida, realiza el commit de la mutación que actualiza el estado. Esto

- Si refrescamos la página, nuestra tarea desaparece, pero es porque JSONPlaceholder no guarda en realidad tu tarea, permite un post, pero obíamente es de sesión, si hacemos otro get, la sesion ha caducado y nos devuelve las tareas iniciales.

- Además en la consola vamos a tener un error si introducimos más tareas, porque nuestro fake-back tampoco genera id's únicos, siempre asigna el mismo, y por ello nos salta ese error. Podríamos instalar 'json-server' para tener un fake  back en local que funcionase mejor, pero de esta forma hacemos un test real con llamadas a la web.

## Eliminar tarea:

- Nos traemos al `index.html` el CDN de Font-awesome:     
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" referrerpolicy="no-referrer" />
```
- En nuestro componente de `Todos.vue` agregamos un icono en cada tarea de una papelera:
```html
    <div class="todos">
      <div v-for="todo in allTodos" :key="todo.id" class="todo">
        {{todo.title}}
        <i class="fas fa-trash-alt"></i>
      </div>
```
- Ahora crearemos la acción de eliminar una tarea determinada, que haga su correspondiente commit en una mutación. En nuestro archivo de módulos del store `todos.js` agregamos:

```js

const actions = {
  async fetchTodos({ commit }) {
    // ... código anterior
  },
  async addTodo({ commit }, title) {
    // ... código anterior
  },
  async deleteTodo({ commit }, id) {
    await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
    // No necesitamos declarar ninguna variable, tan solo tomar el id y hacer el commit
    // en la mutación correspondiente
    commit('removeTodo', id);
  }
};

const mutations = {
  setTodos: (state, todos) => (state.todos = todos),
  addTodo: (state, todo) => state.todos.unshift(todo),
  // Eliminamos la tarea con el id que va a recibir
  removeTodo: (state, id) => state.todos = state.todos.filter(todo => todo.id !== id),
};
```

- En nuestro componente agregamos la acción en un click del icono. Necesita coger el id, así que ponemos lo siguiente:
```html
<i @click="deleteTodo(todo.id)" class="fas fa-trash-alt"></i>
```
- Después y como estamos usanto `mapActions`, tan solo necesitamos llamar a la acción correspondiente:
```js
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Todos',
  methods: {
    // Agregamos la acción deleteTodo al array de acciones que usamos
    ...mapActions(['fetchTodos', 'deleteTodo'])
    },
  computed: mapGetters(['allTodos']),
  created() {
    this.fetchTodos();
  }

}
</script>
```

## Filtar tareas:

- En este caso, para filtrar una tarea, podríamos utilizar props y emit para buscar las tareas completadas, pero si hay muchos componentes anidados, esto puede ser bastante molesto, y en este caso Vuex es de gran ayuda. 

- Empezamos por crear un componente para filtrar en nuestra carpeta de componentes, al que llamaremos `FilterTodos.vue`:
