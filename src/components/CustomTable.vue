<template>
  <div class="custom-table-container">
    <el-table 
      :data="data" 
      style="width: 100%"
      :border="border"
      :stripe="stripe"
      :highlight-current-row="highlightCurrentRow"
      @row-click="handleRowClick"
    >
      <template v-for="column in columns" :key="column.prop">
        <el-table-column 
          :prop="column.prop" 
          :label="column.label" 
          :fixed="column.fixed"
          :min-width="getColumnWidth(column)"
          :sortable="column.sortable"
          :align="column.align || 'left'"
        >
          <template #default="scope" v-if="column.prop === '_operations'">
            <div class="operations-container">
              <el-button size="small" type="primary" @click.stop="handleEditClick(scope.row)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button size="small" type="danger" @click.stop="handleDeleteClick(scope.row)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </template>
          <template #default="scope" v-else-if="column.renderFunction">
            {{ column.renderFunction(scope.row) }}
          </template>
          <template #default="scope" v-else-if="column.prop.includes('.')">
            {{ getNestedValue(scope.row, column.prop) }}
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="table-pagination" v-if="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import { Edit, Delete } from '@element-plus/icons-vue';

interface Column {
  prop: string;
  label: string;
  fixed?: boolean;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  minWidth?: string | number;
  renderFunction?: (row: any) => any;
}

interface Props {
  data: any[];
}

const props = defineProps<Props>();

// Hard-coded columns configuration
const columns = [
  {
    prop: "identifier",
    label: "ID",
    fixed: false
  },
  {
    prop: "metadata.name",
    label: "Name",
    fixed: false
  },
  {
    prop: "tenants[0].metadata.hostname",
    label: "Hostname",
    fixed: false,
    renderFunction: (row: any) => {
      if (row.tenants && row.tenants.length > 0 && row.tenants[0].metadata && row.tenants[0].metadata.hostname) {
        return row.tenants[0].metadata.hostname;
      }
      return '—'; // em dash for empty values
    }
  },
  {
    prop: "metadata.description",
    label: "Description",
    fixed: false
  },
  {
    prop: "tenants[0].metadata.dnsARecord",
    label: "A Record",
    fixed: false,
    renderFunction: (row: any) => {
      if (row.tenants && row.tenants.length > 0 && row.tenants[0].metadata && row.tenants[0].metadata.dnsARecord) {
        return row.tenants[0].metadata.dnsARecord;
      }
      return '—'; // em dash for empty values
    }
  },
  {
    prop: "_operations",
    label: " "
  }
];

// Default table settings
const border = ref(true);
const stripe = ref(true);
const highlightCurrentRow = ref(false);
const pagination = ref(true);
const total = computed(() => props.data?.length || 0);

const emit = defineEmits([
  'row-click',
  'size-change',
  'current-change',
  'update:currentPage',
  'update:pageSize',
  'edit',
  'delete'
]);

const currentPage = ref(1);
const pageSize = ref(10);

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((prev, curr) => {
    // Handle array access pattern like 'tenants[0]'
    if (curr.includes('[') && curr.includes(']')) {
      const arrayName = curr.substring(0, curr.indexOf('['));
      const indexStr = curr.substring(curr.indexOf('[') + 1, curr.indexOf(']'));
      const index = parseInt(indexStr, 10);
      
      if (prev && prev[arrayName] && Array.isArray(prev[arrayName]) && prev[arrayName].length > index) {
        return prev[arrayName][index];
      }
      return undefined;
    }
    
    return prev && prev[curr] !== undefined ? prev[curr] : undefined;
  }, obj) || '—'; // Return em dash for undefined or null values
};

const getColumnWidth = (column: Column) => {
  if (column.width) return column.width;
  if (column.minWidth) return column.minWidth;
  
  if (column.prop === 'identifier' || column.prop === 'dns_record') return '120';
  if (column.prop === '_operations') return '100';
  return '150';
};

const handleRowClick = (row: any, column: any, event: Event) => {
  emit('row-click', row, column, event);
};

const handleEditClick = (row: any) => {
  emit('edit', row);
};

const handleDeleteClick = (row: any) => {
  emit('delete', row);
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  emit('size-change', val);
  emit('update:pageSize', val);
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  emit('current-change', val);
  emit('update:currentPage', val);
};
</script>

<style scoped>
.custom-table-container {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(74, 78, 105, 0.08);
  border: 1px solid rgba(74, 78, 105, 0.1);
}

.operations-container {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.table-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table) {
  --el-table-header-bg-color: rgba(74, 78, 105, 0.05);
  --el-table-row-hover-bg-color: rgba(74, 78, 105, 0.03);
  --el-table-border-color: rgba(74, 78, 105, 0.1);
  font-size: 14px;
  border-radius: 10px;
}

:deep(.el-table__header) {
  font-weight: 600;
}

:deep(.el-table th) {
  background-color: var(--el-table-header-bg-color);
  color: #4a4e69;
  font-weight: 600;
  padding: 16px 12px;
  border-bottom: 2px solid rgba(74, 78, 105, 0.15);
}

:deep(.el-table td) {
  padding: 14px 12px;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: rgba(74, 78, 105, 0.02);
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background-color: rgba(74, 78, 105, 0.05);
}

:deep(.el-table__row) {
  transition: background-color 0.2s ease;
}

:deep(.el-pagination) {
  --el-pagination-button-color: #4a4e69;
  --el-pagination-hover-color: #4a4e69;
}

:deep(.el-pagination .el-pagination__jump) {
  color: #4a4e69;
}

:deep(.el-pagination .btn-prev, .el-pagination .btn-next) {
  background-color: rgba(74, 78, 105, 0.05);
  border-radius: 4px;
}

:deep(.el-pagination .el-pager li.is-active) {
  background-color: #4a4e69;
  color: white;
}
</style>