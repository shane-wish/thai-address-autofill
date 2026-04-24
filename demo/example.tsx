import React, { useState } from 'react';
import {
  ThaiAddressAutocomplete as ThaiAddressAutocompleteFull,
  ThaiAddressQuickFill as ThaiAddressQuickFillFull,
} from '../src';
import {
  ThaiAddressAutocomplete as ThaiAddressAutocompleteTh,
  ThaiAddressQuickFill as ThaiAddressQuickFillTh,
} from '../src/index-th';
import type { QuickFillValue } from '../src';

export function Example() {
  const [fullValue, setFullValue] = useState('');
  const [fullSelected, setFullSelected] = useState<QuickFillValue | null>(null);
  const [thSelected, setThSelected] = useState<QuickFillValue | null>(null);

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <h1 style={styles.title}>thai-address-autofill</h1>
        <p style={styles.lead}>Thai address autocomplete + autofill for React.</p>
        <p style={styles.copy}>
          Search Thai addresses from partial input and fill the rest of the form with structured results.
        </p>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.h2}>QuickFill</h2>
          <p style={styles.sectionNote}>Pick one result, then fill the rest.</p>
        </div>

        <div style={styles.grid}>
          <Card title="Full" body="Thai + English search.">
            <ThaiAddressQuickFillFull
              labels={labelsFull}
              onSelect={(value) => setFullSelected(value)}
            />
            <Payload value={fullSelected} />
          </Card>

          <Card title="Thai-only" body="Smaller import path for Thai-first usage.">
            <ThaiAddressQuickFillTh
              labels={labelsTh}
              onSelect={(value) => setThSelected(value)}
            />
            <Payload value={thSelected} />
          </Card>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.h2}>Autocomplete</h2>
          <p style={styles.sectionNote}>Same data, direct input flow.</p>
        </div>

        <div style={styles.grid}>
          <Card title="Full" body="Autocomplete with Thai + English search.">
            <ThaiAddressAutocompleteFull
              value={fullValue}
              selectedText="ล่าสุด"
              onChange={setFullValue}
              onSelect={(result) => {
                setFullValue(result.subdistrict);
                setFullSelected(result);
              }}
            />
            <Payload value={fullSelected} />
          </Card>

          <Card title="Thai-only" body="Autocomplete with Thai-only search.">
            <ThaiAddressAutocompleteTh
              selectedText="ล่าสุด"
              onSelect={(result) => setThSelected(result)}
            />
            <Payload value={thSelected} />
          </Card>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 1120,
    margin: '0 auto',
    padding: '40px 20px 72px',
    display: 'grid',
    gap: 28,
    color: '#111827',
    background: '#f8fafc',
  },
  header: {
    display: 'grid',
    gap: 8,
    maxWidth: 820,
  },
  title: {
    margin: 0,
    fontSize: 28,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  lead: {
    margin: 0,
    fontSize: 16,
    lineHeight: 1.55,
    color: '#111827',
  },
  copy: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.6,
    color: '#4b5563',
    maxWidth: 760,
  },
  section: {
    display: 'grid',
    gap: 14,
  },
  sectionHeader: {
    display: 'grid',
    gap: 4,
  },
  h2: {
    margin: 0,
    fontSize: 18,
    lineHeight: 1.3,
    fontWeight: 700,
  },
  sectionNote: {
    margin: 0,
    fontSize: 13,
    lineHeight: 1.5,
    color: '#6b7280',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 16,
  },
};

const labelsFull = {
  search: 'Search / ค้นหาที่อยู่',
  subdistrict: 'Subdistrict / แขวง-ตำบล',
  district: 'District / เขต-อำเภอ',
  province: 'Province / จังหวัด',
  postalCode: 'Postal code / รหัสไปรษณีย์',
  helper: 'Try Lumphini, ลุมพินี, or 10330',
};

const labelsTh = {
  search: 'ค้นหาที่อยู่',
  subdistrict: 'แขวง / ตำบล',
  district: 'เขต / อำเภอ',
  province: 'จังหวัด',
  postalCode: 'รหัสไปรษณีย์',
  helper: 'ลองพิมพ์ ลุมพินี หรือ 10330',
};

function Card({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <section style={styles.card}>
      <div style={{ display: 'grid', gap: 4 }}>
        <h3 style={styles.cardTitle}>{title}</h3>
        <p style={styles.cardBody}>{body}</p>
      </div>
      {children}
    </section>
  );
}

function Payload({ value }: { value: QuickFillValue | null }) {
  return <pre style={styles.payload}>{JSON.stringify(value, null, 2) || 'null'}</pre>;
}

styles.card = {
  padding: 18,
  borderRadius: 12,
  background: '#ffffff',
  border: '1px solid #dbe2ea',
  display: 'grid',
  gap: 12,
};
styles.cardTitle = {
  margin: 0,
  fontSize: 15,
  lineHeight: 1.35,
  fontWeight: 700,
};
styles.cardBody = {
  margin: 0,
  fontSize: 13,
  lineHeight: 1.55,
  color: '#6b7280',
};
styles.payload = {
  margin: 0,
  padding: 14,
  borderRadius: 10,
  background: '#111827',
  color: '#dbeafe',
  overflowX: 'auto',
  fontSize: 12,
  lineHeight: 1.55,
};
