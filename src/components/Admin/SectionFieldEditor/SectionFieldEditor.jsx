import { useState } from "react";
import { getFieldLabel } from "../../../config/fieldLabels";
import { isIconNameField, isColorField, isImageField } from "../../../config/fieldTypes";
import IconPicker from "../IconPicker/IconPicker";
import ImageField from "../ImageField/ImageField";
import Modal from "../Modal/Modal";
import "./SectionFieldEditor.css";

// فعال/غیرفعال بودن هر آیتم از طریق دکمه‌ی توگل داخل جدول کنترل می‌شود،
// پس داخل فرم ویرایش آیتم دوباره به‌عنوان یک فیلد جدا نشان داده نمی‌شود
const ITEM_HIDDEN_KEYS = ["enabled"];

// آیدی آیتم بعدی را از روی بزرگ‌ترین آیدی عددی موجود در همان آرایه محاسبه می‌کند
// تا آیدی‌ها پشت‌سرهم باشند (مثلاً بعد از آیتم ۶، آیتم جدید ۷ می‌شود)
function nextArrayId(items) {
  const numericIds = items
    .map((item) => (item !== null && typeof item === "object" ? item.id : undefined))
    .filter((id) => typeof id === "number" && Number.isFinite(id));
  return numericIds.length > 0 ? Math.max(...numericIds) + 1 : items.length + 1;
}

function emptyLike(sample, idForNewItem) {
  if (Array.isArray(sample)) return [];
  if (sample !== null && typeof sample === "object") {
    const result = {};
    Object.keys(sample).forEach((key) => {
      result[key] = key === "id" ? idForNewItem : emptyLike(sample[key]);
    });
    return result;
  }
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return false;
  return "";
}

function PrimitiveField({ fieldKey, value, onChange, forceColor, forceMultiline }) {
  if (fieldKey === "id") {
    return (
      <input
        type="text"
        dir="ltr"
        className="field-input field-input-readonly"
        value={value ?? ""}
        readOnly
        disabled
        title="شناسه به‌صورت خودکار تولید می‌شود و قابل تغییر نیست"
      />
    );
  }

  if (typeof value === "boolean") {
    return (
      <input
        type="checkbox"
        className="field-input"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
    );
  }

  if (typeof value === "number") {
    return (
      <input
        type="number"
        className="field-input"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    );
  }

  if (isIconNameField(fieldKey)) {
    return <IconPicker value={value} onChange={onChange} />;
  }

  if (forceColor || isColorField(fieldKey)) {
    const isValidHex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
    return (
      <div className="field-color-row">
        <input
          type="color"
          className="field-input"
          value={isValidHex ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="text"
          dir="ltr"
          className="field-input field-color-hex"
          placeholder="#000000"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (isImageField(fieldKey)) {
    return <ImageField value={value} onChange={onChange} />;
  }

  if (forceMultiline || (typeof value === "string" && value.length > 60)) {
    return (
      <textarea
        className="field-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <input
      type="text"
      className="field-input"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

// اسم قابل‌نمایش هر آیتم را از روی رایج‌ترین فیلدهای متنی‌اش حدس می‌زند
// (title می‌تواند رشته باشد یا آبجکت تودرتو مثل title: {text, color})
function getItemDisplayName(item, index) {
  if (item !== null && typeof item === "object") {
    for (const key of ["title", "name", "label", "text", "authorName"]) {
      const candidate = item[key];
      if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
      if (
        candidate !== null &&
        typeof candidate === "object" &&
        typeof candidate.text === "string" &&
        candidate.text.trim()
      ) {
        return candidate.text.trim();
      }
    }
  }
  return `آیتم ${index + 1}`;
}

function isItemEnabled(item) {
  return !(item !== null && typeof item === "object" && item.enabled === false);
}

function ArrayField({ fieldKey, value, onChange }) {
  const [openIndex, setOpenIndex] = useState(null);

  const addItem = () => {
    const template =
      value.length > 0 ? emptyLike(value[0], nextArrayId(value)) : "";
    // اگر آیتم‌های دیگر کلید enabled دارند، آیتم جدید همیشه فعال شروع شود
    // (emptyLike چون از روی نوع boolean حدس می‌زند، false برمی‌گرداند)
    const newItem =
      template !== null && typeof template === "object" && "enabled" in template
        ? { ...template, enabled: true }
        : template;
    onChange([...value, newItem]);
  };
  const removeItem = (index) => {
    const confirmed = window.confirm("این آیتم حذف شود؟");
    if (!confirmed) return;
    onChange(value.filter((_, i) => i !== index));
    if (openIndex === index) setOpenIndex(null);
  };
  const updateItem = (index, next) =>
    onChange(value.map((item, i) => (i === index ? next : item)));
  const moveItem = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= value.length) return;
    const next = [...value];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(next);
  };
  const toggleEnabled = (index) => {
    const item = value[index];
    if (item === null || typeof item !== "object") return;
    updateItem(index, { ...item, enabled: !isItemEnabled(item) });
  };

  const openItem = value[openIndex];
  const isObjectList = value.length > 0 && value.every((item) => item !== null && typeof item === "object");

  return (
    <div className="field-array">
      {value.length > 0 && (
        isObjectList ? (
          <div className="field-array-table-wrap">
            <table className="field-array-table">
              <thead>
                <tr>
                  <th className="field-array-table-move-col"></th>
                  <th>نام</th>
                  <th>فعال</th>
                  <th className="field-array-table-actions-col"></th>
                </tr>
              </thead>
              <tbody>
                {value.map((item, index) => (
                  <tr key={index} className={isItemEnabled(item) ? "" : "field-array-row-disabled"}>
                    <td className="field-array-table-move">
                      <button
                        type="button"
                        className="field-array-item-move"
                        onClick={() => moveItem(index, -1)}
                        disabled={index === 0}
                        aria-label="جابه‌جایی به بالا"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="field-array-item-move"
                        onClick={() => moveItem(index, 1)}
                        disabled={index === value.length - 1}
                        aria-label="جابه‌جایی به پایین"
                      >
                        ↓
                      </button>
                    </td>
                    <td className="field-array-table-name">{getItemDisplayName(item, index)}</td>
                    <td>
                      <button
                        type="button"
                        className={`field-array-toggle-btn ${isItemEnabled(item) ? "on" : "off"}`}
                        onClick={() => toggleEnabled(index)}
                      >
                        {isItemEnabled(item) ? "فعال" : "غیرفعال"}
                      </button>
                    </td>
                    <td className="field-array-table-actions">
                      <button
                        type="button"
                        className="field-array-table-edit"
                        onClick={() => setOpenIndex(index)}
                      >
                        ویرایش
                      </button>
                      <button
                        type="button"
                        className="field-array-item-remove"
                        onClick={() => removeItem(index)}
                        aria-label="حذف آیتم"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          value.map((item, index) => (
            <div className="field-array-item" key={index}>
              <div className="field-array-item-head">
                <button
                  type="button"
                  className="field-array-item-index"
                  onClick={() => setOpenIndex(index)}
                >
                  آیتم {index + 1}
                </button>
                <div className="field-array-item-actions">
                  <button
                    type="button"
                    className="field-array-item-move"
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                    aria-label="جابه‌جایی به بالا"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="field-array-item-move"
                    onClick={() => moveItem(index, 1)}
                    disabled={index === value.length - 1}
                    aria-label="جابه‌جایی به پایین"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="field-array-item-remove"
                    onClick={() => removeItem(index)}
                    aria-label="حذف آیتم"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))
        )
      )}
      <button type="button" className="field-array-add" onClick={addItem}>
        + افزودن آیتم
      </button>

      {openIndex !== null && openItem !== undefined && (
        <Modal title={getItemDisplayName(openItem, openIndex)} onClose={() => setOpenIndex(null)}>
          {openItem !== null && typeof openItem === "object" ? (
            <ObjectFields
              value={openItem}
              onChange={(v) => updateItem(openIndex, v)}
              hideKeys={ITEM_HIDDEN_KEYS}
            />
          ) : (
            <PrimitiveField
              fieldKey={fieldKey}
              value={openItem}
              onChange={(v) => updateItem(openIndex, v)}
              forceMultiline={fieldKey === "title" || fieldKey === "description"}
            />
          )}
        </Modal>
      )}
    </div>
  );
}

function ObjectFields({ value, onChange, parentKey, hideKeys }) {
  // اگر خود این آبجکت زیر کلیدی مثل "colors"/"color" قرار گرفته، همه‌ی
  // فرزندهای مقداری‌اش رنگ هستند حتی اگر اسمشان (title/item/active/...) این را نشان ندهد
  const isColorGroup = parentKey ? /colors?$/i.test(parentKey) : false;
  // فیلد تایتل/توضیحات چه مستقیم باشد (title/description) و چه متن داخل یک
  // آبجکت تودرتو (مثلاً title.text یا description.text) باید چندخطی و قابل اینتر زدن باشد
  const isMultilineGroup = parentKey ? /(title|description)$/i.test(parentKey) : false;

  return (
    <div className="field-editor">
      {Object.keys(value)
        .filter((key) => !hideKeys?.includes(key))
        .map((key) => {
        const fieldValue = value[key];
        const setField = (next) => onChange({ ...value, [key]: next });
        const isMultilineField =
          key === "title" ||
          key === "description" ||
          (isMultilineGroup && key === "text");

        return (
          <div className="field-row" key={key}>
            <span className="field-row-label">
              {getFieldLabel(key)}
              <span className="field-row-key">{key}</span>
            </span>
            {Array.isArray(fieldValue) ? (
              <ArrayField fieldKey={key} value={fieldValue} onChange={setField} />
            ) : fieldValue !== null && typeof fieldValue === "object" ? (
              <div className="field-group">
                <ObjectFields value={fieldValue} onChange={setField} parentKey={key} />
              </div>
            ) : (
              <PrimitiveField
                fieldKey={key}
                value={fieldValue}
                onChange={setField}
                forceColor={isColorGroup}
                forceMultiline={isMultilineField}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SectionFieldEditor({ data, onChange }) {
  if (!data || typeof data !== "object") return null;
  if (Array.isArray(data)) {
    return <ArrayField fieldKey="items" value={data} onChange={onChange} />;
  }
  return <ObjectFields value={data} onChange={onChange} />;
}

export default SectionFieldEditor;
