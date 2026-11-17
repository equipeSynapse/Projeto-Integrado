import { useEffect } from "react";

export default function closeModal(modalRef, closeFunc) {
    useEffect(() => {
        const previouslyFocusedElement = document.activeElement;

        if (modalRef.current) {
            modalRef.current.focus();
        }

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                closeFunc();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            if (previouslyFocusedElement) {
                previouslyFocusedElement.focus()
            }
        }
    }, [closeFunc]);
}