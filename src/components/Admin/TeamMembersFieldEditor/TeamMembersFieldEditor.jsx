import { Link } from "react-router-dom";
import { useAppData } from "../../../hooks/useAppData";
import "./TeamMembersFieldEditor.css";

// انتخاب زیرمجموعه‌ای از لیست مشترک «افراد تیم» برای یک سکشن، به‌همراه ترتیب نمایش.
// خود اطلاعات فرد (اسم/سمت/عکس) اینجا وارد نمی‌شود، فقط به عضو مرجع داده می‌شود.
function TeamMembersFieldEditor({ value, onChange, includeBgColor }) {
  const { data } = useAppData();
  const members = data.teamMembers || [];
  const selected = value || [];

  const memberById = (id) => members.find((m) => String(m.id) === String(id));

  const isSelected = (memberId) =>
    selected.some((entry) => String(entry.memberId) === String(memberId));

  const toggleMember = (memberId) => {
    if (isSelected(memberId)) {
      onChange(selected.filter((entry) => String(entry.memberId) !== String(memberId)));
    } else {
      onChange([...selected, { memberId }]);
    }
  };

  const moveEntry = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= selected.length) return;
    const next = [...selected];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(next);
  };

  const setEntryBgColor = (index, bgColor) => {
    const next = [...selected];
    next[index] = { ...next[index], bgColor };
    onChange(next);
  };

  if (members.length === 0) {
    return (
      <p className="team-members-field-empty">
        هنوز عضوی در «افراد تیم» ثبت نشده.{" "}
        <Link to="/admin/team" target="_blank" rel="noreferrer">
          اول از اونجا اضافه کن
        </Link>
        ، بعد اینجا انتخابشون کن.
      </p>
    );
  }

  return (
    <div className="team-members-field">
      <div className="team-members-field-picker">
        {members.map((member) => (
          <label key={member.id} className="team-members-field-option">
            <input
              type="checkbox"
              checked={isSelected(member.id)}
              onChange={() => toggleMember(member.id)}
            />
            <span className="team-members-field-avatar">
              {member.image ? (
                <img src={member.image} alt="" />
              ) : (
                <span>{member.name?.trim()?.[0] || "?"}</span>
              )}
            </span>
            <span className="team-members-field-option-info">
              {member.name || "بدون نام"}
              {member.active === false && (
                <span className="team-members-field-inactive"> (غیرفعال)</span>
              )}
            </span>
          </label>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="team-members-field-selected">
          <p className="team-members-field-selected-title">ترتیب نمایش:</p>
          {selected.map((entry, index) => {
            const member = memberById(entry.memberId);
            return (
              <div className="team-members-field-selected-item" key={entry.memberId}>
                <span className="team-members-field-selected-name">
                  {member?.name || "عضو حذف‌شده"}
                </span>
                {includeBgColor && (
                  <input
                    type="color"
                    className="field-input"
                    title="رنگ پس‌زمینه اختصاصی (اختیاری)"
                    value={/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(entry.bgColor) ? entry.bgColor : "#ffffff"}
                    onChange={(e) => setEntryBgColor(index, e.target.value)}
                  />
                )}
                <button
                  type="button"
                  className="field-array-item-move"
                  onClick={() => moveEntry(index, -1)}
                  disabled={index === 0}
                  aria-label="جابه‌جایی به بالا"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="field-array-item-move"
                  onClick={() => moveEntry(index, 1)}
                  disabled={index === selected.length - 1}
                  aria-label="جابه‌جایی به پایین"
                >
                  ↓
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TeamMembersFieldEditor;
