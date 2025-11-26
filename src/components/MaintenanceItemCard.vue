<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <div class="row items-center justify-between">
        <div>
          <div class="text-subtitle2">{{ item.name }}</div>
          <div class="text-caption text-grey">
            권장 교체 주기: {{ item.interval.toLocaleString() }} km
          </div>
        </div>

        <q-badge :color="badgeColor" outline>
          {{ statusText }}
        </q-badge>
      </div>

      <q-linear-progress
        class="q-mt-sm"
        :value="progress"
        :color="progressColor"
        rounded
        size="10px"
      />

      <div class="row justify-between text-caption q-mt-xs">
        <span>경과: {{ usedDistance.toLocaleString() }} km</span>
        <span>남은: {{ remainDistance.toLocaleString() }} km</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Item {
  id: string;
  name: string;
  interval: number;
}

interface Props {
  item: Item;
  currentMileage: number | null;
  lastChangeKm?: number | null;
}

const props = defineProps<Props>();

const usedDistance = computed(() => {
  if (props.currentMileage == null || !props.lastChangeKm) return 0;
  return Math.max(0, props.currentMileage - props.lastChangeKm);
});

const remainDistance = computed(() => {
  const remain = props.item.interval - usedDistance.value;
  return Math.max(0, remain);
});

const progress = computed(() => {
  if (!props.item.interval) return 0;
  return Math.min(1, usedDistance.value / props.item.interval);
});

const progressColor = computed(() => {
  if (progress.value >= 1) return 'negative';
  if (progress.value >= 0.8) return 'orange';
  return 'primary';
});

const badgeColor = computed(() => {
  if (progress.value >= 1) return 'negative';
  if (progress.value >= 0.8) return 'warning';
  return 'positive';
});

const statusText = computed(() => {
  if (progress.value >= 1) return '즉시 교체';
  if (progress.value >= 0.8) return '곧 교체';
  return '정상';
});
</script>
