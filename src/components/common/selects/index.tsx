import { useState } from "react";
import VirtualizedMultiSelect from "./multi-selects/multi-select";
import { TradePoint, tradePoints } from "./trade-points";
import VirtualizedSingleSelect from "../select/select";

const tradePointsFixes = tradePoints.sort(
  (a, b) => b.name.length - a.name.length,
);

const TradePointsSelect = () => {
  const [selectedTradePointIds, setSelectedTradePointIds] = useState<number[]>(
    [],
  );

  const [selectedTradePointId, setSelectedTradePointId] = useState<
    number | null
  >(null);

  console.log(selectedTradePointId);

  const handleSelectTradePoints = (tradePointIds: number[]) => {
    setSelectedTradePointIds(tradePointIds);
  };

  const handleSelectTradePoint = (tradePointId: number) => {
    setSelectedTradePointId(tradePointId);
  };

  return (
    <>
      <VirtualizedMultiSelect
        data={tradePoints}
        selectedValues={selectedTradePointIds}
        onSelect={handleSelectTradePoints}
        selectAccessorKey={"id"}
        displayValueAccessorKey={"name"}
        enableSelectAll={true}
        placeholder={"Оберіть торгові точки"}
        searchTranslationKey={"Пошук по торговим точкам"}
        width={200}
        popoverWidth={600}
        onResetAll={() => {}}
      />
      <VirtualizedSingleSelect
        data={tradePoints}
        selectedValues={selectedTradePointIds}
        onSelect={handleSelectTradePoint}
        selectAccessorKey={"id"}
        displayValueAccessorKey={"name"}
        enableSelectAll={true}
        placeholder={"Оберіть торгові точки"}
        searchTranslationKey={"Пошук по торговим точкам"}
        width={200}
        popoverWidth={600}
        onResetAll={() => {}}
      />
    </>
  );
};

export default TradePointsSelect;
