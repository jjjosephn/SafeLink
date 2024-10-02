import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Toast config
 * 
 * @constant
 * @type {Object}
 * @property {string} position - Position of the toast on the screen
 * @property {number} autoClose - Time before close
 * @property {boolean} hideProgressBar - Whether to hide the progress bar
 * @property {boolean} closeOnClick - Whether the toast closes on a click
 * @property {boolean} pauseOnHover - Whether the toast pauses on hover
 * @property {boolean} draggable - Whether the toast is draggable
 * @property {undefined} progress - Progress value of toast
 * @property {string} theme 
 */

const toastConfig = {
   position: "top-right",
   autoClose: 1500,
   hideProgressBar: false,
   closeOnClick: true,
   pauseOnHover: true,
   draggable: true,
   progress: undefined,
   theme: "light"
};

/**
 * Displays an informational toast notification.
 * 
 * @function toastInfo
 * @param {string} message - The message to be displayed in the toast.
 */
export function toastInfo(message) {
   toast.info(message, toastConfig);
}

/**
 * Displays a success toast notification.
 * 
 * @function toastSuccess
 * @param {string} message 
 */
export function toastSuccess(message) {
   toast.success(message, toastConfig);
}

/**
 * Displays a warning toast notification.
 * 
 * @function toastWarning
 * @param {string} message 
 */
export function toastWarning(message) {
   toast.warn(message, toastConfig);
}

/**
 * Displays an error toast notification.
 * 
 * @function toastError
 * @param {string} message 
 */
export function toastError(message) {
   toast.error(message, toastConfig);
}