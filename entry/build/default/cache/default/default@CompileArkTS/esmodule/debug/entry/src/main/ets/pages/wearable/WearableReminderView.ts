if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WearableReminderView_Params {
    locale?: string;
    primaryColor?: string;
    onPrimaryColor?: string;
    pageBackground?: string;
    pageBorder?: string;
    accentColor?: string;
    textColor?: string;
    mutedColor?: string;
    remindersEnabled?: boolean;
    reminderTimes?: Array<string>;
    maxReminderCount?: number;
    selectedIndex?: number;
    selectedTime?: string;
    revealOpacity?: number;
    revealScale?: number;
    onToggleReminders?: () => void;
    onSetReminder?: (index: number, value: string) => void;
    onAddReminder?: () => void;
    onRemoveReminder?: (index: number) => void;
}
export class WearableReminderView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__locale = new SynchedPropertySimpleOneWayPU(params.locale, this, "locale");
        this.__primaryColor = new SynchedPropertySimpleOneWayPU(params.primaryColor, this, "primaryColor");
        this.__onPrimaryColor = new SynchedPropertySimpleOneWayPU(params.onPrimaryColor, this, "onPrimaryColor");
        this.__pageBackground = new SynchedPropertySimpleOneWayPU(params.pageBackground, this, "pageBackground");
        this.__pageBorder = new SynchedPropertySimpleOneWayPU(params.pageBorder, this, "pageBorder");
        this.__accentColor = new SynchedPropertySimpleOneWayPU(params.accentColor, this, "accentColor");
        this.__textColor = new SynchedPropertySimpleOneWayPU(params.textColor, this, "textColor");
        this.__mutedColor = new SynchedPropertySimpleOneWayPU(params.mutedColor, this, "mutedColor");
        this.__remindersEnabled = new SynchedPropertySimpleOneWayPU(params.remindersEnabled, this, "remindersEnabled");
        this.__reminderTimes = new SynchedPropertyObjectOneWayPU(params.reminderTimes, this, "reminderTimes");
        this.__maxReminderCount = new SynchedPropertySimpleOneWayPU(params.maxReminderCount, this, "maxReminderCount");
        this.__selectedIndex = new ObservedPropertySimplePU(0, this, "selectedIndex");
        this.__selectedTime = new ObservedPropertySimplePU('', this, "selectedTime");
        this.__revealOpacity = new ObservedPropertySimplePU(0, this, "revealOpacity");
        this.__revealScale = new ObservedPropertySimplePU(0.96, this, "revealScale");
        this.onToggleReminders = () => { };
        this.onSetReminder = (_index: number, _value: string) => { };
        this.onAddReminder = () => { };
        this.onRemoveReminder = (_index: number) => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WearableReminderView_Params) {
        if (params.locale === undefined) {
            this.__locale.set('zh');
        }
        if (params.primaryColor === undefined) {
            this.__primaryColor.set('#087F73');
        }
        if (params.onPrimaryColor === undefined) {
            this.__onPrimaryColor.set('#FFFFFF');
        }
        if (params.pageBackground === undefined) {
            this.__pageBackground.set('#F7F9F8');
        }
        if (params.pageBorder === undefined) {
            this.__pageBorder.set('#D7E3E0');
        }
        if (params.accentColor === undefined) {
            this.__accentColor.set('#E8F6F2');
        }
        if (params.textColor === undefined) {
            this.__textColor.set('#17312D');
        }
        if (params.mutedColor === undefined) {
            this.__mutedColor.set('#617571');
        }
        if (params.remindersEnabled === undefined) {
            this.__remindersEnabled.set(false);
        }
        if (params.reminderTimes === undefined) {
            this.__reminderTimes.set([]);
        }
        if (params.maxReminderCount === undefined) {
            this.__maxReminderCount.set(3);
        }
        if (params.selectedIndex !== undefined) {
            this.selectedIndex = params.selectedIndex;
        }
        if (params.selectedTime !== undefined) {
            this.selectedTime = params.selectedTime;
        }
        if (params.revealOpacity !== undefined) {
            this.revealOpacity = params.revealOpacity;
        }
        if (params.revealScale !== undefined) {
            this.revealScale = params.revealScale;
        }
        if (params.onToggleReminders !== undefined) {
            this.onToggleReminders = params.onToggleReminders;
        }
        if (params.onSetReminder !== undefined) {
            this.onSetReminder = params.onSetReminder;
        }
        if (params.onAddReminder !== undefined) {
            this.onAddReminder = params.onAddReminder;
        }
        if (params.onRemoveReminder !== undefined) {
            this.onRemoveReminder = params.onRemoveReminder;
        }
    }
    updateStateVars(params: WearableReminderView_Params) {
        this.__locale.reset(params.locale);
        this.__primaryColor.reset(params.primaryColor);
        this.__onPrimaryColor.reset(params.onPrimaryColor);
        this.__pageBackground.reset(params.pageBackground);
        this.__pageBorder.reset(params.pageBorder);
        this.__accentColor.reset(params.accentColor);
        this.__textColor.reset(params.textColor);
        this.__mutedColor.reset(params.mutedColor);
        this.__remindersEnabled.reset(params.remindersEnabled);
        this.__reminderTimes.reset(params.reminderTimes);
        this.__maxReminderCount.reset(params.maxReminderCount);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__locale.purgeDependencyOnElmtId(rmElmtId);
        this.__primaryColor.purgeDependencyOnElmtId(rmElmtId);
        this.__onPrimaryColor.purgeDependencyOnElmtId(rmElmtId);
        this.__pageBackground.purgeDependencyOnElmtId(rmElmtId);
        this.__pageBorder.purgeDependencyOnElmtId(rmElmtId);
        this.__accentColor.purgeDependencyOnElmtId(rmElmtId);
        this.__textColor.purgeDependencyOnElmtId(rmElmtId);
        this.__mutedColor.purgeDependencyOnElmtId(rmElmtId);
        this.__remindersEnabled.purgeDependencyOnElmtId(rmElmtId);
        this.__reminderTimes.purgeDependencyOnElmtId(rmElmtId);
        this.__maxReminderCount.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedTime.purgeDependencyOnElmtId(rmElmtId);
        this.__revealOpacity.purgeDependencyOnElmtId(rmElmtId);
        this.__revealScale.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__locale.aboutToBeDeleted();
        this.__primaryColor.aboutToBeDeleted();
        this.__onPrimaryColor.aboutToBeDeleted();
        this.__pageBackground.aboutToBeDeleted();
        this.__pageBorder.aboutToBeDeleted();
        this.__accentColor.aboutToBeDeleted();
        this.__textColor.aboutToBeDeleted();
        this.__mutedColor.aboutToBeDeleted();
        this.__remindersEnabled.aboutToBeDeleted();
        this.__reminderTimes.aboutToBeDeleted();
        this.__maxReminderCount.aboutToBeDeleted();
        this.__selectedIndex.aboutToBeDeleted();
        this.__selectedTime.aboutToBeDeleted();
        this.__revealOpacity.aboutToBeDeleted();
        this.__revealScale.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __locale: SynchedPropertySimpleOneWayPU<string>;
    get locale() {
        return this.__locale.get();
    }
    set locale(newValue: string) {
        this.__locale.set(newValue);
    }
    private __primaryColor: SynchedPropertySimpleOneWayPU<string>;
    get primaryColor() {
        return this.__primaryColor.get();
    }
    set primaryColor(newValue: string) {
        this.__primaryColor.set(newValue);
    }
    private __onPrimaryColor: SynchedPropertySimpleOneWayPU<string>;
    get onPrimaryColor() {
        return this.__onPrimaryColor.get();
    }
    set onPrimaryColor(newValue: string) {
        this.__onPrimaryColor.set(newValue);
    }
    private __pageBackground: SynchedPropertySimpleOneWayPU<string>;
    get pageBackground() {
        return this.__pageBackground.get();
    }
    set pageBackground(newValue: string) {
        this.__pageBackground.set(newValue);
    }
    private __pageBorder: SynchedPropertySimpleOneWayPU<string>;
    get pageBorder() {
        return this.__pageBorder.get();
    }
    set pageBorder(newValue: string) {
        this.__pageBorder.set(newValue);
    }
    private __accentColor: SynchedPropertySimpleOneWayPU<string>;
    get accentColor() {
        return this.__accentColor.get();
    }
    set accentColor(newValue: string) {
        this.__accentColor.set(newValue);
    }
    private __textColor: SynchedPropertySimpleOneWayPU<string>;
    get textColor() {
        return this.__textColor.get();
    }
    set textColor(newValue: string) {
        this.__textColor.set(newValue);
    }
    private __mutedColor: SynchedPropertySimpleOneWayPU<string>;
    get mutedColor() {
        return this.__mutedColor.get();
    }
    set mutedColor(newValue: string) {
        this.__mutedColor.set(newValue);
    }
    private __remindersEnabled: SynchedPropertySimpleOneWayPU<boolean>;
    get remindersEnabled() {
        return this.__remindersEnabled.get();
    }
    set remindersEnabled(newValue: boolean) {
        this.__remindersEnabled.set(newValue);
    }
    private __reminderTimes: SynchedPropertySimpleOneWayPU<Array<string>>;
    get reminderTimes() {
        return this.__reminderTimes.get();
    }
    set reminderTimes(newValue: Array<string>) {
        this.__reminderTimes.set(newValue);
    }
    private __maxReminderCount: SynchedPropertySimpleOneWayPU<number>;
    get maxReminderCount() {
        return this.__maxReminderCount.get();
    }
    set maxReminderCount(newValue: number) {
        this.__maxReminderCount.set(newValue);
    }
    private __selectedIndex: ObservedPropertySimplePU<number>;
    get selectedIndex() {
        return this.__selectedIndex.get();
    }
    set selectedIndex(newValue: number) {
        this.__selectedIndex.set(newValue);
    }
    private __selectedTime: ObservedPropertySimplePU<string>;
    get selectedTime() {
        return this.__selectedTime.get();
    }
    set selectedTime(newValue: string) {
        this.__selectedTime.set(newValue);
    }
    private __revealOpacity: ObservedPropertySimplePU<number>;
    get revealOpacity() {
        return this.__revealOpacity.get();
    }
    set revealOpacity(newValue: number) {
        this.__revealOpacity.set(newValue);
    }
    private __revealScale: ObservedPropertySimplePU<number>;
    get revealScale() {
        return this.__revealScale.get();
    }
    set revealScale(newValue: number) {
        this.__revealScale.set(newValue);
    }
    private onToggleReminders: () => void;
    private onSetReminder: (index: number, value: string) => void;
    private onAddReminder: () => void;
    private onRemoveReminder: (index: number) => void;
    aboutToAppear(): void {
        this.selectedIndex = 0;
        this.selectedTime = this.reminderTimes.length > 0 ? this.reminderTimes[0] : '';
        this.revealOpacity = 0;
        this.revealScale = 0.96;
        setTimeout(() => {
            this.revealOpacity = 1;
            this.revealScale = 1;
        }, 80);
    }
    private currentIndex(): number {
        if (this.reminderTimes.length === 0) {
            return 0;
        }
        if (this.selectedTime !== '') {
            const matchingIndex: number = this.reminderTimes.indexOf(this.selectedTime);
            if (matchingIndex >= 0) {
                return matchingIndex;
            }
        }
        return Math.min(this.selectedIndex, this.reminderTimes.length - 1);
    }
    private currentTime(): string {
        const index: number = this.currentIndex();
        return index >= 0 && index < this.reminderTimes.length ? this.reminderTimes[index] : '--:--';
    }
    private selectReminder(offset: number): void {
        if (this.reminderTimes.length === 0) {
            return;
        }
        const length: number = this.reminderTimes.length;
        const nextIndex: number = (this.currentIndex() + offset + length) % length;
        this.selectedIndex = nextIndex;
        this.selectedTime = this.reminderTimes[nextIndex];
    }
    private shiftTime(value: string, deltaMinutes: number): string {
        const parts: Array<string> = value.split(':');
        let minutes: number = Number(parts[0]) * 60 + Number(parts[1]) + deltaMinutes;
        while (minutes < 0) {
            minutes += 24 * 60;
        }
        minutes = minutes % (24 * 60);
        const hour: number = Math.floor(minutes / 60);
        const minute: number = minutes % 60;
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }
    private adjustTime(deltaMinutes: number): void {
        if (this.reminderTimes.length === 0) {
            return;
        }
        const index: number = this.currentIndex();
        const nextTime: string = this.shiftTime(this.currentTime(), deltaMinutes);
        for (let itemIndex: number = 0; itemIndex < this.reminderTimes.length; itemIndex++) {
            if (itemIndex !== index && this.reminderTimes[itemIndex] === nextTime) {
                return;
            }
        }
        this.selectedIndex = index;
        this.selectedTime = nextTime;
        this.onSetReminder(index, nextTime);
    }
    private removeCurrent(): void {
        if (this.reminderTimes.length <= 1) {
            return;
        }
        const index: number = this.currentIndex();
        const nextIndex: number = index < this.reminderTimes.length - 1 ? index + 1 : index - 1;
        this.selectedIndex = nextIndex;
        this.selectedTime = this.reminderTimes[nextIndex];
        this.onRemoveReminder(index);
    }
    private reminderToggle(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.remindersEnabled ? 'ON' : 'OFF', { type: ButtonType.Capsule });
            Button.width(48);
            Button.height(26);
            Button.fontSize(10);
            Button.fontColor(this.remindersEnabled ? this.onPrimaryColor : this.mutedColor);
            Button.backgroundColor(this.remindersEnabled ? this.primaryColor : this.pageBorder);
            Button.onClick(() => this.onToggleReminders());
        }, Button);
        Button.pop();
    }
    private adjustButton(label: string, deltaMinutes: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(label, { type: ButtonType.Capsule });
            Button.width(78);
            Button.height(32);
            Button.fontSize(11);
            Button.fontColor(this.textColor);
            Button.backgroundColor(this.accentColor);
            Button.onClick(() => this.adjustTime(deltaMinutes));
        }, Button);
        Button.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 6 });
            Column.width('100%');
            Column.height('100%');
            Column.padding({ left: 10, right: 10, top: 8, bottom: 8 });
            Column.backgroundColor(this.pageBackground);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.locale === 'en' ? 'Reminders' : '训练提醒');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.textColor);
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.reminderToggle.bind(this)();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.locale === 'en' ? 'One reminder at a time' : '一次只调整一个提醒');
            Text.fontSize(9);
            Text.fontColor(this.mutedColor);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Center });
            globalThis.Context.animation({ duration: 380, curve: Curve.EaseOut });
            Stack.width('100%');
            Stack.height(194);
            Stack.opacity(this.revealOpacity);
            Stack.scale({ x: this.revealScale, y: this.revealScale });
            globalThis.Context.animation(null);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(190);
            Circle.height(190);
            Circle.fill(this.accentColor);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 2 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.currentTime());
            Text.fontSize(42);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.primaryColor);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.reminderTimes.length > 0
                ? `${this.currentIndex() + 1} / ${this.reminderTimes.length}`
                : '0 / 0');
            Text.fontSize(11);
            Text.fontColor(this.mutedColor);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.locale === 'en' ? 'daily' : '每天');
            Text.fontSize(10);
            Text.fontColor(this.mutedColor);
        }, Text);
        Text.pop();
        Column.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 26 });
            Row.justifyContent(FlexAlign.Center);
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('‹');
            Text.width(42);
            Text.height(36);
            Text.fontSize(34);
            Text.fontColor(this.primaryColor);
            Text.textAlign(TextAlign.Center);
            Text.onClick(() => this.selectReminder(-1));
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.locale === 'en' ? 'Switch reminder' : '切换提醒');
            Text.fontSize(10);
            Text.fontColor(this.mutedColor);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('›');
            Text.width(42);
            Text.height(36);
            Text.fontSize(34);
            Text.fontColor(this.primaryColor);
            Text.textAlign(TextAlign.Center);
            Text.onClick(() => this.selectReminder(1));
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.justifyContent(FlexAlign.Center);
            Row.width('100%');
        }, Row);
        this.adjustButton.bind(this)(this.locale === 'en' ? '−15 min' : '−15 分', -15);
        this.adjustButton.bind(this)(this.locale === 'en' ? '+15 min' : '+15 分', 15);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.justifyContent(FlexAlign.Center);
            Row.width('100%');
        }, Row);
        this.adjustButton.bind(this)(this.locale === 'en' ? '−1 min' : '−1 分', -1);
        this.adjustButton.bind(this)(this.locale === 'en' ? '+1 min' : '+1 分', 1);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.justifyContent(FlexAlign.Center);
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.reminderTimes.length > 1) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.locale === 'en' ? 'Remove' : '删除当前', { type: ButtonType.Capsule });
                        Button.width(92);
                        Button.height(30);
                        Button.fontSize(10);
                        Button.fontColor(this.primaryColor);
                        Button.backgroundColor(this.pageBackground);
                        Button.border({ width: 1, color: this.pageBorder });
                        Button.onClick(() => this.removeCurrent());
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.reminderTimes.length < this.maxReminderCount) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.locale === 'en' ? '+ Add' : '+ 添加', { type: ButtonType.Capsule });
                        Button.width(92);
                        Button.height(30);
                        Button.fontSize(10);
                        Button.fontColor(this.onPrimaryColor);
                        Button.backgroundColor(this.primaryColor);
                        Button.onClick(() => this.onAddReminder());
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.locale === 'en'
                ? 'Use the large controls to adjust time. Swipe left to return.'
                : '用大按钮调整时间；向左滑返回开始');
            Text.fontSize(8);
            Text.fontColor(this.mutedColor);
            Text.maxLines(2);
            Text.textAlign(TextAlign.Center);
            Text.width('94%');
        }, Text);
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
