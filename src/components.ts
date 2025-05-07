import CustomTable from './components/CustomTable.vue';

declare global {
  interface Window {
    registerComponent(name: string, component: any): void;
  } 
}

if (typeof window.registerComponent === 'function') {
  window.registerComponent('CustomTable', CustomTable);
}
