<template>
  <div class="notes-priority-graph">
    <v-chart class="chart" :option="chartOption" autoresize />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';

// Register necessary ECharts components
use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

interface Note {
  _id: string;
  metadata: {
    priority?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface Props {
  notes: Note[];
}

const props = defineProps<Props>();

// Define possible priority values and their display colors
const priorityConfig = {
  high: { color: '#ff4d4f', label: 'High' },
  medium: { color: '#faad14', label: 'Medium' },
  low: { color: '#52c41a', label: 'Low' },
  none: { color: '#d9d9d9', label: 'None' }
};

// Compute the count of notes for each priority
const priorityCounts = computed(() => {
  const counts: Record<string, number> = {
    high: 0,
    medium: 0,
    low: 0,
    none: 0
  };
  
  props.notes.forEach(note => {
    const priority = note.metadata?.priority?.toLowerCase() || 'none';
    if (counts.hasOwnProperty(priority)) {
      counts[priority]++;
    } else {
      counts.none++;
    }
  });
  
  return counts;
});

// Prepare data for the pie chart
const chartData = computed(() => {
  return Object.entries(priorityCounts.value).map(([priority, count]) => ({
    value: count,
    name: priorityConfig[priority as keyof typeof priorityConfig].label,
    itemStyle: {
      color: priorityConfig[priority as keyof typeof priorityConfig].color
    }
  })).filter(item => item.value > 0); // Only show priorities with at least one note
});

// Configure the chart options
const chartOption = computed(() => ({
  title: {
    text: 'Notes by Priority',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'horizontal',
    bottom: 'bottom'
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: true,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '18',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: chartData.value
    }
  ]
}));
</script>

<style scoped>
.notes-priority-graph {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>