import { DeviceType } from '../enums/user';

export interface DeviceInfo {
    device_name: string;
    device_type: DeviceType;
    device_model: string;
    device_os: string;
    device_os_version: string;
}
