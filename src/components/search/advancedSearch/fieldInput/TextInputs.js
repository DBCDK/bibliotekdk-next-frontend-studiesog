import Translate from "@/components/base/translate/Translate";
import Text from "@/components/base/text";
import Suggester from "@/components/base/suggester/Suggester";

import IconButton from "@/components/base/iconButton/IconButton";
import styles from "./TextInputs.module.css";
import animations from "css/animations";
import SearchIndexDropdown from "@/components/search/advancedSearch/fieldInput/searchIndexDropdown/SearchIndexDropdown";

import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Icon from "@/components/base/icon";
import workTypesLabels from "./labels.js";
import Input from "@/components/base/forms/input";
import { useData } from "@/lib/api/api";
import * as suggestFragments from "@/lib/api/suggest.fragments";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import { LogicalOperatorsEnum } from "@/components/search/enums";

/**
 * Returns a textinput component and a dropdown to choose which advanced search index to search in
 * @param {Object} props
 * @returns {React.JSX.Element}
 */
function FieldInput({ key, index, workType, fieldValue }) {
  const [suggestions, setSuggestions] = useState([]);

  const {
    handleInputFieldChange,
    removeInputField,
    handleLogicalOperatorChange,
  } = useAdvancedSearchContext();

  //labels to show in SearchIndexDropdown
  const labels = workTypesLabels[workType].map((el) => el.label);

  const isFirstItem = index === 0;
  const { data } = useData(
    fieldValue?.value &&
      suggestFragments.all({ q: fieldValue.value, workType: null, limit: 10 })
  );

  useEffect(() => {
    setSuggestions(
      data?.suggest?.result?.map((res) => {
        return { value: res.term };
      })
    );
  }, [data]);

  return (
    <div key={key}>
      {!isFirstItem && (
        <LogicalOperatorDropDown
          onSelect={(value) => handleLogicalOperatorChange(index, value)}
          selected={fieldValue.prefixLogicalOperator}
        />
      )}

      <div
        className={`${styles.inputContainer} ${
          isFirstItem ? styles.rightPadding : ""
        }`}
      >
        <SearchIndexDropdown
          options={labels}
          className={styles.select}
          index={index}
        />
        <div className={`${styles.suggester__wrap} `}>
          <Suggester
            data={suggestions}
            onSelect={(val) => handleInputFieldChange(index, val)}
            onClear={() => handleInputFieldChange(index, "")}
            className={styles.suggester}
          >
            <Input
              className={styles.suggesterInput}
              // value={value}
              onChange={(e) => handleInputFieldChange(index, e.target.value)}
              placeholder={fieldValue.placeholder}
            />
          </Suggester>
        </div>
        {!isFirstItem && (
          <IconButton
            icon="close"
            onClick={() => removeInputField(index)}
            className={styles.removeIcon}
          >
            {Translate({ context: "search", label: "remove" })}
          </IconButton>
        )}
      </div>
    </div>
  );
}
const options = Object.keys(LogicalOperatorsEnum); //["AND", "OR", "NOT"];
/**
 * Dropdown for choosing a logical operator ("AND", "OR", "NOT") between text fields.
 * @param {*} param0
 * @returns
 */
function LogicalOperatorDropDown({ onSelect, selected = "AND", className }) {
  const [expanded, setExpanded] = useState(false);
  function toggleCollapse() {
    setExpanded((current) => !current);
  }
  return (
    <Dropdown
      onToggle={toggleCollapse}
      className={`${styles.dropdownwrap} ${className}`}
    >
      <Dropdown.Toggle
        variant="success"
        id="dropdown-basic"
        className={styles.dropdowntoggle}
      >
        <Text
          type="text4"
          className={`${animations["f-border-bottom"]} ${animations["h-border-bottom"]}`}
        >
          {Translate({
            context: "search",
            label: `advanced-dropdown-${selected}`,
          })}
        </Text>
        <Icon
          size={{ w: "2", h: "auto" }}
          src={expanded ? "arrowUp.svg" : "arrowDown.svg"}
          alt=""
        />
      </Dropdown.Toggle>

      <Dropdown.Menu className={styles.dropdownmenu}>
        {options.map((elem) => {
          return (
            <Dropdown.Item
              tabIndex="-1"
              key={`logicalOperatordropdown-${elem}`}
              className={styles.dropdownitem}
              onClick={() => {
                onSelect(elem);
              }}
            >
              <Text tag="span" type="text3">
                {Translate({
                  context: "search",
                  label: `advanced-dropdown-${elem}`,
                })}
              </Text>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

/**
 * A dynamic component that can render multiple text inputs for advanced search
 * @param {Object} props
 * @returns {React.JSX.Element}
 */
export default function TextInputs({ workType }) {
  const { inputFields, addInputField } = useAdvancedSearchContext();

  return (
    <>
      {inputFields?.map((field, index) => (
        <FieldInput
          key={`inputField-${index}`}
          index={index}
          workType={workType}
          fieldValue={field}
        />
      ))}
      <IconButton
        icon="expand"
        onClick={addInputField}
        keepUnderline
        className={styles.addLine}
      >
        {Translate({ context: "search", label: "addLine" })}
      </IconButton>
    </>
  );
}