export type Notification = {
  uuid: string;
  title: string;
  message: string;
  type: string;
  isRead: string;
  data: string | null;
  createdAt: string;
};

export type TransferRequest = {
  uuid: string;
  status: string;
  expiresAt: string;
};

export type TransferRequestsData = {
  received: TransferRequest[];
  sent: TransferRequest[];
};

export type NotificationsData = {
  notifications: Notification[];
  unreadCount: number;
};
