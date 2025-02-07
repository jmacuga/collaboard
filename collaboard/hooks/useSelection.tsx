import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { useState } from "react";
import Konva from "konva";
import KonvaNodeSchema from "@/types/KonvaNodeSchema";

export type ITEMS_CONTEXT = {
  selectedItems: Konva.Node[];
  onCreate: (newItem: KonvaNodeSchema) => void;
  onDelete: (targetItemId: string | string[]) => void;
  onSelect: (e?: KonvaEventObject<MouseEvent>, itemList?: Konva.Node[]) => void;
  onClear: () => void;
  onAlter: (dataList: KonvaNodeSchema[]) => void;
};

const useSelection = () => {
  const [selectedItems, setSelectedItems] = useState<
    ITEMS_CONTEXT["selectedItems"]
  >([] as ITEMS_CONTEXT["selectedItems"]);

  const onSelectItem = (
    e?: KonvaEventObject<MouseEvent | TouchEvent>,
    itemList?: Node<NodeConfig>[]
  ) => {
    if (itemList) {
      console.log("item list", itemList);
      setSelectedItems(itemList);
      return;
    }
    if (!e) {
      return;
    }
    if (e.target.getType() === "Stage") {
      setSelectedItems([]);
      return;
    }
    let newItemList = [] as ITEMS_CONTEXT["selectedItems"];
    const targetItem =
      e.target.name() === "label-text"
        ? e.target.getParent()?.getParent()?.findOne(".label-target")
        : e.target;
    if (!e.evt.shiftKey) {
      newItemList = [targetItem as Konva.Node];
    } else if (selectedItems.find((item) => item.id() === targetItem?.id())) {
      newItemList = selectedItems.filter(
        (item) => item.id() !== targetItem?.id()
      );
    } else {
      newItemList = [...selectedItems, targetItem as Konva.Node];
    }
    setSelectedItems(newItemList);
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  return {
    selectedItems,
    setSelectedItems,
    onSelectItem,
    clearSelection,
  };
};

export default useSelection;
