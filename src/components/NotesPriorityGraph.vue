<template>
  <div class="notes-priority-graph">
    <h2>Notes by Priority</h2>
    <v-chart class="chart" :option="chartOption" autoresize />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

// Define props to allow passing notes directly
const props = defineProps({
  notes: {
    type: Array,
    default: () => []
  }
})

// Register ECharts components
use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// Access the notes from the page context if available
const pageContext = inject('pageContext', null)

// Use either props.notes or pageContext.notes.result based on availability
const notesData = computed(() => {
  // If we have props.notes with data, use that
  if (props.notes && props.notes.length > 0) {
    return props.notes
  }
  // Otherwise try to get notes from page context
  return pageContext?.notes?.result || []
})

// Process notes data for the chart
const chartOption = computed(() => {
  // Count notes by priority
  const priorityCounts = {
    high: 0,
    medium: 0,
    low: 0
  }

  notesData.value.forEach(note => {
    const priority = note.metadata?.priority?.toLowerCase()
    if (priority && priorityCounts.hasOwnProperty(priority)) {
      priorityCounts[priority]++
    }
  })

  // Prepare data for the pie chart
  const seriesData = Object.entries(priorityCounts).map(([name, value]) => ({ name, value }))

  return {
    title: {
      text: 'Notes Distribution by Priority',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['high', 'medium', 'low']
    },
    series: [
      {
        name: 'Priority',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
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
        data: seriesData,
        color: ['#ff4d4f', '#faad14', '#52c41a'] // Red for high, yellow for medium, green for low
      }
    ]
  }
})
</script>

<style scoped>
.notes-priority-graph {
  width: 100%;
  padding: 20px;
}

.chart {
  height: 400px;
  width: 100%;
}

h2 {
  margin-bottom: 20px;
  text-align: center;
}
</style>