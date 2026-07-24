import Baner from "../../Cards/baner/baner";
import "./SectionBaner.css";

const defaultData = {
  backgroundImage: "",
  title: "",
  titleColor: "#2F4858",
  button: {},
};

const SectionBaner = ({ data: resData = {} }) => {
  const data = {
    ...defaultData,
    ...resData,
    button: {
      ...defaultData.button,
      ...resData.button,
    },
  };

  return <Baner data={data} />;
};

export default SectionBaner;
