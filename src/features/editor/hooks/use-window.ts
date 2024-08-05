import { useEvent } from "react-use"

export const useWindow = () => {
    useEvent("beforeunload", (e) => {
        e.preventDefault();

        (e || window.event).returnValue = "Are you sure you want to leave?";
    });
}