import CustomTable from './components/CustomTable.vue';
import HelloQelos from './components/HelloQelos.vue';
import NotesPriorityGraph from './components/NotesPriorityGraph.vue';
import NotesPriorityBarChart from './components/NotesPriorityBarChart.vue';

declare global {
  interface Window {
    registerComponent(name: string, component: any): void;
  } 
}

if (typeof window.registerComponent === 'function') {
  window.registerComponent('CustomTable', CustomTable);
  window.registerComponent('HelloQelos', HelloQelos);
  window.registerComponent('NotesPriorityGraph', NotesPriorityGraph);
  window.registerComponent('NotesPriorityBarChart', NotesPriorityBarChart);
}
