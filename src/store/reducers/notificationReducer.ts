import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  StateT,
  UnseenNotifiesCountT,
  GetNotificationT,
  DeleteNotificationT,
  MarkNotificationAsReadT,
} from "../../interface/reducers/notificationReducer.types";

import { NotificationT } from "../../interface/db/notification.types";

const initialState: StateT = {
  sideBarLoadingState: {
    loading: false,
    error: false,
    message: "",
  },

  contentLoadingState: {
    loading: false,
    error: false,
    message: "",
  },

  operationLoadingState: {
    loading: false,
    error: false,
    message: "",
  },

  unseenNotifiesCount: 0,

  notifications: [],

  notification: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setSideBarError(
      state,
      { payload: { message } }: PayloadAction<{ message: string }>
    ) {
      updateLoadingState({
        state,
        key: "sideBarLoadingState",
        loading: false,
        error: true,
        message,
      });
    },

    setContentError(
      state,
      { payload: { message } }: PayloadAction<{ message: string }>
    ) {
      updateLoadingState({
        state,
        key: "contentLoadingState",
        loading: false,
        error: true,
        message,
      });
    },

    setOperationError(
      state,
      { payload: { message } }: PayloadAction<{ message: string }>
    ) {
      updateLoadingState({
        state,
        key: "operationLoadingState",
        loading: false,
        error: true,
        message,
      });
    },

    /////////////////////////////

    setUnseenNotificationsCount(
      state,
      { payload }: PayloadAction<UnseenNotifiesCountT>
    ) {
      state.unseenNotifiesCount = payload;
    },

    getNotifications(state) {
      updateLoadingState({ state, key: "sideBarLoadingState" });
    },

    setNotifications(state, { payload }: PayloadAction<NotificationT[]>) {
      state.notifications = payload;

      updateLoadingState({ state, key: "sideBarLoadingState", loading: false });
    },

    getNotification(state, { payload }: PayloadAction<GetNotificationT>) {
      updateLoadingState({ state, key: "contentLoadingState" });
    },

    setNotification(state, { payload }: PayloadAction<NotificationT>) {
      state.notification = payload;

      updateLoadingState({ state, key: "contentLoadingState", loading: false });
    },

    deleteNotification(state, { payload }: PayloadAction<DeleteNotificationT>) {
      updateLoadingState({ state, key: "operationLoadingState" });
    },

    setDeletedNotification(
      state,
      { payload: { notifyId } }: PayloadAction<DeleteNotificationT>
    ) {
      state.notifications = state.notifications.filter(
        (notify) => notify._id !== notifyId
      );
    },

    deleteAllNotification(state) {
      updateLoadingState({ state, key: "operationLoadingState" });
    },

    setDeletedNotifications(state) {
      state.notifications = [];
    },

    markNotificationsAsSeen(state) {
      updateLoadingState({ state, key: "operationLoadingState" });
    },

    setNotificationsAsSeen(state) {
      state.notifications.forEach((notify) => (notify.seen = true));
      state.unseenNotifiesCount = 0;
    },

    markNotificationAsRead(
      state,
      { payload }: PayloadAction<MarkNotificationAsReadT>
    ) {},

    setMarkNotificationAsRead(
      state,
      { payload: { notifyId } }: PayloadAction<MarkNotificationAsReadT>
    ) {
      const i = state.notifications.findIndex(
        (notify) => notify._id === notifyId
      );

      if (i >= 0)
        state.notifications[i] = {
          ...state.notifications[i],
          read: true,
        };
    },
  },
});

export default notificationSlice.reducer;

export const {
  setSideBarError,
  setContentError,
  setOperationError,
  setUnseenNotificationsCount,
  getNotifications,
  setNotifications,
  getNotification,
  setNotification,
  deleteAllNotification,
  setDeletedNotifications,
  deleteNotification,
  setDeletedNotification,
  markNotificationsAsSeen,
  setNotificationsAsSeen,
  markNotificationAsRead,
  setMarkNotificationAsRead,
} = notificationSlice.actions;

type KeyT =
  | "sideBarLoadingState"
  | "contentLoadingState"
  | "operationLoadingState";

interface UpdaterT {
  state: StateT;
  key: KeyT;
  loading?: boolean;
  error?: boolean;
  message?: string;
}

function updateLoadingState({
  state,
  key,
  loading = true,
  error = false,
  message = "",
}: UpdaterT) {
  state[key].loading = loading;
  state[key].error = error ? true : false;
  state[key].message = error ? message : "";
}
