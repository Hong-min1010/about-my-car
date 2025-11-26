<template>
  <q-page padding class="bg-grey-2">
    <div class="q-mx-auto" style="max-width: 640px">
      <!-- 제목 / 설명 -->
      <div class="q-mb-md">
        <div class="text-h6">차량 소모품 교체 주기</div>
        <div class="text-caption text-grey">
          차량 번호를 입력하고 주행거리를 불러오면, 소모품 교체 주기와 교체 횟수를 계산해줍니다.
        </div>
      </div>

      <!-- 차량 번호 + 주행거리 조회 -->
      <q-card class="q-mb-lg">
        <q-card-section>
          <q-input v-model="vin" label="차량 뒷 번호 4자리" outlined dense />

          <div class="q-mt-md row items-center q-gutter-sm">
            <q-btn
              label="주행거리 불러오기"
              color="primary"
              :loading="loadingMileage"
              :disable="!vin || loadingMileage"
              @click="onFetchMileage"
            />
            <div v-if="mileage !== null" class="text-caption">
              현재 주행거리:
              <b>{{ mileage.toLocaleString() }} km</b>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- 소모품 카드들 -->
      <q-card v-if="mileage !== null">
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">소모품 상태</div>

          <div v-for="(item, index) in items" :key="item.id" class="q-mb-md">
            <div class="row items-center justify-between">
              <div>
                <div class="text-body1">{{ item.name }}</div>
                <div class="text-caption text-grey">
                  권장 교체 주기:
                  {{ item.interval.toLocaleString() }} km
                </div>
              </div>

              <q-badge :color="getBadgeColor(item)" outline>
                {{ getStatusText(item) }}
              </q-badge>
            </div>

            <!-- 진행률 바 -->
            <q-linear-progress
              class="q-mt-sm"
              :value="getProgress(item)"
              :color="getProgressColor(item)"
              size="12px"
              rounded
            />

            <!-- 교체 횟수 / 현재 주기 누적 거리 -->
            <div class="row justify-between text-caption q-mt-xs">
              <span>
                교체 횟수:
                <b>{{ getChangeCount(item) }}</b> 회
              </span>
              <span>
                현재 주기 누적:
                <b>{{ getUsedDistance(item).toLocaleString() }} km</b>
              </span>
            </div>

            <q-separator v-if="index < items.length - 1" class="q-mt-md" />
          </div>
        </q-card-section>
      </q-card>

      <div v-else class="text-caption text-grey">
        차량 번호를 입력하고 주행거리를 먼저 불러와 주세요.
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { fetchHyundaiMileage } from 'src/api/hyundai';

const $q = useQuasar();

// 차량 번호 / 주행거리 상태
const vin = ref('');
const mileage = ref<number | null>(null);
const loadingMileage = ref(false);

// 소모품 설정 (주기 km)
const items = [
  { id: 'engine_oil', name: '엔진오일', interval: 10_000 },
  { id: 'tire', name: '타이어', interval: 40_000 },
  { id: 'brake_pad', name: '브레이크 패드', interval: 30_000 },
] as const;

type Item = (typeof items)[number];

// --- 소모품별 계산 함수들 ---

// 현재 주기에서 누적 주행거리 (예: 55,000km / 10,000km → 5,000km)
function getUsedDistance(item: Item): number {
  if (mileage.value == null) return 0;
  return mileage.value % item.interval;
}

// 교체 횟수 (예: 55,000km / 10,000km → 5회 교체 완료)
function getChangeCount(item: Item): number {
  if (mileage.value == null) return 0;
  return Math.floor(mileage.value / item.interval);
}

// 게이지용 진행률 (0 ~ 1)
function getProgress(item: Item): number {
  if (mileage.value == null) return 0;
  const used = getUsedDistance(item);
  return Math.min(1, used / item.interval);
}

function getProgressColor(item: Item): string {
  const p = getProgress(item);
  if (p >= 1) return 'negative';
  if (p >= 0.8) return 'orange';
  return 'primary';
}

function getBadgeColor(item: Item): string {
  const p = getProgress(item);
  if (p >= 1) return 'negative';
  if (p >= 0.8) return 'warning';
  return 'positive';
}

function getStatusText(item: Item): string {
  const p = getProgress(item);
  if (p >= 1) return '즉시 교체 필요';
  if (p >= 0.8) return '곧 교체 시점';
  return '정상';
}

// --- 주행거리 불러오기 (차량 번호 바뀔 때마다 다른 값) ---
async function onFetchMileage() {
  if (!vin.value) return;

  loadingMileage.value = true;
  try {
    const result = await fetchHyundaiMileage(vin.value);
    mileage.value = result;

    $q.notify({
      type: 'positive',
      message: `주행거리 ${result.toLocaleString()} km 를 불러왔어요.`,
    });
  } catch (err) {
    console.error(err);
    $q.notify({
      type: 'negative',
      message: '주행거리 조회에 실패했습니다.',
    });
  } finally {
    loadingMileage.value = false;
  }
}
</script>
