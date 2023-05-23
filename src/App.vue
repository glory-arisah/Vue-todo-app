<template>
  <h2 class="align-center">Todo list</h2>
  <!-- <p v-if="errorStatus" class="align-center error">Please input a value</p> -->
  <section class="main-section">
    <!-- input field to add a todo item -->
    <section class="input">
      <form
        @submit.prevent="
          method === 'add' ? addTodo($event) : updateTodo($event)
        "
      >
        <input type="text" v-model.trim="todoName" />
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
    <section class="all-todos">
      <!-- list of the remaining todos -->
      <List
        @delete-todo-ev="deleteTodo"
        @edit-todo-ev="editTodo"
        :array="[...todos]"
        array-type="todos"
        @add-or-revert-hitlist="addToHitList"
        @checkbox-action="checkBoxTodo"
      />
      <!-- list of
         all hitlist items -->
      <div>
        <List
          @delete-todo-ev="deleteTodo"
          @edit-todo-ev="editTodo"
          :array="[...hitList]"
          array-type="hitList"
          @add-or-revert-hitlist="removeFromHitList"
          @checkbox-action="checkBoxTodo"
        />
      </div>
    </section>
  </section>

  <!-- try out form -->
</template>

<script>
import List from "./components/List.vue";

export default {
  name: "App",
  data() {
    return {
      counter: 0,
      id: 4,
      todos: [
        {
          id: 1,
          title: "sample",
          done: false,
        },
        {
          id: 2,
          title: "sample2",
          done: false,
        },
      ],
      hitList: [
        {
          id: 3,
          title: "sample hitlist",
          done: false,
        },
      ],
      todoName: "",
      method: "add",
      listType: "",
      editId: 0,
    };
  },
  methods: {
    // add an item to the todo list
    addTodo(event) {
      event.preventDefault();
      this.method = "add";
      if (this.todoName) {
        const newTodo = { id: this.id, title: this.todoName, done: false }
        this.todos = [...this.todos, newTodo];
        this.id += 1;
        this.todoName = "";
      } else {
        setTimeout(() => (this.errorStatus = true), 500);
        setTimeout(() => (this.errorStatus = false), 3000);
      }
    },
    // set the input text box value to the todo text we want to edit
    editTodo(arrayType, todo) {
      [this.todoName, this.editId, this.listType] =
      [todo.title, todo.id, arrayType];
      document.querySelector('input[type="text"]').focus();
      this.method = "update";
    },
    // update a list type task
    updateListType(array, id) {
      return array.map((todo) => {
        if (todo.id === id) todo.title = this.todoName
        return todo;
      });
    },
    // update todo item
    updateTodo(event) {
      event.preventDefault();
      if (this.listType === "todos") {
        this.todos = this.updateListType(this.todos, this.editId);
      } else if (this.listType === "hitList") {
        this.hitList = this.updateListType(this.hitList, this.editId);
      }
      this.todoName = "";
      this.method = "add";
    },
    // delete a todo item
    deleteTodo(array, removedTask) {
      if (array === "todos") this.todos = [...removedTask];
      else if (array === "hitList") this.hitList = [...removedTask];
    },
    // utility method for hit list and other list checkbox
    checkBoxArray(array, id) {
      return array.map((todo) => {
        if (todo.id === id) todo.done = !todo.done;
        return todo;
      });
    },
    // mark a todo as done
    checkBoxTodo(arrayType, id) {
      if (arrayType === "todos")
        this.todos = this.checkBoxArray(this.todos, id);
      else if (arrayType === "hitList")
        this.hitList = this.checkBoxArray(this.hitList, id);
    },
    // utility find function
    findById(array, id) {
      return array.find((todo) => todo.id === id);
    },
    // add todo to hit list
    addToHitList(id) {
      const todo = this.findById(this.todos, id);
      this.hitList = [...this.hitList, todo];
      this.todos = this.todos.filter((todo) => todo.id !== id);
    },
    // remove list item from hit list
    removeFromHitList(id) {
      const todo = this.findById(this.hitList, id);
      this.todos = [...this.todos, todo];
      this.hitList = this.hitList.filter((todo) => todo.id !== id);
    },
  },
  computed: {
    hitListCount() {
      return this.hitList.length;
    },
    todosCount() {
      return this.todos.length;
    },
  },
  components: {
    List,
  },
  provide() {
    return {
      addToHitList: this.addToHitList,
      checkBoxTodo: this.checkBoxTodo,
      editTodo: this.editTodo,
      deleteTodo: this.deleteTodo,
    };
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.align-center {
  text-align: center;
}
.error {
  color: rgb(193, 15, 15);
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
.mb-3 {
  margin-bottom: 3rem;
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
  /* width: 100%; */
}
/* input field */
.input input {
  padding-block: 0.6rem;
  width: 100%;
  padding-inline: 0.5rem;
  font-size: 1rem;
  font-family: "Montserrat", sans-serif;
}
/* checkbox */
.linethrough {
  text-decoration: line-through;
}

/* plus icon for adding todo */
.plus-icon {
  padding-block: 0.85rem;
  background-color: var(--clr-blue-light);
  color: white;
  width: 100%;
  cursor: pointer;
}
.plus-icon:hover {
  border: 1px solid var(--clr-blue-darker);
  /* background-color: var(--clr-blue-dark); */
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
/* hit list button styling */
.hit-list {
  background: var(--clr-blue-light);
  border: 0.5px solid var(--clr-blue-light);
  border-radius: 4px;
  padding: 0.2rem 0.4rem;
  color: #fff;
  cursor: pointer;
}
.hit-list:hover {
  background-color: var(--clr-blue-darker);
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

@media screen and (min-width: 992px) {
  .main-section {
    display: grid;
    width: 75vw;
  }

  .input {
    grid-column: 1 / -1;
  }

  .all-todos {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}
</style>
