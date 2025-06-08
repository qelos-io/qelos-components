<template>
  <div class="notes-priority-bar-chart">
    <h2>Notes by Priority</h2>
    <v-chart class="chart" :option="chartOption" autoresize />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent
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
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent
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

  // Prepare data for the bar chart
  const categories = Object.keys(priorityCounts)
  const data = Object.values(priorityCounts)
  
  // Define colors for different priorities
  const colors = {
    high: '#ff4d4f',
    medium: '#faad14',
    low: '#52c41a'
  }
  
  // Create color array in the same order as categories
  const colorList = categories.map(category => colors[category])

  return {
    title: {
      text: 'Notes Distribution by Priority',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value',
      minInterval: 1 // Ensure whole numbers for note counts
    },
    series: [
      {
        name: 'Number of Notes',
        type: 'bar',
        barWidth: '60%',
        data: data.map((value, index) => ({
          value,
          itemStyle: {
            color: colorList[index]
          }
        })),
        label: {
          show: true,
          position: 'top',
          formatter: '{c}'
        }
      }
    ]
  }
})
</script>

<style scoped>
.notes-priority-bar-chart {
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
