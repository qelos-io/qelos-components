<script setup lang="ts">
import QelosSDK from '@qelos/sdk';
import HelloQelos from './components/HelloQelos.vue';
import CustomTable from './components/CustomTable.vue';
import NotesPriorityGraph from './components/NotesPriorityGraph.vue';
import { ref } from 'vue';
import { Edit, Delete } from '@element-plus/icons-vue';

const sdk = new QelosSDK({
  appUrl: 'https://api.qelos.io',
  fetch: globalThis.fetch.bind(globalThis),
});

const manifestURL = location.origin + '/play-manifest.json';

// Table data is passed to the component, columns are defined inside the component

// Sample data for the table - using the actual data structure provided
const tableData = ref([
  {
    "_id": "66be167b357e5500125a545b",
    "tenant": "qelos",
    "blueprint": "application",
    "identifier": "66be167b357e5500125a545a",
    "user": {
      "_id": "63864acbad458c00122eec3a",
      "firstName": "David",
      "lastName": "Meir-Levy"
    },
    "workspace": {
      "_id": "66b48dea4072ff00110dbddc",
      "name": "Qelos LTD"
    },
    "metadata": {
      "name": "app for avihai",
      "description": "app for bonopro"
    },
    "created": "2024-08-15T14:53:47.301Z",
    "updated": "2024-08-15T14:53:47.301Z",
    "__v": 0,
    "tenants": []
  },
  {
    "_id": "6704da3f7581cab57c23fcc0",
    "tenant": "qelos",
    "identifier": "6704da3f7581cab57c23fcbf",
    "user": {
      "_id": "63864acbad458c00122eec3a",
      "firstName": "David",
      "lastName": "Meir-Levy"
    },
    "workspace": {
      "_id": "66b48dea4072ff00110dbddc",
      "name": "Qelos LTD"
    },
    "blueprint": "application",
    "metadata": {
      "name": "david-dev",
      "description": ""
    },
    "indexes": [],
    "created": "2024-10-08T07:07:43.015Z",
    "updated": "2024-10-08T07:07:43.015Z",
    "__v": 0,
    "tenants": [
      {
        "_id": "6704da3f7581cab57c23fcc5",
        "tenant": "qelos",
        "identifier": "6704da3f7581cab57c23fcc4",
        "user": "63864acbad458c00122eec3a",
        "workspace": "66b48dea4072ff00110dbddc",
        "blueprint": "application_tenant",
        "metadata": {
          "application": "6704da3f7581cab57c23fcbf",
          "isReady": true,
          "hostname": "david-dev.qelos.app",
          "dnsARecord": "44.206.248.84"
        },
        "indexes": [
          "application:6704da3f7581cab57c23fcbf"
        ],
        "created": "2024-10-08T07:07:43.240Z",
        "updated": "2024-10-08T07:07:43.240Z",
        "__v": 0
      }
    ]
  },
  {
    "_id": "676d74171acd713d58aefb38",
    "tenant": "qelos",
    "identifier": "676d74171acd713d58aefb37",
    "user": {
      "_id": "63864acbad458c00122eec3a",
      "firstName": "David",
      "lastName": "Meir-Levy"
    },
    "workspace": {
      "_id": "66b48dea4072ff00110dbddc",
      "name": "Qelos LTD"
    },
    "blueprint": "application",
    "metadata": {
      "name": "real-teams-v0",
      "description": "app for paz - temporary"
    },
    "indexes": [],
    "created": "2024-12-26T15:19:51.052Z",
    "updated": "2024-12-26T15:19:51.052Z",
    "__v": 0,
    "tenants": [
      {
        "_id": "676d74171acd713d58aefb3f",
        "tenant": "qelos",
        "identifier": "676d74171acd713d58aefb3e",
        "user": "63864acbad458c00122eec3a",
        "workspace": "66b48dea4072ff00110dbddc",
        "blueprint": "application_tenant",
        "metadata": {
          "application": "676d74171acd713d58aefb37",
          "isReady": true,
          "hostname": "real-teams-v0.qelos.app",
          "dnsARecord": "44.206.248.84"
        },
        "indexes": [
          "application:676d74171acd713d58aefb37"
        ],
        "created": "2024-12-26T15:19:51.628Z",
        "updated": "2024-12-26T15:19:51.628Z",
        "__v": 0
      }
    ]
  }
]);

const notesData = ref([
  {
    _id: '1',
    metadata: {
      priority: 'high',
      title: 'High Priority Note'
    }
  },
  {
    _id: '2',
    metadata: {
      priority: 'medium',
      title: 'Medium Priority Note'
    }
  },
  {
    _id: '3',
    metadata: {
      priority: 'low',
      title: 'Low Priority Note'
    }
  }
]);

const handleEdit = (row) => {
  console.log('Edit row:', row);
};

const handleDelete = (row) => {
  console.log('Delete row:', row);
};
</script>

<template>
  <div class="app-container">
    <h1>Qelos Components Demo!</h1>
    
    <div class="section">
      <h2>Custom Table Component</h2>
      <CustomTable 
        :data="tableData" 
        @row-click="(row) => console.log('Row clicked:', row)"
        @edit="handleEdit"
        @delete="handleDelete"
      />

    </div>

    <div class="section">
      <h2>Notes Priority Graph</h2>
      <NotesPriorityGraph 
        :notes="notesData" 
      />

    </div>
    
    <div class="section manifest-section">
      <h2>Plugin Information</h2>
      <p>
        In order to use this library inside a Qelos app, copy this manifest URL and create a new plugin from it:
        <el-input type="text" :value="manifestURL" readonly />
      </p>
      <HelloQelos :sdk="sdk" />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #333;
  background-color: #f9f9fb;
  min-height: 100vh;
}

.section {
  margin-bottom: 40px;
  padding: 28px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 16px rgba(74, 78, 105, 0.08);
  border: 1px solid rgba(74, 78, 105, 0.1);
}

.manifest-section {
  background-color: rgba(74, 78, 105, 0.03);
  border: 1px solid rgba(74, 78, 105, 0.1);
}

h1 {
  margin-bottom: 24px;
  color: #4a4e69;
  font-weight: 600;
  font-size: 28px;
}

h2 {
  margin-bottom: 20px;
  color: #4a4e69;
  font-weight: 600;
  font-size: 22px;
  position: relative;
  padding-bottom: 10px;
}

h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: #4a4e69;
  border-radius: 3px;
}

:deep(.el-button--primary) {
  background-color: #4a4e69;
  border-color: #4a4e69;
}

:deep(.el-button--primary:hover) {
  background-color: #5d6282;
  border-color: #5d6282;
}

:deep(.el-button--danger) {
  background-color: #e76f51;
  border-color: #e76f51;
}

:deep(.el-button--danger:hover) {
  background-color: #f4845f;
  border-color: #f4845f;
}
</style>
