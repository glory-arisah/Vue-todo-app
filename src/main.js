import { createApp } from 'vue'
import App from './App.vue'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret, faPlus, faPencil, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUserSecret, faPlus, faPencil, faTimes, faCheck)

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
