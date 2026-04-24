# thai-address-autofill

เครื่องมือ autocomplete และ autofill สำหรับที่อยู่ในประเทศไทย ใช้งานกับ React ได้ทันที

ตัวนี้ทำขึ้นมาเพื่อช่วยลดงานจุกจิกเวลาทำฟอร์มที่อยู่ไทย
พิมพ์บางส่วนแล้วเลือกผลลัพธ์ จากนั้นเอาตำบล อำเภอ จังหวัด และรหัสไปรษณีย์ไปเติมต่อได้เลย

## จุดเด่น

- ค้นหาที่อยู่ไทยจากข้อความที่พิมพ์บางส่วน
- คืนค่าตำบล อำเภอ จังหวัด และรหัสไปรษณีย์
- ใช้ได้ทั้งแบบคอมโพเนนต์ React และแบบ headless
- ไม่ต้องพึ่ง backend หรือ API key
- มีทั้งชุดข้อมูลแบบไทยล้วน และแบบไทย + อังกฤษ

## ติดตั้ง

```bash
npm install thai-address-autofill
```

## ทางเลือกในการ import

### `thai-address-autofill`
ชุดเต็ม
- ค้นหาได้ทั้งไทยและอังกฤษ
- มี React components ให้ใช้ทันที

### `thai-address-autofill/th`
ชุดไทยล้วน
- ขนาดเบากว่า
- ค้นหาเฉพาะภาษาไทย
- มี React components ให้ใช้ทันที

### `thai-address-autofill/core`
แบบ headless ชุดเต็ม
- ค้นหาได้ทั้งไทยและอังกฤษ
- มีฟังก์ชันค้นหา ตรวจสอบ และ list helpers

### `thai-address-autofill/core/th`
แบบ headless ไทยล้วน
- เบาที่สุด
- เหมาะกับกรณีที่อยากทำ UI เองทั้งหมด

## ตัวอย่างการใช้งาน

```tsx
import { ThaiAddressAutocomplete } from 'thai-address-autofill/th';
import { useState } from 'react';

export function AddressForm() {
  const [form, setForm] = useState({
    subdistrict: '',
    district: '',
    province: '',
    postalCode: '',
  });

  return (
    <ThaiAddressAutocomplete
      value={form.subdistrict}
      onChange={(subdistrict) => setForm((current) => ({ ...current, subdistrict }))}
      onSelect={(result) => {
        setForm({
          subdistrict: result.subdistrict,
          district: result.district,
          province: result.province,
          postalCode: result.postalCode,
        });
      }}
    />
  );
}
```

## Components

มีคอมโพเนนต์พร้อมใช้ดังนี้
- `ThaiAddressAutocomplete`
- `ThaiAddressQuickFill`
- เวอร์ชันไทยล้วนอยู่ใต้ path `/th`

## ใช้งานแบบ headless

```ts
import {
  searchThaiAddresses,
  validateThaiAddress,
  listProvinces,
} from 'thai-address-autofill/core/th';
```

## ที่มาของข้อมูล

สร้างจากข้อมูลของ:
- `Dhanabhon/thailand-geodata`
- license: MIT
- source: <https://github.com/Dhanabhon/thailand-geodata>

แพ็กเกจที่ publish ขึ้น npm ไม่ได้ใส่ raw CSV ไปด้วย
แต่ใช้ข้อมูลที่ generate แล้วแทน

ชุดข้อมูลที่ใช้ตอนนี้ครอบคลุม:
- 77 จังหวัด
- 928 อำเภอ/เขต
- 7,436 ตำบล/แขวง

หมายเหตุ:
- ตัวเลข 7,436 รวมหน่วยข้อมูลฝั่งกรุงเทพฯ ไว้แล้ว
- ชื่อซ้ำมีอยู่จริงในข้อมูลที่อยู่ไทย จึงต้องอาศัยลำดับชั้นและรหัสประกอบ ไม่ได้ดูจากชื่ออย่างเดียว

## Demo

- GitHub: <https://github.com/shane-wish/thai-address-autofill>
- Demo: <https://shane-wish.github.io/thai-address-autofill/>

รันในเครื่อง:

```bash
npm run demo
```

## Benchmark

```bash
npm run benchmark
```

ผลคร่าว ๆ ตอนนี้:
- search: เฉลี่ยประมาณ 11–19ms
- validate: เฉลี่ยประมาณ 0.002ms

---

# English

Thai address autocomplete and autofill utilities for React.

This package helps with the annoying parts of Thai address forms.
Users can type a partial address, pick a result, and then use the returned subdistrict, district, province, and postal code to fill the rest of the form.

## Highlights

- search Thai addresses from partial input
- return subdistrict, district, province, and postal code
- use ready-made React components or headless utilities
- no backend or API key required
- includes both Thai-only and Thai + English search builds

## Install

```bash
npm install thai-address-autofill
```

## Entry points

### `thai-address-autofill`
Full build.
- Thai + English search
- React components included

### `thai-address-autofill/th`
Thai-only build.
- smaller payload
- Thai search only
- React components included

### `thai-address-autofill/core`
Headless full build.
- Thai + English search
- search, validation, and list helpers

### `thai-address-autofill/core/th`
Headless Thai-only build.
- smallest path
- useful when you want to build the UI yourself

## Example

```tsx
import { ThaiAddressAutocomplete } from 'thai-address-autofill/th';
import { useState } from 'react';

export function AddressForm() {
  const [form, setForm] = useState({
    subdistrict: '',
    district: '',
    province: '',
    postalCode: '',
  });

  return (
    <ThaiAddressAutocomplete
      value={form.subdistrict}
      onChange={(subdistrict) => setForm((current) => ({ ...current, subdistrict }))}
      onSelect={(result) => {
        setForm({
          subdistrict: result.subdistrict,
          district: result.district,
          province: result.province,
          postalCode: result.postalCode,
        });
      }}
    />
  );
}
```

## Components

Included React UI:
- `ThaiAddressAutocomplete`
- `ThaiAddressQuickFill`
- Thai-only variants under `/th`

## Headless usage

```ts
import {
  searchThaiAddresses,
  validateThaiAddress,
  listProvinces,
} from 'thai-address-autofill/core/th';
```

## Data source

Generated from:
- `Dhanabhon/thailand-geodata`
- license: MIT
- source: <https://github.com/Dhanabhon/thailand-geodata>

The published npm package does not include raw CSV files.
It ships generated package data instead.

Current source coverage:
- 77 provinces
- 928 districts
- 7,436 subdistricts

Notes:
- the 7,436 count includes Bangkok administrative equivalents
- duplicate names exist in real Thai address data, so matching relies on hierarchy and codes, not name alone

## Demo

- GitHub: <https://github.com/shane-wish/thai-address-autofill>
- Demo: <https://shane-wish.github.io/thai-address-autofill/>

Run locally:

```bash
npm run demo
```

## Benchmark

```bash
npm run benchmark
```

Current rough results:
- search: around 11–19ms average
- validate: around 0.002ms average

## License

MIT
