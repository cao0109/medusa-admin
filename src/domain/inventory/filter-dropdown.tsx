import clsx from "clsx"
import { useMemo, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import FilterDropdownContainer from "../../components/molecules/filter-dropdown/container"
import TabFilter from "../../components/molecules/filter-tab"

const ProductsFilter = ({
  filters,
  submitFilters,
  clearFilters,
  tabs,
  onTabClick,
  activeTab,
  onRemoveTab,
  onSaveTab,
}) => {
  const { t } = useTranslation()
  const [tempState, setTempState] = useState(filters)
  const [name, setName] = useState("")

  const handleRemoveTab = (val) => {
    if (onRemoveTab) {
      onRemoveTab(val)
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

  const numberOfFilters = useMemo(
    () =>
      Object.entries(filters || {}).reduce((acc, [, value]) => {
        if (value?.open) {
          acc = acc + 1
        }
        return acc
      }, 0),
    [filters]
  )

  const setSingleFilter = (filterKey, filterVal) => {
    setTempState((prevState) => ({
      ...prevState,
      [filterKey]: filterVal,
    }))
  }

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
              {t("inventory-filters", "Filters")}
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
      ></FilterDropdownContainer>
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

export default ProductsFilter
