import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'primeicons/primeicons.css'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Lara from '@primevue/themes/lara'
import { ToastService } from 'primevue'
import  ConfirmationService  from 'primevue/confirmationservice'
import Toast         from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import {MotionPlugin} from '@vueuse/motion'
import { definePreset } from '@primevue/themes'
import VueLazyLoad from 'vue3-lazyload'
const app = createApp(App)

const myPreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      contrast: {
        default: '#ffffff'
      }
    }
  },
  colorScheme: {
    light: {
      background: '#ffffff',
      surface: '#ffffff',
      overlay: '#ffffff',
      card: '#ffffff',
      // Form field styling
      formField: {
        background: '#ffffff',
        filledBackground: '#ffffff',
        filledFocusBackground: '#ffffff',
        disabledBackground: '#f9fafb',
        borderColor: '#d1d5db',
        hoverBorderColor: '#9ca3af',
        focusBorderColor: '#f97316',
        invalidBorderColor: '#ef4444',
        color: '#111827', // Darker text for better contrast
        disabledColor: '#6b7280',
        placeholderColor: '#9ca3af',
        floatLabelColor: '#6b7280',
        floatLabelFocusColor: '#f97316',
        floatLabelInvalidColor: '#ef4444',
        iconColor: '#6b7280',
        shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      },
      // Dropdown specific
      dropdown: {
        background: '#ffffff',
        hoverBackground: '#f9fafb',
        color: '#111827',
        hoverColor: '#111827',
        borderColor: '#d1d5db',
        hoverBorderColor: '#9ca3af',
        focusBorderColor: '#f97316'
      },
      // Select specific
      select: {
        background: '#ffffff',
        hoverBackground: '#f9fafb',
        color: '#111827',
        hoverColor: '#111827',
        borderColor: '#d1d5db',
        hoverBorderColor: '#9ca3af',
        focusBorderColor: '#f97316'
      },
      // Multiselect specific
      multiselect: {
        background: '#ffffff',
        hoverBackground: '#f9fafb',
        color: '#111827',
        hoverColor: '#111827',
        borderColor: '#d1d5db',
        hoverBorderColor: '#9ca3af',
        focusBorderColor: '#f97316'
      },
      // Radio button and checkbox
      toggleable: {
        background: '#ffffff',
        hoverBackground: '#f9fafb',
        borderColor: '#d1d5db',
        hoverBorderColor: '#9ca3af',
        focusBorderColor: '#f97316',
        color: '#111827'
      }
    },
    dark: {
      // Keep the same light theme values for dark mode since you don't support dark mode yet
      background: '#ffffff',
      surface: '#ffffff',
      overlay: '#ffffff',
      card: '#ffffff',
      formField: {
        background: '#ffffff',
        filledBackground: '#ffffff',
        filledFocusBackground: '#ffffff',
        disabledBackground: '#f9fafb',
        borderColor: '#d1d5db',
        hoverBorderColor: '#9ca3af',
        focusBorderColor: '#f97316',
        invalidBorderColor: '#ef4444',
        color: '#111827',
        disabledColor: '#6b7280',
        placeholderColor: '#9ca3af',
        floatLabelColor: '#6b7280',
        floatLabelFocusColor: '#f97316',
        floatLabelInvalidColor: '#ef4444',
        iconColor: '#6b7280',
        shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      },
      dropdown: {
        background: '#ffffff',
        hoverBackground: '#f9fafb',
        color: '#111827',
        hoverColor: '#111827',
        borderColor: '#d1d5db',
        hoverBorderColor: '#9ca3af',
        focusBorderColor: '#f97316'
      },
      select: {
        background: '#ffffff',
        hoverBackground: '#f9fafb',
        color: '#111827',
        hoverColor: '#111827',
        borderColor: '#d1d5db',
        hoverBorderColor: '#9ca3af',
        focusBorderColor: '#f97316'
      },
      multiselect: {
        background: '#ffffff',
        hoverBackground: '#f9fafb',
        color: '#111827',
        hoverColor: '#111827',
        borderColor: '#d1d5db',
        hoverBorderColor: '#9ca3af',
        focusBorderColor: '#f97316'
      },
      toggleable: {
        background: '#ffffff',
        hoverBackground: '#f9fafb',
        borderColor: '#d1d5db',
        hoverBorderColor: '#9ca3af',
        focusBorderColor: '#f97316',
        color: '#111827'
      }
    }
  }
});

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: myPreset,
    options:{
      darkModeSelector: 'none',
    }
  },
})
app.use(VueLazyLoad, {
  loading: '/placeholder.jpg', 
  error: '/error.jpg',             
  observerOptions: {
    rootMargin: '0px',
    threshold: 0.1,
  }
})

app.use(ToastService)
app.use(ConfirmationService)
app.use(MotionPlugin) 
app.component('Toast', Toast)
app.component('ConfirmDialog', ConfirmDialog)
app.mount('#app')