import { StoryTitle, StoryDescription } from "@/storybook";
import WrappedRelated, { Words } from "./Related";

const exportedObject = {
  title: "search/RelatedSubjects",
};

export default exportedObject;

export function Default() {
  const data = [
    "heste",
    "børnebøger",
    "ridning",
    "hestesygdomme",
    "vokal",
    "sygdomme",
    "hestesport",
    "træning",
    "skolebøger",
    "hesteavl",
  ];

  return (
    <div>
      <StoryTitle>Related subjects</StoryTitle>
      <StoryDescription>
        Relted subjects for a given search query
      </StoryDescription>
      <div>
        <Words data={data} isLoading={false} />
      </div>
    </div>
  );
}

export function Connected() {
  return (
    <div>
      <StoryTitle>Connected result page</StoryTitle>
      <StoryDescription>Uses mocked GraphQL provider</StoryDescription>
      <div style={{ maxWidth: "1200px", margin: "auto" }}>
        <WrappedRelated workId="work-of:870970-basis:51701763" />
      </div>
    </div>
  );
}

Connected.story = {
  parameters: {
    graphql: {
      resolvers: {
        SearchResponse: {
          hitcount: () => "998",
        },
      },
    },
    nextRouter: {
      showInfo: true,
      pathname: "/find",
      query: { "q.all": "hest" },
    },
  },
};
