export abstract class AbstractEmailNotificationService { }
export interface ItemsData {
    item_name?: string;
    item_code?: string;
    quantity?: number;
    received_item?: boolean;
    received_item_quantity?: number;
    received_item_subtotal?: number | string;
    price?: number;
    unit?: string;
    pum?: string;
    path?: string;
    sub_total: number;
    division?: string;
    category?: string;
    default_photo?: any;
}
