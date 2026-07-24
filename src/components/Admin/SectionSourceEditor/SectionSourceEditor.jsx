import { useAppData } from "../../../hooks/useAppData";
import { sectionRegistry } from "../../../config/sectionRegistry";
import { getFieldLabel } from "../../../config/fieldLabels";
import SectionFieldEditor from "../SectionFieldEditor/SectionFieldEditor";
import TeamMembersFieldEditor from "../TeamMembersFieldEditor/TeamMembersFieldEditor";
import "./SectionSourceEditor.css";

// سکشن‌هایی که به‌جای وارد کردن دستی اسم/سمت/عکس، از لیست مشترک «افراد تیم» انتخاب می‌کنند
const TEAM_SECTION_CONFIG = {
  SectionPeople: { key: "items", includeBgColor: true },
  SectionAboutUsCompanyPeople: { key: "cart", includeBgColor: false },
};

// دو حالت برای هر سکشن: محتوای اختصاصی همین صفحه، یا آینه‌ی یک سکشن هم‌نوع در صفحه‌ای دیگر
function SectionSourceEditor({ section, onChange, currentPageId }) {
  const { data: appData } = useAppData();
  const pages = appData.pages || [];

  const eligibleOptions = [];
  pages.forEach((p) => {
    if (p.id === currentPageId) return;
    (p.sections || []).forEach((s) => {
      if (s.type === section.type && (s.mode ?? "custom") === "custom") {
        eligibleOptions.push({
          pageId: p.id,
          sectionId: s.id,
          label: `${p.name} — ${sectionRegistry[s.type]?.label || s.type}`,
        });
      }
    });
  });

  const mode = section.mode ?? "custom";
  const refValue =
    section.refPageId && section.refSectionId
      ? `${section.refPageId}::${section.refSectionId}`
      : "";

  const refPage = pages.find((p) => p.id === section.refPageId);
  const refSection = refPage?.sections?.find(
    (s) => s.id === section.refSectionId,
  );
  const refData =
    refSection && typeof refSection.data === "object" && !Array.isArray(refSection.data)
      ? refSection.data
      : null;
  const overrides = section.overrides ?? {};

  const setRef = (value) => {
    const [refPageId = "", refSectionId = ""] = value.split("::");
    onChange({ ...section, refPageId, refSectionId, overrides: {} });
  };

  const toggleOverrideField = (key) => {
    const next = { ...overrides };
    if (key in next) {
      delete next[key];
    } else {
      next[key] = JSON.parse(JSON.stringify(refData[key]));
    }
    onChange({ ...section, overrides: next });
  };

  return (
    <div className="section-source-editor">
      <div className="section-source-mode">
        <label className="section-source-mode-option">
          <input
            type="radio"
            name={`source-mode-${section.id}`}
            checked={mode === "custom"}
            onChange={() => onChange({ ...section, mode: "custom" })}
          />
          محتوای اختصاصی برای این صفحه
        </label>
        <label className="section-source-mode-option">
          <input
            type="radio"
            name={`source-mode-${section.id}`}
            checked={mode === "reference"}
            disabled={eligibleOptions.length === 0}
            onChange={() => onChange({ ...section, mode: "reference" })}
          />
          مشابه همین سکشن در یک صفحه‌ی دیگر
        </label>
      </div>

      {mode === "reference" ? (
        eligibleOptions.length === 0 ? (
          <p className="section-source-empty">
            هیچ صفحه‌ی دیگری این سکشن را به‌صورت اختصاصی ندارد.
          </p>
        ) : (
          <>
            <select
              className="field-input"
              value={refValue}
              onChange={(e) => setRef(e.target.value)}
            >
              <option value="">— انتخاب صفحه —</option>
              {eligibleOptions.map((opt) => (
                <option
                  key={`${opt.pageId}::${opt.sectionId}`}
                  value={`${opt.pageId}::${opt.sectionId}`}
                >
                  {opt.label}
                </option>
              ))}
            </select>

            {refData && (
              <div className="section-source-overrides">
                <p className="section-source-overrides-title">
                  فیلدهایی که می‌خوای فقط برای همین صفحه فرق کنه:
                </p>
                <div className="section-source-overrides-list">
                  {Object.keys(refData).map((key) => (
                    <label
                      key={key}
                      className="section-source-mode-option"
                    >
                      <input
                        type="checkbox"
                        checked={key in overrides}
                        onChange={() => toggleOverrideField(key)}
                      />
                      {getFieldLabel(key)}
                    </label>
                  ))}
                </div>

                {Object.keys(overrides).length > 0 && (
                  <SectionFieldEditor
                    data={overrides}
                    onChange={(nextOverrides) =>
                      onChange({ ...section, overrides: nextOverrides })
                    }
                  />
                )}
              </div>
            )}
          </>
        )
      ) : TEAM_SECTION_CONFIG[section.type] ? (
        (() => {
          const { key: teamKey, includeBgColor } = TEAM_SECTION_CONFIG[section.type];
          const { [teamKey]: teamValue, ...restData } = section.data || {};
          return (
            <>
              <SectionFieldEditor
                data={restData}
                onChange={(nextRest) =>
                  onChange({
                    ...section,
                    data: { ...nextRest, [teamKey]: teamValue },
                    mode: "custom",
                  })
                }
              />
              <div className="section-source-team-picker">
                <p className="section-source-overrides-title">افراد این سکشن:</p>
                <TeamMembersFieldEditor
                  value={teamValue || []}
                  onChange={(nextTeamValue) =>
                    onChange({
                      ...section,
                      data: { ...section.data, [teamKey]: nextTeamValue },
                      mode: "custom",
                    })
                  }
                  includeBgColor={includeBgColor}
                />
              </div>
            </>
          );
        })()
      ) : (
        <SectionFieldEditor
          data={section.data}
          onChange={(nextData) =>
            onChange({ ...section, data: nextData, mode: "custom" })
          }
        />
      )}
    </div>
  );
}

export default SectionSourceEditor;
