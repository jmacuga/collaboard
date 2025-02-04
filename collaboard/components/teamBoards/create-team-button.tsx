"use client";
import { useState } from "react";
import { Modal } from "@mui/material";
import { Box } from "@mui/material";

export default function CreateRoomButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClick = async () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button onClick={onClick}>{children}</button>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box></Box>
      </Modal>
    </>
  );
}
