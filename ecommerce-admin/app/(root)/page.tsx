"use client"

import { Modal } from "@/components/ui/modal"
import { useStoreModal } from "@/hooks/use-store-modal";

const SetupPage = () => {
  const isOpen = useStoreModal((state) => state.onOpen)

  return (
    <div className="p-4">
      Root Page
    </div>
  );
};

export default SetupPage;