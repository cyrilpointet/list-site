import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import Button from "./components/common/Button.vue";
import Icon from "./components/common/Icon.vue";
import Input from "./components/common/Input.vue";
import ButtonIcon from "./components/common/ButtonIcon.vue";
import Card from "./components/common/Card.vue";
import Modal from "./components/common/Modal.vue";
import Accordion from "./components/common/Accordion.vue";
import Switch from "./components/common/Switch.vue";
import Snackbar from "./components/common/Snackbar.vue";

import "./index.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component("Button", Button);
app.component("Icon", Icon);
app.component("Input", Input);
app.component("ButtonIcon", ButtonIcon);
app.component("Card", Card);
app.component("Modal", Modal);
app.component("Accordion", Accordion);
app.component("Switch", Switch);
app.component("Snackbar", Snackbar);

app.mount("#app");
