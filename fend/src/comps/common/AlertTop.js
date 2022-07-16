import Fragment from "./Fragment";
const DEFAULT_TIMEOUT = 4000;

export function AlertTop({ alert }) {
  return alert ? (
    <div className="flex justify-center">
        <div className={`alert alert-${alert.mode} shadow-lg w-auto absolute`}>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="stroke-current flex-shrink-0 w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{alert.message}</span>
          </div>
        </div>
    </div>
  ) : null;
}

export function useAlert(setter) {
  let timer;
  return (message, mode, timeout) => {
    // if the previous setTimeout hasn't happened yet & we display another error, this one overwrites
    // anyway, so clearing the timer is fine. 
    clearTimeout(timer);
    setter({ message, mode });
    timer = setTimeout(() => setter(null), timeout || DEFAULT_TIMEOUT);
  };
}

export const ALERT_COLOR = {
  GREEN: "success",
  BLUE: "info",
  RED: "error",
  YELLOW: "warning",
};
