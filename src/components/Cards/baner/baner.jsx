import Button1 from "../../Button/Button1/Button1";
import "./baner.css";

const baner = ({ data }) => {
  return (
    <section
      className="section_baner"
      style={{
        backgroundImage: `url(${data.backgroundImage})`,
      }}
    >
      <h3
        className="section_baner_title"
        style={{
          color: data.titleColor,
        }}
      >
        {data.title}
      </h3>

      <Button1 {...data.button} />
    </section>
  );
};

export default baner;
