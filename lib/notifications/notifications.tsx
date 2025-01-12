import { Text } from "@mantine/core";
import { notifications, showNotification } from "@mantine/notifications";
import {
    IconAlertTriangle, IconCircleCheck, IconExclamationMark, IconInfoCircle,
} from "@tabler/icons-react";
import { ReactNode } from "react";

type ShowNotificationOptions = {
    message?: string | ReactNode;
    title?: string | ReactNode;
    icon?: ReactNode;
    loading?: boolean;
    closeDelay?: number;
    closeable?: boolean
}

type UpdateNotificationOptions = {
    id: string;
    title?: string | ReactNode;
    message?: string | ReactNode;
    color?: 'red' | 'blue' | 'green' | 'yellow';
    icon?: ReactNode;
    loading?: boolean;
    closeDelay?: number | boolean;
    closeable?: boolean
}

const updateNotification = ({
    id, closeDelay, closeable, icon, loading, message, title, color,
}: UpdateNotificationOptions) => {
    notifications.update({
        id,
        title,
        color,
        icon,
        message,
        autoClose: closeDelay || !loading,
        withCloseButton: closeable || !loading,
        loading: loading || false,
        styles: () => ({
            title: {
                fontSize: 17,
                fontWeight: 700,
            },
            description: { fontSize: 15 },
            icon: {
                marginLeft: 5,
                padding: 4,
                width: 38,
                height: 38,
            },
            loader: {
                marginLeft: 5,
            },
        }),
    });
};

/**
 * Shows an ERROR (red) notification with the given options.
 *
 * All properties are stateful.
 *
 * All properties are optional
 *
 * @param message The message to display in the notification
 * @param title The title to display in the notification
 * @param icon The icon to display in the notification
 * @param loading Whether or not the notification should be in a loading state.
 * @param closeDelay The amount of time to wait before closing the notification
 * @param closeable Whether or not the notification can be closed
 * @returns The id of the notification
 *
 * @example
 * const id = showErrorNotification({
 *    message: "An error occurred",
 *    title: "Error",
 *    icon: <IconExclamationMark size="100%" />,
 *    loading: false,
 *    closeDelay: 5000,
 *    closeable: true,
 * });
 *
 * // To close the notification
 *  closeNotification(id); // from "@mantine/notifications"
 */
export const showErrorNotification = ({
    message, title, icon, loading, closeDelay, closeable,
}: ShowNotificationOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    showNotification({
        id,
        title: title || "Error",
        color: 'red',
        icon: icon || <IconExclamationMark size="100%" />,
        message: message || "An error occurred",
        autoClose: closeDelay || !loading,
        withCloseButton: closeable || !loading,
        loading: loading || false,
        styles: () => ({
            title: {
                fontSize: 17,
                fontWeight: 700,
            },
            description: { fontSize: 15 },
            icon: {
                marginLeft: 5,
                padding: 4,
                width: 38,
                height: 38,
            },
            loader: {
                marginLeft: 5,
            },
        }),
    });

    return {
        id,
        close: () => notifications.hide(id),
        update: (options: Omit<UpdateNotificationOptions, 'id'>) => updateNotification({
            ...options,
            id,
            color: options.color || 'red',
            icon: options.icon || <IconExclamationMark size="100%" />,
            message: options.message || message || "An error occurred",
            title: options.title || title || "Error",
        }),
    };
};

/**
 * Shows an INFO (blue) notification with the given options.
 *
 * All properties are stateful.
 *
 * All properties are optional
 *
 * @param message The message to display in the notification
 * @param title The title to display in the notification
 * @param icon The icon to display in the notification
 * @param loading Whether or not the notification should be in a loading state.
 * @param closeDelay The amount of time to wait before closing the notification
 * @param closeable Whether or not the notification can be closed
 * @returns The id of the notification
 *
 * @example
 * const id = showInfoNotification({
 *    message: "Something happened,
 *    title: "Info",
 *    icon: <IconInfoCircle size="100%" />,
 *    loading: false,
 *    closeDelay: 5000,
 *    closeable: true,
 * });
 *
 * // To close the notification
 *  closeNotification(id); // from "@mantine/notifications"
 */
export const showInfoNotification = ({
    message, title, icon, loading, closeDelay, closeable,
}: ShowNotificationOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    showNotification({
        id,
        title: title || "Info",
        color: 'blue',
        icon: icon || <IconInfoCircle size="100%" />,
        message: message || "An event happened",
        autoClose: closeDelay || !loading,
        withCloseButton: closeable || !loading,
        loading: loading || false,
        styles: () => ({
            title: {
                fontSize: 17,
                fontWeight: 700,
            },
            description: { fontSize: 15 },
            icon: {
                marginLeft: 5,
                padding: 4,
                width: 38,
                height: 38,
            },
            loader: {
                marginLeft: 5,
            },
        }),
    });

    return {
        id,
        close: () => notifications.hide(id),
        update: (options: Omit<UpdateNotificationOptions, 'id'>) => updateNotification({
            ...options,
            id,
            color: options.color || 'blue',
            icon: options.icon || <IconInfoCircle size="100%" />,
            message: options.message || message || "An event happened",
            title: options.title || title || "Info",
        }),
    };
};

/**
 * Shows an SUCCESS (green) notification with the given options.
 *
 * All properties are stateful.
 *
 * All properties are optional
 *
 * @param message The message to display in the notification
 * @param title The title to display in the notification
 * @param icon The icon to display in the notification
 * @param loading Whether or not the notification should be in a loading state.
 * @param closeDelay The amount of time to wait before closing the notification
 * @param closeable Whether or not the notification can be closed
 * @returns The id of the notification
 *
 * @example
 * const id = showSuccessNotification({
 *    message: "Your operation was successful!",
 *    title: "Success",
 *    icon: <IconCircleCheck size="100%" />,
 *    loading: false,
 *    closeDelay: 5000,
 *    closeable: true,
 * });
 *
 * // To close the notification
 *  closeNotification(id); // from "@mantine/notifications"
 */
export const showSuccessNotification = ({
    message, title, icon, loading, closeDelay, closeable,
}: ShowNotificationOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    showNotification({
        id,
        title: title || "Success",
        color: 'green',
        icon: icon || <IconCircleCheck size="100%" />,
        message: message || "Operation was successful",
        autoClose: closeDelay || !loading,
        withCloseButton: closeable || !loading,
        loading: loading || false,
        styles: () => ({
            title: {
                fontSize: 17,
                fontWeight: 700,
            },
            description: { fontSize: 15 },
            icon: {
                marginLeft: 5,
                padding: 4,
                width: 38,
                height: 38,
            },
            loader: {
                marginLeft: 5,
            },
        }),
    });

    return {
        id,
        close: () => notifications.hide(id),
        update: (options: Omit<UpdateNotificationOptions, 'id'>) => updateNotification({
            ...options,
            id,
            color: options.color || 'green',
            icon: options.icon || <IconCircleCheck size="100%" />,
            message: options.message || message || "Operation was successful",
            title: options.title || title || "Success",
        }),
    };
};

/**
 * Shows an WARNING (yellow) notification with the given options.
 *
 * All properties are stateful.
 *
 * All properties are optional
 *
 * @param message The message to display in the notification
 * @param title The title to display in the notification
 * @param icon The icon to display in the notification
 * @param loading Whether or not the notification should be in a loading state.
 * @param closeDelay The amount of time to wait before closing the notification
 * @param closeable Whether or not the notification can be closed
 * @returns The id of the notification
 *
 * @example
 * const id = showWarningNotification({
 *    message: "Something went wrong.",
 *    title: "Warning",
 *    icon: <IconAlertTriangle size="100%" />,
 *    loading: false,
 *    closeDelay: 5000,
 *    closeable: true,
 * });
 *
 * // To close the notification
 *  closeNotification(id); // from "@mantine/notifications"
 */
export const showWarningNotification = ({
    message, title, icon, loading, closeDelay, closeable,
}: ShowNotificationOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    showNotification({
        id,
        title: title || "Warning",
        color: 'yellow',
        icon: icon || <IconAlertTriangle size="100%" />,
        message: message || "Warning",
        autoClose: closeDelay || !loading,
        withCloseButton: closeable || !loading,
        loading: loading || false,
        styles: () => ({
            title: {
                fontSize: 17,
                fontWeight: 700,
            },
            description: { fontSize: 15 },
            icon: {
                marginLeft: 5,
                padding: 4,
                width: 38,
                height: 38,
            },
            loader: {
                marginLeft: 5,
            },
        }),
    });

    return {
        id,
        close: () => notifications.hide(id),
        update: (options: Omit<UpdateNotificationOptions, 'id'>) => updateNotification({
            ...options,
            id,
            color: options.color || 'yellow',
            icon: options.icon || <IconAlertTriangle size="100%" />,
            message: options.message || message || "Warning",
            title: options.title || title || "Warning",
        }),
    };
};

type APIResponseHandlerOptions = {
    successMessage?: string;
    errorMessage?: string;
    successTitle?: string;
    errorTitle?: string;
    closeDelay?: number;
    disableNotifications?: {
        success?: boolean;
        error?: boolean;
    };
    onSuccess?: (data: unknown) => Promise<unknown> | unknown;
    onError?: () => Promise<unknown> | unknown
}
/**
 * A wrapper around the fetch API that handles the response and displays a notification on success or error.
 *
 * The notifications can be disabled by setting the disableNotifications option to true.
 *
 * The onSuccess and onError callbacks can be used to execute additional code on success or error.
 *
 * The callbacks are executed after the notification is displayed.
 *
 * Generics can be used to specify the type of the response and for type checking.
 *
 * @param fetchCallback The fetch request to be executed
 * @param successMessage The message to be displayed on success
 * @param errorMessage The message to be displayed on error
 * @param successTitle The title to be displayed on success
 * @param errorTitle The title to be displayed on error
 * @param onSuccess The callback to be executed on success
 * @param onError The callback to be executed on error
 * @returns A promise that resolves to the response of the fetch request
 *
 * @example
 * const response = await apiResponseHandler(
 *    () => fetch('/api/endpoint'),
 *    {
 *       successMessage: 'Success',
 *       errorMessage: 'Error',
 *       successTitle: 'Success',
 *       errorTitle: 'Error',
 *       onSuccess: () => console.log('Success'),
 *       onError: () => console.log('Error'),
 *       disabledNotifications: false,
 *    }
 * );
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function apiResponseHandler<ResponseType>(fetchCallback: () => Promise<ResponseType | any>, {
    successMessage,
    errorMessage,
    successTitle,
    errorTitle,
    closeDelay,
    onSuccess,
    onError,
    disableNotifications,
}: APIResponseHandlerOptions) {
    return async () => {
        try {
            const result = await fetchCallback().then(async (res) => {
                if (res instanceof Response && !res.ok) {
                    const body = await res.json();
                    if (body.error) throw new Error(body.error); // if the response is a json object with an error property, throw an error

                    throw new Error(res.statusText); // if the response is a fetch response and not ok, throw an error
                }
                if (res.error) throw new Error(res.error); // if the response is a json object with an error property, throw an error

                if (res instanceof Response) return res.json(); // if the response is a fetch response, return the json
                if (res instanceof Object) return res; // if the response is already a json object, return it

                throw new Error('Invalid response'); // if the response is not a fetch response or a json object, throw an error
            });

            // handle response
            if (result.success || !result.error) {
                if (!disableNotifications?.success) {
                    showSuccessNotification({
                        message: successMessage,
                        title: successTitle,
                        closeable: true,
                        closeDelay: closeDelay || 3000,
                    });
                }
                if (onSuccess) onSuccess(result);
            } else {
                throw new Error(result.error); // if the response is an error, throw it
            }
            return result;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            // handle error
            if (!disableNotifications?.error) {
                showErrorNotification({
                    message: err && err.message ? (
                        <Text className="font-mono inline bg-[#FFB6B6] rounded-lg" color="red">{err.message}</Text>
                    ) : errorMessage,
                    title: errorTitle,
                    closeable: true,
                    closeDelay: closeDelay || 3000,
                });
            }
            if (onError) onError();
            return null;
        }
    };
}
