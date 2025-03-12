export function LoadingSpinner(props: { message?: string }) {
    return (
        <span>
            <i class="fa-solid fa-circle-notch fa-spin" style={{ marginRight: ".5rem" }}></i>
            {props.message ?? "Lade..."}
        </span>
    );
}