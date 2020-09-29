import { useState } from "react";
import { StoryTitle, StorySpace } from "../../storybook";

import Tag from "./Tag";

export default {
  title: "Forms: Tag",
};

//  Some material types to show in a Tag
const types = ["Book", "Ebook", "Audiobook"];

/**
 * Returns all filled buttons (Default button style)
 *
 */
export function TagButton() {
  const [isSelected, setIsSelected] = useState(false);
  const [selectedType, setSelectedType] = useState(types[0]);

  return (
    <div>
      <StoryTitle>Single Tag ("Checkbox" style)</StoryTitle>

      <Tag selected={isSelected} onClick={() => setIsSelected(!isSelected)}>
        Book
      </Tag>

      <StoryTitle>Multiple tags ("Radio" style)</StoryTitle>

      {types.map((type) => {
        const isSelected = selectedType === type;

        return (
          <React.Fragment key={type}>
            <Tag selected={isSelected} onClick={() => setSelectedType(type)}>
              {type}
            </Tag>
            <StorySpace space="2" />
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function Loading() {
  return (
    <div>
      <StoryTitle>Single Tag [checkbox style]</StoryTitle>

      <Tag selected={false} skeleton={true}>
        Book
      </Tag>

      <StoryTitle>Multiple tags [Radio style]</StoryTitle>
      {types.map((type, i) => {
        return (
          <React.Fragment key={type}>
            <Tag selected={false} skeleton={true}>
              {type}
            </Tag>
            <StorySpace space="2" />
          </React.Fragment>
        );
      })}
    </div>
  );
}
