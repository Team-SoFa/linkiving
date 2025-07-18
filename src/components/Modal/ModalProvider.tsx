"use client";

import ModalWrapper from "./ModalWrapper";
import { useModalStore } from "@/stores/modalStore";
import Ex1 from "./Ex1";
import Ex2 from "./Ex2";

export default function ModalProvider() {
    const {isOpen, type, close} = useModalStore();

    if (!isOpen) return null;

    let content;
    switch (type) {
        case "ex1":
            content = <Ex1 />;
            break;
        case "ex2":
            content = <Ex2 />;
            break;
        default:
            content = null;
    }

    return <ModalWrapper onClose={close}>{content}</ModalWrapper>
}