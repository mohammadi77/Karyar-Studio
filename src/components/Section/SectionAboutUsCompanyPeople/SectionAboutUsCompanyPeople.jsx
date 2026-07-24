import Card10 from "../../Cards/Card10/Card10";
import { useAppData } from "../../../hooks/useAppData";
import "./SectionAboutUsCompanyPeople.css";

const SectionAboutUsCompanyPeople = ({ data }) => {
  const { data: appData } = useAppData();
  const teamMembers = appData.teamMembers || [];
  const cart = data?.cart || [];

  const people = cart
    .map((entry) => {
      const member = teamMembers.find(
        (m) => String(m.id) === String(entry.memberId),
      );
      if (!member || member.active === false) return null;
      return {
        id: member.id,
        img: member.image,
        name: member.name,
        role: member.role,
      };
    })
    .filter(Boolean);

  if (people.length === 0) return null;

  const firstCardColor = data.firstCardColor || "#F8D8D8";
  const secondCardColor = data.secondCardColor || "#E2F2EA";

  return (
    <section className="section-about-us-company-people" dir="rtl">
      {data.title && (
        <h1
          className="section-about-us-company-people-title"
          style={{ color: data.titleColor || undefined }}
        >
          {data.title}
        </h1>
      )}

      <div className="section-about-us-company-people-cards">
        {people.map((person, index) => (
          <Card10
            key={person.id ?? index}
            image={person.img}
            name={person.name}
            role={person.role}
            bgColor={index % 2 === 0 ? firstCardColor : secondCardColor}
            nameColor={data.nameColor}
            roleColor={data.roleColor}
          />
        ))}
      </div>
    </section>
  );
};

export default SectionAboutUsCompanyPeople;
