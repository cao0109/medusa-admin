import { useAdminCustomerGroups } from "medusa-react"
import { useContext, useState } from "react"
import { useTranslation } from "react-i18next"

import Modal from "../../../../../../../components/molecules/modal"
import { SelectableTable } from "../../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../../hooks/use-query-filters"
import { defaultQueryProps } from "../../../../../new/discount-form/condition-tables/shared/common"
import {
  CustomerGroupsHeader,
  CustomerGroupsRow,
  useGroupColumns,
} from "../../../../../new/discount-form/condition-tables/shared/groups"
import { useEditConditionContext } from "../../edit-condition-provider"
import Button from "../../../../../../../components/fundamentals/button"
import { LayeredModalContext } from "../../../../../../../components/molecules/modal/layered-modal"

const AddCustomerGroupsConditionsScreen = () => {
  const { t } = useTranslation()
  const params = useQueryFilters(defaultQueryProps)

  const { pop } = useContext(LayeredModalContext)

  const [selectedResources, setSelectedResources] = useState<string[]>([])

  const columns = useGroupColumns()

  const { isLoading, count, customer_groups, refetch } = useAdminCustomerGroups(
    params.queryObject,
    {
      keepPreviousData: true,
    }
  )

  const { saveAndClose, saveAndGoBack } = useEditConditionContext()

  return (
    <>
      <Modal.Content>
        <SelectableTable
          options={{
            enableSearch: true,
            immediateSearchFocus: true,
            searchPlaceholder: t("customer-groups-search", "Search..."),
          }}
          resourceName="Groups"
          totalCount={count ?? 0}
          selectedIds={selectedResources}
          data={customer_groups || []}
          columns={columns}
          isLoading={isLoading}
          onChange={(ids) => setSelectedResources(ids)}
          renderRow={CustomerGroupsRow}
          renderHeaderGroup={CustomerGroupsHeader}
          {...params}
        />
      </Modal.Content>
      <Modal.Footer>
        <div className="flex w-full justify-end space-x-xsmall">
          <Button variant="secondary" size="small" onClick={pop}>
            {t("customer-groups-cancel", "Cancel")}
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => saveAndGoBack(selectedResources, () => refetch())}
          >
            {t("customer-groups-save-and-go-back", "Save and go back")}
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => saveAndClose(selectedResources)}
          >
            {t("customer-groups-save-and-close", "Save and close")}
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export default AddCustomerGroupsConditionsScreen
