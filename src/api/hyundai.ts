// src/api/hyundai.ts
// import axios from 'axios'

export async function fetchHyundaiMileage(vin: string): Promise<number> {
  console.log('vin', vin);
  // TODO: 실제 현대 API로 교체
  // const { data } = await axios.get('실제_URL', {
  //   params: { vin },
  //   headers: { Authorization: `Bearer ${TOKEN}` }
  // })
  // return data.mileage

  // 지금은 테스트용 mock
  await new Promise((resolve) => setTimeout(resolve, 500));
  const min = 10_000;
  const max = 100_000;
  const mileage = Math.floor(Math.random() * (max - min + 1)) + min;

  return mileage;
}
