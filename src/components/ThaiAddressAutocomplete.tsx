import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { searchThaiAddresses } from '../lib/search.js';
import type { SearchResult } from '../lib/types.js';

export interface ThaiAddressAutocompleteProps {
  value?: string;
  placeholder?: string;
  limit?: number;
  onChange?: (value: string) => void;
  onSelect?: (result: SearchResult) => void;
  className?: string;
  inputClassName?: string;
  listClassName?: string;
  itemClassName?: string;
  emptyText?: string;
  selectedText?: string;
}

export function ThaiAddressAutocomplete({
  value,
  placeholder = 'พิมพ์ตำบล / อำเภอ / จังหวัด / รหัสไปรษณีย์',
  limit = 8,
  onChange,
  onSelect,
  className,
  inputClassName,
  listClassName,
  itemClassName,
  emptyText = 'ไม่พบข้อมูลที่ตรงกัน',
  selectedText = 'Selected',
}: ThaiAddressAutocompleteProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(value ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxId = useId();

  const currentValue = isControlled ? (value ?? '') : internalValue;

  useEffect(() => {
    if (isControlled) return;
    setInternalValue(value ?? '');
  }, [isControlled, value]);

  const results = useMemo(() => {
    if (!currentValue.trim()) return [];
    return searchThaiAddresses({ query: currentValue, limit }, 'full');
  }, [currentValue, limit]);

  useEffect(() => {
    setActiveIndex(0);
  }, [currentValue]);

  const commitValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const handleSelect = (result: SearchResult) => {
    commitValue(result.subdistrict);
    onSelect?.(result);
    setSelectedLabel(result.label);
    setIsOpen(false);
  };

  const showMenu = isOpen && currentValue.trim().length > 0;
  const activeResult = results[activeIndex] ?? null;

  return (
    <div className={className} style={{ position: 'relative', display: 'grid', gap: 8 }}>
      <input
        ref={inputRef}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showMenu}
        aria-controls={listboxId}
        aria-activedescendant={activeResult ? `${listboxId}-option-${activeIndex}` : undefined}
        value={currentValue}
        placeholder={placeholder}
        onChange={(e) => {
          commitValue(e.target.value);
          setSelectedLabel(null);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 120)}
        onKeyDown={(e) => {
          if (!showMenu && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            setIsOpen(true);
            return;
          }

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
            handleSelect(activeResult);
          }

          if (e.key === 'Escape') {
            e.preventDefault();
            setIsOpen(false);
          }
        }}
        className={inputClassName}
        style={{
          width: '100%',
          padding: '13px 14px',
          borderRadius: 14,
          border: '1px solid rgba(107, 114, 128, 0.28)',
          background: '#ffffff',
          boxShadow: showMenu ? '0 0 0 4px rgba(37, 99, 235, 0.08)' : 'none',
          outline: 'none',
        }}
      />

      {selectedLabel ? (
        <div style={{ fontSize: 12, color: '#6b7280' }}>{selectedText}: {selectedLabel}</div>
      ) : null}

      {showMenu ? (
        <div
          id={listboxId}
          role="listbox"
          className={listClassName}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 16,
            boxShadow: '0 20px 45px rgba(15,23,42,0.14)',
            overflow: 'hidden',
            zIndex: 20,
          }}
        >
          {results.length ? (
            results.map((result, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  id={`${listboxId}-option-${index}`}
                  key={`${result.subdistrictCode}-${result.postalCode}-${result.subdistrict}`}
                  role="option"
                  aria-selected={isActive}
                  type="button"
                  className={itemClassName}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => handleSelect(result)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '13px 14px',
                    border: 0,
                    background: isActive ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    transition: 'background 120ms ease',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#111827' }}>{result.subdistrict}</div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                    {result.district} • {result.province} • {result.postalCode}
                    {result.subdistrictEn ? <span> · {result.subdistrictEn}, {result.districtEn}, {result.provinceEn}</span> : null}
                  </div>
                </button>
              );
            })
          ) : (
            <div style={{ padding: '13px 14px', fontSize: 14, color: '#6b7280' }}>{emptyText}</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
