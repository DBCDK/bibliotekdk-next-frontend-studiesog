import { StoryTitle, StoryDescription } from "@/storybook";
import { SearchFeedBackWrapper } from "./SearchFeedBack";

export default {
  title: "base/SearchFeedBack",
};
/**
 * Returns SearchFeedBack
 *
 */
export function FeedBack() {
  const onThumbsUpClick = () => {
    alert("thumbsup");
  };

  const onThumbsDownClick = () => {
    alert("thumbsdown");
  };

  const onDataCollect = (input) => {
    alert(JSON.stringify(input));
  };
  return (
    <div>
      <StoryTitle>SearchFeedBack</StoryTitle>
      <StoryDescription>
        thumbs up OR thumbs down with description
      </StoryDescription>
      <SearchFeedBackWrapper
        datacollect={onDataCollect}
        router={null}
        ForceshowMe={true}
      />
    </div>
  );
}