<script setup>
import { computed, ref } from 'vue'

const range = ref('7d')
const query = ref('')
const onlyOpenTasks = ref(false)

const kpis = computed(() => {
  const sets = {
    '7d': [
      { label: 'Revenue', value: '$42.8K', delta: '+8.6%' },
      { label: 'Orders', value: '1,248', delta: '+5.1%' },
      { label: 'Active Users', value: '6,320', delta: '+4.2%' },
      { label: 'Tickets', value: '37', delta: '-11.9%' },
    ],
    '30d': [
      { label: 'Revenue', value: '$173.4K', delta: '+12.4%' },
      { label: 'Orders', value: '5,112', delta: '+7.8%' },
      { label: 'Active Users', value: '21,905', delta: '+9.3%' },
      { label: 'Tickets', value: '164', delta: '-6.2%' },
    ],
    qtr: [
      { label: 'Revenue', value: '$492.6K', delta: '+16.1%' },
      { label: 'Orders', value: '14,908', delta: '+11.4%' },
      { label: 'Active Users', value: '64,300', delta: '+13.7%' },
      { label: 'Tickets', value: '472', delta: '-3.1%' },
    ],
  }

  return sets[range.value]
})

const chartSeries = computed(() => {
  const sets = {
    '7d': [58, 62, 55, 71, 66, 75, 73],
    '30d': [44, 52, 57, 61, 64, 69, 72],
    qtr: [35, 49, 56, 62, 68, 74, 81],
  }

  return sets[range.value]
})

const taskSeed = [
  { id: 1, title: 'Review churn cohort for onboarding flow', status: 'open', owner: 'Mina' },
  { id: 2, title: 'Prepare sprint demo dashboard notes', status: 'open', owner: 'Noah' },
  { id: 3, title: 'Validate failed webhook retries', status: 'blocked', owner: 'Iris' },
  { id: 4, title: 'Publish weekly KPI summary', status: 'done', owner: 'Evan' },
  { id: 5, title: 'Tune alert thresholds for API latency', status: 'open', owner: 'Kai' },
]

const tasks = ref(taskSeed)

const notifications = ref([
  { id: 1, title: 'Database backup completed', level: 'Info', read: false },
  { id: 2, title: 'Payment gateway errors dropped below threshold', level: 'Update', read: false },
  { id: 3, title: 'New member joined your project', level: 'Team', read: true },
])

const activities = ref([
  { id: 1, who: 'Olivia', action: 'updated pricing experiment metrics', when: '2m ago' },
  { id: 2, who: 'Liam', action: 'resolved 5 support incidents', when: '17m ago' },
  { id: 3, who: 'Emma', action: 'shared Q2 performance summary', when: '42m ago' },
  { id: 4, who: 'Ava', action: 'created a retention analysis board', when: '1h ago' },
])

const health = ref([
  { id: 1, name: 'API Uptime', value: 99, target: '99.95%' },
  { id: 2, name: 'Queue Throughput', value: 87, target: '90%' },
  { id: 3, name: 'Error Budget', value: 64, target: '< 75%' },
])

const openTasksCount = computed(() => tasks.value.filter((task) => task.status !== 'done').length)
const unreadCount = computed(() => notifications.value.filter((item) => !item.read).length)

const filteredTasks = computed(() => {
  const normalized = query.value.trim().toLowerCase()

  return tasks.value.filter((task) => {
    const textMatch =
      task.title.toLowerCase().includes(normalized) || task.owner.toLowerCase().includes(normalized)

    if (!textMatch) {
      return false
    }

    if (onlyOpenTasks.value) {
      return task.status !== 'done'
    }

    return true
  })
})

const toggleTaskStatus = (taskId) => {
  tasks.value = tasks.value.map((task) => {
    if (task.id !== taskId) {
      return task
    }

    if (task.status === 'done') {
      return { ...task, status: 'open' }
    }

    if (task.status === 'blocked') {
      return { ...task, status: 'open' }
    }

    return { ...task, status: 'done' }
  })
}

const clearReadNotifications = () => {
  notifications.value = notifications.value.filter((item) => !item.read)
}

const markAllNotificationsRead = () => {
  notifications.value = notifications.value.map((item) => ({ ...item, read: true }))
}

const addQuickTask = () => {
  const id = tasks.value.length + 1
  tasks.value = [
    {
      id,
      title: `Follow up on dashboard insight #${id}`,
      status: 'open',
      owner: 'You',
    },
    ...tasks.value,
  ]
}

const statusLabel = (status) => {
  if (status === 'done') return 'Done'
  if (status === 'blocked') return 'Blocked'
  return 'Open'
}
</script>

<template>
  <section class="dashboard" aria-label="Dashboard">
    <header class="dashboard__header">
      <div>
        <h2>Dashboard</h2>
        <p>Live summary of product performance, operations, and team execution.</p>
      </div>

      <div class="dashboard__actions">
        <label class="dashboard__range" for="range-select">Range</label>
        <select id="range-select" v-model="range">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="qtr">This quarter</option>
        </select>
      </div>
    </header>

    <div class="kpi-grid" role="list" aria-label="KPI cards">
      <article v-for="item in kpis" :key="item.label" class="kpi-card" role="listitem">
        <p class="kpi-card__label">{{ item.label }}</p>
        <p class="kpi-card__value">{{ item.value }}</p>
        <p class="kpi-card__delta">{{ item.delta }}</p>
      </article>
    </div>

    <div class="dashboard__layout">
      <article class="widget widget--wide" aria-label="Performance trend">
        <div class="widget__head">
          <h3>Performance Trend</h3>
          <p>Normalized score</p>
        </div>
        <div class="bars" role="img" aria-label="Performance trend bars">
          <div v-for="(point, index) in chartSeries" :key="index" class="bar-wrap">
            <div class="bar" :style="{ height: `${point}%` }"></div>
            <span class="bar__label">{{ index + 1 }}</span>
          </div>
        </div>
      </article>

      <article class="widget" aria-label="Team health metrics">
        <div class="widget__head">
          <h3>System Health</h3>
          <p>Target tracking</p>
        </div>

        <ul class="health-list">
          <li v-for="metric in health" :key="metric.id">
            <div class="health-list__meta">
              <span>{{ metric.name }}</span>
              <span>{{ metric.target }}</span>
            </div>
            <div class="health-list__track">
              <div class="health-list__fill" :style="{ width: `${metric.value}%` }"></div>
            </div>
          </li>
        </ul>
      </article>

      <article class="widget" aria-label="Task management">
        <div class="widget__head">
          <h3>Tasks</h3>
          <p>{{ openTasksCount }} active</p>
        </div>

        <div class="toolbar">
          <input v-model="query" type="search" placeholder="Search tasks or owners" aria-label="Search tasks" />
          <label>
            <input v-model="onlyOpenTasks" type="checkbox" />
            Open only
          </label>
        </div>

        <ul class="task-list">
          <li v-for="task in filteredTasks" :key="task.id">
            <button type="button" class="task-list__toggle" @click="toggleTaskStatus(task.id)">
              {{ task.status === 'done' ? '↺' : '✓' }}
            </button>
            <div class="task-list__content">
              <p>{{ task.title }}</p>
              <small>{{ task.owner }}</small>
            </div>
            <span class="task-list__status">{{ statusLabel(task.status) }}</span>
          </li>
        </ul>

        <button type="button" class="ghost-btn" @click="addQuickTask">Add quick task</button>
      </article>

      <article class="widget" aria-label="Activity feed">
        <div class="widget__head">
          <h3>Activity Feed</h3>
          <p>Recent updates</p>
        </div>
        <ul class="feed">
          <li v-for="event in activities" :key="event.id">
            <p><strong>{{ event.who }}</strong> {{ event.action }}</p>
            <small>{{ event.when }}</small>
          </li>
        </ul>
      </article>

      <article class="widget" aria-label="Notifications">
        <div class="widget__head">
          <h3>Notifications</h3>
          <p>{{ unreadCount }} unread</p>
        </div>
        <ul class="notice-list">
          <li v-for="notice in notifications" :key="notice.id" :class="{ 'notice-list__item--read': notice.read }">
            <p>{{ notice.title }}</p>
            <small>{{ notice.level }}</small>
          </li>
        </ul>

        <div class="button-row">
          <button type="button" class="ghost-btn" @click="markAllNotificationsRead">Mark all read</button>
          <button type="button" class="ghost-btn" @click="clearReadNotifications">Clear read</button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dashboard__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: color-mix(in srgb, var(--color-background-soft) 92%, transparent);
}

.dashboard__header h2 {
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.15rem;
}

.dashboard__header p {
  color: var(--color-text);
}

.dashboard__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dashboard__range {
  font-size: 0.85rem;
}

select,
input[type='search'] {
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  border-radius: 10px;
  padding: 0.45rem 0.6rem;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
}

.kpi-card {
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  border-radius: 14px;
  padding: 0.85rem;
}

.kpi-card__label {
  font-size: 0.82rem;
}

.kpi-card__value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.2;
  margin: 0.25rem 0;
}

.kpi-card__delta {
  color: var(--color-primary);
  font-weight: 600;
}

.dashboard__layout {
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

.widget {
  grid-column: span 4;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 0.85rem;
  background: var(--color-background-soft);
}

.widget--wide {
  grid-column: span 8;
}

.widget__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.widget__head h3 {
  font-size: 1rem;
  font-weight: 650;
  color: var(--color-heading);
}

.widget__head p {
  font-size: 0.82rem;
}

.bars {
  display: flex;
  align-items: flex-end;
  gap: 0.45rem;
  height: 160px;
}

.bar-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.bar {
  width: 100%;
  border-radius: 8px;
  min-height: 6px;
  background: color-mix(in srgb, var(--color-primary) 84%, var(--color-background-mute));
}

.bar__label {
  font-size: 0.72rem;
}

.health-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.health-list__meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  margin-bottom: 0.25rem;
}

.health-list__track {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-background-mute) 85%, transparent);
}

.health-list__fill {
  height: 100%;
  background: var(--color-primary);
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
}

.toolbar label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.task-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.task-list li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.5rem;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 0.45rem;
  background: var(--color-background);
}

.task-list__toggle {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-text);
  cursor: pointer;
}

.task-list__content p {
  color: var(--color-heading);
  font-weight: 600;
  line-height: 1.25;
}

.task-list__content small,
.task-list__status,
.feed small,
.notice-list small {
  font-size: 0.78rem;
}

.task-list__status {
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 0.15rem 0.5rem;
}

.feed,
.notice-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.feed li,
.notice-list li {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 0.5rem 0.6rem;
  background: var(--color-background);
}

.notice-list__item--read {
  opacity: 0.75;
}

.button-row {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.45rem;
}

.ghost-btn {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 0.4rem 0.65rem;
  background: color-mix(in srgb, var(--color-background) 80%, transparent);
  color: var(--color-text);
  font-weight: 600;
  cursor: pointer;
}

.ghost-btn:hover {
  border-color: var(--color-border-hover);
}

@media (max-width: 980px) {
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .widget,
  .widget--wide {
    grid-column: span 6;
  }
}

@media (max-width: 760px) {
  .dashboard__header {
    flex-direction: column;
    align-items: stretch;
  }

  .dashboard__actions {
    width: 100%;
    justify-content: space-between;
  }

  .widget,
  .widget--wide {
    grid-column: span 12;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .button-row {
    flex-direction: column;
  }
}

@media (max-width: 520px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>