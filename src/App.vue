<template>
  <h2 class="align-center">Todo list</h2>
  <p v-if="errorStatus" class="align-center error">Please input a value</p>
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
    <section class="all-todos">
        <!-- list of the remaining todos -->
        <section class="mb-3">
          <section v-for="todo in todos" :key="todo.id" class="todos">
            <p class="todo">
              <input type="checkbox" style="margin-right:0.3rem;" @change='checkBoxTodo("todos", todo.id)' :checked="todo.done"  false-value=false true-value=true />
              <span :class="todo.done && 'linethrough'">{{ todo.title }}</span>
            </p>
            <p><button v-show="!todo.done" @click="addToHitList(todo.id)" class="hit-list">hitlist</button></p>
            <div class="action-btns">
              <font-awesome-icon v-show="!todo.done"
                :icon="['fas', 'fa-pencil']"
                class="btn"
                @click="editTodo('todos', todo.id)"
              />

              <font-awesome-icon
                :icon="['fas', 'fa-times']"
                class="btn"
                @click="deleteTodo('todos', todo.id)"
              />
            </div>
          </section>
        </section>

      <!-- list of all hitlist items -->
      <h3>Hit list</h3>
      <section v-for="todo in hitList" :key="todo.id" class="todos">
        <p class="todo">
          <input type="checkbox" style="margin-right:0.3rem;" @change='checkBoxTodo("hitList", todo.id)' :checked="todo.done"  false-value=false true-value=true />
          <span :class="todo.done && 'linethrough'">{{ todo.title }}</span>
        </p>
        <p><button v-show="!todo.done" @click="removeFromHitList(todo.id)" class="hit-list">revert</button></p>
        <div class="action-btns">
          <font-awesome-icon v-show="!todo.done"
            :icon="['fas', 'fa-pencil']"
            class="btn"
            @click="editTodo('hitList', todo.id)"
          />

          <font-awesome-icon
            :icon="['fas', 'fa-times']"
            class="btn"
            @click="deleteTodo('hitList', todo.id)"
          />
        </div>
      </section>
    </section>
  </section>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
const { format } = require('date-fns')
export default {
  name: "App",
  data() {
    return {
      id: 2,
      todos: [
        {
          id: 1,
          title: "sample",
          createdAt: format(Date.now(), 'yyyy-MM-dd-hh:mm:ss'),
          updatedAt: format(Date.now(), 'yyyy-MM-dd-hh:mm:ss'),
          done: false
        },
      ],
      hitList: [],
      todoName: "",
      errorStatus: false,
      method: "add",
      itemIndex: 0,
      listType: 'todos'
    };
  },
  methods: {
    // add an item to the todo list
    addTodo(event) {
      event.preventDefault();
      this.method = "add";
      if (this.todoName) {
        this.todos.push({ id: this.id, title: this.todoName, createdAt: format(Date.now(), 'yyyy-MM-dd-hh:mm:ss'), updatedAt: format(Date.now(), 'yyyy-MM-dd-hh:mm:ss'), done: false });
        this.id += 1;
        this.todoName = "";
      } else {
        setTimeout(() => (this.errorStatus = true), 500);
        setTimeout(() => (this.errorStatus = false), 3000);
      }
    },
    // delete a todo item
    deleteTodo(array, id) {
      this.itemIndex = id;
      if (array === 'todos') {
        this.todos = this.todos.filter((todo) => todo.id !== id);
      } else if (array === 'hitList') {
        this.hitList = this.hitList.filter((todo) => todo.id !== id);
      }
    },
    // edit todo item
    editTodo(array, id) {
      this.itemIndex = id;
      this.listType = array
      if (array === 'todos') {
        this.todoName = this.todos.find((todo) => todo.id === id).title;
      } else if (array === 'hitList') {
        this.todoName = this.hitList.find((todo) => todo.id === id).title;
      }
      document.querySelector('input[type="text"]').focus();
      this.method = "update";
    },
    // utitlity function to update both normal list and hit list
    updateTitleAndTime(array, id) {
      return array.map((todo) => {
          if (todo.id === id) {
            todo.title = this.todoName;
            todo.updatedAt = format(Date.now(), 'yyyy-MM-dd-hh:mm:ss')
          }
          return todo;
        })
    },
    // update todo item
    updateTodo(event) {
      event.preventDefault();
      let id = this.itemIndex;
      // this.method = "update";
      let array = this.listType
      if (array === 'todos') {
        this.todos = this.updateTitleAndTime(this.todos, id)
      } else if (array === 'hitList') {
        this.hitList = this.updateTitleAndTime(this.hitList, id)
      }
      this.todoName = "";
      this.method = "add";
    },
    // utility method for hit list and other list checkbox
    checkBoxArray(array, id) {
      return array.map((todo) => {
          if (todo.id === id) {
            todo.done = !todo.done;
          }
          return todo;
        });
    },
    // mark a todo as done
    checkBoxTodo(array, id) {
      if (array === 'todos') {
        this.todos = this.checkBoxArray(this.todos, id)
      } else if (array === 'hitList') {
        this.hitList = this.checkBoxArray(this.hitList, id)
      }
    },
    // add todo to hit list
    addToHitList(id) {
      let todo = this.todos.find((todoItem) => todoItem.id === id);
      this.hitList.push(todo)
      this.todos = this.todos.filter(todoItem => todoItem.id !== todo.id)
    },
    removeFromHitList(id) {
      let todo = this.hitList.find((todoItem) => todoItem.id === id);
      this.hitList = this.hitList.filter(todoItem => todoItem.id !== todo.id)
      this.todos.push(todo)
    }
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
/* checkbox */
.linethrough {
  text-decoration: line-through;
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
/* hit list button styling */
.hit-list {
  background: var(--clr-blue-light);
  border: .5px solid var(--clr-blue-light);
  border-radius: 4px;
  padding: .2rem .4rem;
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
</style>
