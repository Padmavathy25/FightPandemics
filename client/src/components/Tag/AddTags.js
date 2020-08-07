import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import ButtonTag from "./ButtonTag";

const AddTagsWrapper = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 3rem;

  p {
    font-family: "Poppins";
    font-size: 1.1rem;
    color: black;
  }
`;

const AddTags = ({ filters, addTag, selected = [] }) => {
  const { t } = useTranslation();
  return (
    <AddTagsWrapper>
      <p>{t("post.addTags")}</p>
      {filters.map((filter, idx) => (
        <ButtonTag
          className={
            "tag-selectable " +
            (selected.length && selected.includes(filter) ? "tag-selected" : "")
          }
          onClick={addTag(filter)}
          label={filter}
          key={idx}
        >
          {filter}
        </ButtonTag>
      ))}
    </AddTagsWrapper>
  );
};

export default AddTags;
