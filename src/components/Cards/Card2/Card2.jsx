import "./Card2.css";

const Card2 = ({
  image = "/images/default-card.png",
  logo = "/images/default-logo.svg",

  title = "عنوان کارت",
  titleColor = "#2F4858",

  paragraph = "متن توضیحات کارت",
  paragraphColor = "#5C6A63",

  background,
}) => {
  return (
    <div className="card" style={background ? { background } : undefined}>
      <div className="card__content">
        <img src={logo} alt={title} className="card__logo" />

        <h3 className="card__title" style={{ color: titleColor }}>
          {title}
        </h3>

        <p className="card__text" style={{ color: paragraphColor }}>
          {paragraph}
        </p>
      </div>

      <div className="card__imageWrapper">
        <img src={image} alt={title} className="card__image" />
      </div>
    </div>
  );
};

export default Card2;
