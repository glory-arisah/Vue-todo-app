<template>
  <p v-if="errorStatus">Please input a value</p>
  <h2>Todo list</h2>
  <section class="main-section">
    <!-- input field to add a todo item -->
    <section class="input">
      <form @submit="method === 'add' ? addTodo($event) : updateTodo($event)">
        <input type="text" v-model="todoName" />
      </form>
      <p></p>
      <template v-if="method === 'add'">
        <font-awesome-icon
          :icon="['fas', 'fa-plus']"
          class="plus-icon"
          @click="addTodo"
        />
      </template>
      <template v-else-if="method === 'update'">
        <font-awesome-icon
          :icon="['fas', 'fa-check']"
          class="plus-icon"
          @click="updateTodo"
        />
      </template>
    </section>
    <!-- list of all items -->
    <section class="all-todos">
      <section v-for="todo in todos" :key="todo.id" class="todos">
        <p class="todo">{{ todo.title }}</p>
        <p></p>
        <div class="action-btns">
          <font-awesome-icon
            :icon="['fas', 'fa-pencil']"
            class="btn"
            @click="editTodo(todo.id)"
          />
          <font-awesome-icon
            :icon="['fas', 'fa-times']"
            class="btn"
            @click="deleteTodo(todo.id)"
          />
        </div>
      </section>
    </section>
  </section>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: "App",
  data() {
    return {
      id: 3,
      todos: [
        {
          id: 1,
          title: "sample",
        },
        {
          id: 2,
          title: "test",
        },
      ],
      todoName: "",
      errorStatus: false,
      method: "add",
      itemIndex: 0,
    };
  },
  methods: {
    // add an item to the todo list
    addTodo(event) {
      event.preventDefault();
      this.method = "add";
      if (this.todoName) {
        this.todos.push({ id: this.id, title: this.todoName });
        this.id += 1;
        this.todoName = "";
      } else {
        setTimeout(() => (this.errorStatus = true), 500);
        setTimeout(() => (this.errorStatus = false), 3000);
      }
    },
    // delete a todo item
    deleteTodo(id) {
      this.itemIndex = id;
      this.todos = this.todos.filter((todo) => todo.id !== id);
    },
    // edit todo item
    editTodo(id) {
      this.itemIndex = id;
      let todo = this.todos.find((todo) => todo.id === id);
      document.querySelector('input').focus();
      this.todoName = todo.title;
      this.method = "update";
    },
    // update todo item
    updateTodo(event) {
      event.preventDefault();
      let index = this.itemIndex;
      this.method = "update";
      this.todos = this.todos.map((todo) => {
        if (todo.id === index) {
          todo.title = this.todoName;
        }
        return todo;
      });
      this.todoName = "";
      this.method = "add";
      this.itemIndex = 0;
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300&display=swap");

:root {
  --grid-layout: 6fr 0.3fr 1fr;
  --clr-blue-darker: #063872;
  --clr-blue-dark: #045cad;
  --clr-blue-light: #307cc3;
  --clr-blue-lighter: #cdebff;
}

body {
  font-family: "Montserrat", sans-serif;
}
/* heading */
h2 {
  text-align: center;
  margin-top: 5rem;
}

/* container for both the input and todo list */
.main-section {
  margin: 0 auto;
  width: 70vw;
  margin-top: 3rem;
}

/* container for input field and add button */
.input {
  display: grid;
  grid-template-columns: var(--grid-layout);
}
/* form container for input field */
.input form {
  width: 100%;
}
/* input field */
.input input {
  padding-block: 0.6rem;
  width: 100%;
  padding-inline: 0.5rem;
  font-size: 1rem;
  font-family: "Montserrat", sans-serif;
}

/* plus icon for adding todo */
.plus-icon {
  font-size: 1rem;
  padding-block: 0.9rem;
  border: 1px solid var(--clr-blue-light);
  background-color: var(--clr-blue-light);
  color: white;
  width: 100%;
  cursor: pointer;
}
.plus-icon:hover {
  border: 1px solid var(--clr-blue-darker);
  background-color: var(--clr-blue-dark);
}

/* todo list styling */
.all-todos {
  margin-top: 2rem;
}
.todos {
  display: grid;
  grid-template-columns: var(--grid-layout);
  grid-column: 1 / -1;
  padding-block: 1rem;
  border-bottom: 1px solid var(--clr-blue-lighter);
}
.todos:nth-of-type(1) {
  border-block: 1px solid var(--clr-blue-lighter);
}
.todos p {
  font-size: 1.1rem;
  color: var(--clr-blue-darker);
}

/* edit and delete buttons styling */
.action-btns {
  display: flex;
  justify-content: space-between;
}
.btn {
  padding: 0.3rem 0.7rem;
  color: var(--clr-blue-light);
  cursor: pointer;
  font-size: 1.1rem;
}
.btn:hover {
  color: var(--clr-blue-dark);
}
</style>
