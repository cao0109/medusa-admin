import BodyCard from "../../../components/organisms/body-card"
import InventoryPageTableHeader from "../header"

const InventoryView = () => {
  return (
    <div className="flex h-full grow flex-col">
      <div className="flex w-full grow flex-col">
        <BodyCard
          customHeader={<InventoryPageTableHeader activeView="inventory" />}
          className="h-fit"
        >
          <h1>Inventory</h1>
        </BodyCard>
      </div>
    </div>
  )
}

export default InventoryView
