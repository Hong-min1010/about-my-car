<template>
  <q-card>
    <q-card-section>
      <div class="text-subtitle1 q-mb-xs">차량 정보</div>
      <q-input
        v-model="localVin"
        label="차량 번호 뒷 4자리"
        dense
        outlined
        @blur="emitUpdateVin"
        @keyup.enter="emitUpdateVin"
      />

      <div class="q-mt-md row items-center q-gutter-sm">
        <q-btn
          label="주행거리 불러오기"
          color="primary"
          :loading="loading"
          :disable="!localVin"
          @click="onFetchClick"
        />
        <div v-if="mileage != null" class="text-caption">
          현재 주행거리: <b>{{ mileage.toLocaleString() }} km</b>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  vin: string;
  mileage: number | null;
  loading: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:vin', value: string): void;
  (e: 'fetch-mileage'): void;
}>();

const localVin = ref(props.vin);

watch(
  () => props.vin,
  (v) => {
    localVin.value = v;
  },
);

function emitUpdateVin() {
  emit('update:vin', localVin.value);
}

function onFetchClick() {
  emitUpdateVin();
  emit('fetch-mileage');
}
</script>
