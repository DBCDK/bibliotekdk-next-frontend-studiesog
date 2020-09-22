import { StoryTitle } from "../storybook";

import Title from "./Title";

export default {
  title: "Titles",
};

// Current title types
const titles = ["title1", "title2", "title3", "title4"];

/**
 * Returns all Titles as h1 tags
 *
 */
export function Titles() {
  return (
    <div>
      <StoryTitle>Titles</StoryTitle>

      {titles.map((type) => (
        <React.Fragment key={type}>
          <StoryTitle>{`Title [${type}]`}</StoryTitle>
          <Title tag="h1" key={type} type={type}>
            Hello World
          </Title>
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * Returns all Titles as h1 in skeleton loading mode
 *
 */
export function Loading() {
  return (
    <div>
      <StoryTitle>Loading Titles</StoryTitle>

      {titles.map((type) => (
        <React.Fragment key={type}>
          <StoryTitle>{`Loading Title [${type}]`}</StoryTitle>

          <Title tag="h1" type={type} skeleton={true}>
            Hello World
          </Title>
        </React.Fragment>
      ))}
    </div>
  );
}
