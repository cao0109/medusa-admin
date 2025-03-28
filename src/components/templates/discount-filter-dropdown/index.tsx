import clsx from "clsx"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import FilterDropdownContainer from "../../../components/molecules/filter-dropdown/container"
import FilterDropdownItem from "../../../components/molecules/filter-dropdown/item"
import SaveFilterItem from "../../../components/molecules/filter-dropdown/save-field"
import TabFilter from "../../../components/molecules/filter-tab"
import PlusIcon from "../../fundamentals/icons/plus-icon"

const dynamicFilters = ["normal", "dynamic"]

const dateFilters = [
  "is in the last",
  "is older than",
  "is after",
  "is before",
  "is equal to",
]

const DiscountFilters = ({
  tabs,
  activeTab,
  onTabClick,
  onSaveTab,
  onRemoveTab,
  filters,
  submitFilters,
  clearFilters,
}) => {
  const { t } = useTranslation()
  const [tempState, setTempState] = useState(filters)
  const [name, setName] = useState("")

  const handleRemoveTab = (val) => {
    if (onRemoveTab) {
      onRemoveTab(val)
    }
  }

  const handleSaveTab = () => {
    if (onSaveTab) {
      onSaveTab(name, tempState)
    }
  }

  const handleTabClick = (tabName: string) => {
    if (onTabClick) {
      onTabClick(tabName)
    }
  }

  useEffect(() => {
    setTempState(filters)
  }, [filters])

  const onSubmit = () => {
    submitFilters(tempState)
  }

  const onClear = () => {
    clearFilters()
  }

  const setSingleFilter = (filterKey, filterVal) => {
    setTempState((prevState) => ({
      ...prevState,
      [filterKey]: filterVal,
    }))
  }

  const numberOfFilters = Object.entries(filters).reduce(
    (acc, [key, value]) => {
      if (value?.open) {
        acc = acc + 1
      }
      return acc
    },
    0
  )

  return (
    <div className="flex space-x-1">
      <FilterDropdownContainer
        submitFilters={onSubmit}
        clearFilters={onClear}
        triggerElement={
          <button
            className={clsx(
              "flex items-center space-x-1 rounded-rounded focus-visible:border-violet-60 focus-visible:shadow-input focus-visible:outline-none"
            )}
          >
            <div className="inter-small-semibold flex h-6 items-center rounded-rounded border border-grey-20 bg-grey-5 px-2">
              {t("discount-filter-dropdown-filters", "Filters")}
              <div className="ml-1 flex items-center rounded text-grey-40">
                <span className="inter-small-semibold text-violet-60">
                  {numberOfFilters ? numberOfFilters : "0"}
                </span>
              </div>
            </div>
            <div className="inter-small-semibold flex items-center rounded-rounded border border-grey-20 bg-grey-5 p-1">
              <PlusIcon size={14} />
            </div>
          </button>
        }
      >
        <FilterDropdownItem
          filterTitle="Types"
          options={dynamicFilters}
          filters={tempState.isDynamic.filter}
          open={tempState.isDynamic.open}
          setFilter={(val) => setSingleFilter("isDynamic", val)}
        />
        {/* Backend support missing
        <FilterDropdownItem
          filterTitle="Date"
          options={dateFilters}
          filters={tempState.date.filter}
          open={tempState.date.open}
          setFilter={(val) => setSingleFilter("date", val)}
      /> */}
        <SaveFilterItem
          saveFilter={handleSaveTab}
          name={name}
          setName={setName}
        />
      </FilterDropdownContainer>
      {tabs &&
        tabs.map((t) => (
          <TabFilter
            key={t.value}
            onClick={() => handleTabClick(t.value)}
            label={t.label}
            isActive={activeTab === t.value}
            removable={!!t.removable}
            onRemove={() => handleRemoveTab(t.value)}
          />
        ))}
    </div>
  )
}

export default DiscountFilters
