import CustomTable from './components/CustomTable.vue';
import HelloQelos from './components/HelloQelos.vue';

declare global {
  interface Window {
    registerComponent(name: string, component: any): void;
  } 
}

if (typeof window.registerComponent === 'function') {
  window.registerComponent('CustomTable', CustomTable);
  window.registerComponent('HelloQelos', HelloQelos);
}
