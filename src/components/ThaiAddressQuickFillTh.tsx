import React, { useMemo, useState } from 'react';
import { searchThaiAddresses, toQuickFillValue } from '../lib/search-th.js';
import type { QuickFillValue, SearchResult } from '../lib/types.js';

export interface ThaiAddressQuickFillProps {
  value?: string;
  limit?: number;
  placeholder?: string;
  labels?: {
    search?: string;
    subdistrict?: string;
    district?: string;
    province?: string;
    postalCode?: string;
    helper?: string;
  };
  onSelect?: (value: QuickFillValue, result: SearchResult) => void;
}

export function ThaiAddressQuickFill({
  value = '',
  limit = 8,
  placeholder = 'ค้นหาตำบล / อำเภอ / จังหวัด / รหัสไปรษณีย์',
  labels,
  onSelect,
}: ThaiAddressQuickFillProps) {
  const [query, setQuery] = useState(value);
  const [selected, setSelected] = useState<QuickFillValue | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchThaiAddresses({ query, limit });
  }, [query, limit]);

  const choose = (result: SearchResult) => {
    const next = toQuickFillValue(result);
    setSelected(next);
    setQuery(result.subdistrict);
    setIsOpen(false);
    onSelect?.(next, result);
  };

  const activeResult = results[activeIndex] ?? null;
  const showMenu = isOpen && query.trim().length > 0;

  return (
    <div
      style={{
        display: 'grid',
        gap: 16,
        padding: 18,
        borderRadius: 24,
        border: '1px solid rgba(15, 23, 42, 0.08)',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 18px 40px rgba(15, 23, 42, 0.06)',
      }}
    >
      <div style={{ position: 'relative' }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#111827' }}>
          {labels?.search ?? 'ค้นหา'}
        </label>
        <input
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
            setActiveIndex(0);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 120)}
          onKeyDown={(e) => {
            if (!results.length) {
              if (e.key === 'Escape') setIsOpen(false);
              return;
            }

            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActiveIndex((index) => (index + 1) % results.length);
            }

            if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveIndex((index) => (index - 1 + results.length) % results.length);
            }

            if (e.key === 'Enter' && activeResult) {
              e.preventDefault();
              choose(activeResult);
            }

            if (e.key === 'Escape') {
              e.preventDefault();
              setIsOpen(false);
            }
          }}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 16,
            border: '1px solid rgba(107, 114, 128, 0.24)',
            background: '#ffffff',
            fontSize: 15,
            outline: 'none',
            boxShadow: showMenu ? '0 0 0 4px rgba(37, 99, 235, 0.08)' : 'none',
          }}
        />
        <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
          {labels?.helper ?? 'พิมพ์ชื่อแขวง เขต จังหวัด หรือรหัสไปรษณีย์ แล้วใช้ลูกศรขึ้นลง + Enter เพื่อเลือก'}
        </div>
        {showMenu ? (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 18,
              overflow: 'hidden',
              boxShadow: '0 16px 35px rgba(15,23,42,0.14)',
              zIndex: 30,
            }}
          >
            {results.length ? (
              results.map((result, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={`${result.subdistrictCode}-${result.postalCode}-${result.subdistrict}`}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => choose(result)}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '13px 14px',
                      border: 0,
                      background: isActive ? 'rgba(37, 99, 235, 0.08)' : '#fff',
                      borderBottom: '1px solid rgba(0,0,0,0.05)',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#111827' }}>{result.subdistrict}</div>
                    <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                      {result.district} • {result.province} • {result.postalCode}
                    </div>
                  </button>
                );
              })
            ) : (
              <div style={{ padding: '13px 14px', fontSize: 14, color: '#6b7280' }}>ไม่พบข้อมูลที่ตรงกัน</div>
            )}
          </div>
        ) : null}
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <Field label={labels?.subdistrict ?? 'ตำบล / แขวง'} value={selected?.subdistrict ?? ''} accent />
        <Field label={labels?.district ?? 'อำเภอ / เขต'} value={selected?.district ?? ''} />
        <Field label={labels?.province ?? 'จังหวัด'} value={selected?.province ?? ''} />
        <Field label={labels?.postalCode ?? 'รหัสไปรษณีย์'} value={selected?.postalCode ?? ''} mono />
      </div>
    </div>
  );
}

function Field({ label, value, accent = false, mono = false }: { label: string; value: string; accent?: boolean; mono?: boolean }) {
  return (
    <label style={{ display: 'grid', gap: 7, fontSize: 13, color: '#374151' }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <input
        value={value}
        readOnly
        style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: 14,
          border: accent ? '1px solid rgba(37, 99, 235, 0.24)' : '1px solid #dbe2ea',
          background: accent ? 'rgba(239, 246, 255, 0.9)' : '#f8fafc',
          color: '#111827',
          fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : 'inherit',
        }}
      />
    </label>
  );
}
