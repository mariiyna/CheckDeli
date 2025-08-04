import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const darkTheme = {
  colors: {
    background: '#252525',
    'background-light': '#4e4e4e',
    'background-dark': '#393939',
    primary: '#e96e43',
  },
};

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'darkTheme',
    themes: {
      darkTheme,
    },
  },
  icons: {
    defaultSet: 'mdi',
  },
  defaults: {
    VContainer: {
      style: [{ maxWidth: '1000px' }],
    },
  },
});

export default vuetify;
