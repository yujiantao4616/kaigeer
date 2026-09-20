import distributedKVStore from "@ohos:data.distributedKVStore";
import distributedDeviceManager from "@ohos:distributedDeviceManager";
import type common from "@ohos:app.ability.common";
import { clonePlan, cloneProgressList, TrainingPlan } from "@normalized:N&&&entry/src/main/ets/model/AppModel&";
import type { AppModel, DailyProgress } from "@normalized:N&&&entry/src/main/ets/model/AppModel&";
const BUNDLE_NAME: string = 'com.kaigeer.training';
const STORE_ID: string = 'kaigeer_wearable_sync';
const PAYLOAD_KEY: string = 'training_state';
/**
 * Only the plan and training history are shared with the companion device.
 * Theme, reminders and the active session remain local to the device that
 * owns them. This keeps a watch from replacing a phone's foreground session.
 */
export class WearableSharedPayload {
    plan: TrainingPlan;
    progress: Array<DailyProgress>;
    updatedAt: number;
    constructor(plan: TrainingPlan, progress: Array<DailyProgress>, updatedAt: number) {
        this.plan = plan;
        this.progress = progress;
        this.updatedAt = updatedAt;
    }
}
type SharedPayloadCallback = (payload: WearableSharedPayload) => void;
/**
 * Best-effort phone/watch bridge. A paired HarmonyOS phone and wearable use
 * the same bundle and a distributed SingleKVStore. If the user has not
 * paired/authorized a companion device, every operation is simply skipped
 * and the existing local PreferenceStore remains the source of truth.
 */
export class WearableSyncService {
    private static manager: distributedKVStore.KVManager | undefined;
    private static deviceManager: distributedDeviceManager.DeviceManager | undefined;
    private static store: distributedKVStore.SingleKVStore | undefined;
    private static initialized: boolean = false;
    private static callback: SharedPayloadCallback | undefined;
    private static listeners: Array<SharedPayloadCallback> = [];
    private static latestPayload: WearableSharedPayload | undefined;
    private static lastPublishedAt: number = 0;
    /** Subscribe UI surfaces that should refresh when the companion changes. */
    static subscribe(listener: SharedPayloadCallback): void {
        WearableSyncService.listeners.push(listener);
        if (WearableSyncService.latestPayload) {
            listener(WearableSyncService.latestPayload);
        }
    }
    static async init(context: common.UIAbilityContext, onRemote: SharedPayloadCallback): Promise<void> {
        if (WearableSyncService.initialized) {
            WearableSyncService.callback = onRemote;
            return;
        }
        WearableSyncService.callback = onRemote;
        try {
            WearableSyncService.manager = distributedKVStore.createKVManager({
                bundleName: BUNDLE_NAME,
                context: context
            });
            const options: distributedKVStore.Options = {
                createIfMissing: true,
                encrypt: true,
                backup: false,
                autoSync: true,
                kvStoreType: distributedKVStore.KVStoreType.SINGLE_VERSION,
                securityLevel: distributedKVStore.SecurityLevel.S2
            };
            WearableSyncService.store = await WearableSyncService.manager.getKVStore<distributedKVStore.SingleKVStore>(STORE_ID, options);
            WearableSyncService.store.on('dataChange', distributedKVStore.SubscribeType.SUBSCRIBE_TYPE_REMOTE, (_change: distributedKVStore.ChangeNotification): void => {
                WearableSyncService.readRemote().catch((error: Object) => {
                    console.info(`Wearable sync remote read skipped: ${JSON.stringify(error)}`);
                });
            });
            WearableSyncService.initialized = true;
            await WearableSyncService.readRemote();
            await WearableSyncService.syncWithAvailableDevices();
            console.info('[WearableSync] distributed store ready');
        }
        catch (error) {
            // A missing permission, simulator, or unpaired wearable must not block
            // the phone/watch UI. The local store continues to work as before.
            console.info(`Wearable sync unavailable; local mode continues: ${JSON.stringify(error)}`);
        }
    }
    static async publish(model: AppModel): Promise<void> {
        if (!WearableSyncService.initialized || WearableSyncService.store === undefined) {
            return;
        }
        const updatedAt: number = Date.now();
        if (updatedAt <= WearableSyncService.lastPublishedAt) {
            return;
        }
        WearableSyncService.lastPublishedAt = updatedAt;
        const payload: WearableSharedPayload = new WearableSharedPayload(clonePlan(model.plan), cloneProgressList(model.progress), updatedAt);
        try {
            await WearableSyncService.store.put(PAYLOAD_KEY, JSON.stringify(payload));
            await WearableSyncService.syncWithAvailableDevices();
        }
        catch (error) {
            console.info(`Wearable sync publish skipped: ${JSON.stringify(error)}`);
        }
    }
    private static async readRemote(): Promise<void> {
        if (!WearableSyncService.store || !WearableSyncService.callback) {
            return;
        }
        try {
            const value: boolean | string | number | Uint8Array = await WearableSyncService.store.get(PAYLOAD_KEY);
            if (typeof value !== 'string' || value.length === 0) {
                return;
            }
            const raw: WearableSharedPayload = JSON.parse(value) as WearableSharedPayload;
            if (!raw.plan || !Array.isArray(raw.progress) || typeof raw.updatedAt !== 'number') {
                return;
            }
            const payload: WearableSharedPayload = new WearableSharedPayload(new TrainingPlan(raw.plan.tightenSeconds, raw.plan.relaxSeconds, raw.plan.repetitions, raw.plan.setsPerDay), cloneProgressList(raw.progress), raw.updatedAt);
            if (payload.updatedAt <= WearableSyncService.lastPublishedAt) {
                return;
            }
            WearableSyncService.lastPublishedAt = payload.updatedAt;
            WearableSyncService.latestPayload = payload;
            WearableSyncService.callback(payload);
            for (const listener of WearableSyncService.listeners) {
                listener(payload);
            }
        }
        catch (error) {
            // The store is optional; malformed/old data should never break launch.
            console.info(`Wearable sync read skipped: ${JSON.stringify(error)}`);
        }
    }
    private static async syncWithAvailableDevices(): Promise<void> {
        if (!WearableSyncService.store) {
            return;
        }
        try {
            if (!WearableSyncService.deviceManager) {
                WearableSyncService.deviceManager = distributedDeviceManager.createDeviceManager(BUNDLE_NAME);
            }
            const devices: Array<distributedDeviceManager.DeviceBasicInfo> = WearableSyncService.deviceManager.getAvailableDeviceListSync();
            const networkIds: Array<string> = devices
                .map((device: distributedDeviceManager.DeviceBasicInfo) => device.networkId ?? '')
                .filter((networkId: string) => networkId.length > 0);
            if (networkIds.length > 0) {
                WearableSyncService.store.sync(networkIds, distributedKVStore.SyncMode.PUSH_PULL, 0);
            }
        }
        catch (error) {
            // Auto-sync remains enabled; explicit device enumeration is best effort.
            console.info(`Wearable sync device discovery skipped: ${JSON.stringify(error)}`);
        }
    }
}
