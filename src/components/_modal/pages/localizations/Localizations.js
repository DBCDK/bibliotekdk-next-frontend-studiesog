import Top from "@/components/_modal/pages/base/top";
import styles from "./Localizations.module.css";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import { useState } from "react";
import * as libraryFragments from "@/lib/api/library.fragments";
import Translate from "@/components/base/translate";
import debounce from "lodash/debounce";
import Search from "@/components/base/forms/search";
import LocalizationItem from "./LocalizationItem";
import Text from "@/components/base/text/Text";

export function Localizations({ context, branchData, isLoading, onChange }) {
  const allBranches = branchData?.result;

  return (
    <div data-cy="localizations-modal" className={styles.wrapper}>
      <Top />

      <div>
        <Text type="text1" className={styles.title}>
          {Translate({
            context: "holdings",
            label: "label_localizations_title",
          })}
        </Text>

        <Text type="text3" className={styles.description}>
          {Translate({
            context: "holdings",
            label: "label_localization_description",
          })}
        </Text>
      </div>

      <Search
        dataCy="pickup-search-input"
        placeholder={Translate({
          context: "order",
          label: "pickup-input-placeholder",
        })}
        className={styles.input}
        onChange={debounce((value) => onChange(value), 100)}
      />

      {!isLoading && (
        <div>
          {allBranches?.length > 0 && (
            <div>
              {allBranches.map((branch, idx) => {
                return (
                  <LocalizationItem
                    key={branch.branchId}
                    props={{
                      ...context,
                      branch: branch,
                      index: { idx },
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function wrap({ context }) {
  const { workId, agency, pids } = { ...context };

  const [query, setQuery] = useState("");

  const { data, isLoading } = useData(
    libraryFragments.search({ q: query || "" })
  );

  const dummyData = {
    hitcount: 10,
    result: [
      { name: "This is some branch name" },
      { name: "This is some other branch name" },
      { name: "This is also a branch name" },
      { name: "A branch name" },
      { name: "Also a bracndh name" },
      { name: "This is some branch name" },
      { name: "This is some other branch name" },
      { name: "This is also a branch name" },
      { name: "A branch name" },
      { name: "Also a bracndh name" },
    ],
  };

  const branches = !query ? agency : data?.branches;

  const props = { ...context, ...data, pids };
  return (
    <Localizations
      context={props}
      branchData={isLoading ? dummyData : branches}
      isLoading={isLoading}
      onChange={(q) => setQuery(q)}
    />
  );
}