if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WearableHomeView_Params {
    locale?: string;
    wearableTab?: number;
    primaryColor?: string;
    onPrimaryColor?: string;
    pageBackground?: string;
    pageBorder?: string;
    accentColor?: string;
    textColor?: string;
    mutedColor?: string;
    completedSets?: number;
    targetSets?: number;
    completedRepetitions?: number;
    targetRepetitions?: number;
    remindersEnabled?: boolean;
    reminderTimes?: Array<string>;
    maxReminderCount?: number;
    revealOpacity?: number;
    revealScale?: number;
    onStart?: () => void;
    onChangeTab?: (index: number) => void;
    onToggleReminders?: () => void;
    onEditReminder?: (index: number) => void;
    onSetReminder?: (index: number, value: string) => void;
    onAddReminder?: () => void;
    onRemoveReminder?: (index: number) => void;
}
import { WearableReminderView } from "@normalized:N&&&entry/src/main/ets/pages/wearable/WearableReminderView&";
export class WearableHomeView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__locale = new SynchedPropertySimpleOneWayPU(params.locale, this, "locale");
        this.__wearableTab = new SynchedPropertySimpleOneWayPU(params.wearableTab, this, "wearableTab");
        this.__primaryColor = new SynchedPropertySimpleOneWayPU(params.primaryColor, this, "primaryColor");
        this.__onPrimaryColor = new SynchedPropertySimpleOneWayPU(params.onPrimaryColor, this, "onPrimaryColor");
        this.__pageBackground = new SynchedPropertySimpleOneWayPU(params.pageBackground, this, "pageBackground");
        this.__pageBorder = new SynchedPropertySimpleOneWayPU(params.pageBorder, this, "pageBorder");
        this.__accentColor = new SynchedPropertySimpleOneWayPU(params.accentColor, this, "accentColor");
        this.__textColor = new SynchedPropertySimpleOneWayPU(params.textColor, this, "textColor");
        this.__mutedColor = new SynchedPropertySimpleOneWayPU(params.mutedColor, this, "mutedColor");
        this.__completedSets = new SynchedPropertySimpleOneWayPU(params.completedSets, this, "completedSets");
        this.__targetSets = new SynchedPropertySimpleOneWayPU(params.targetSets, this, "targetSets");
        this.__completedRepetitions = new SynchedPropertySimpleOneWayPU(params.completedRepetitions, this, "completedRepetitions");
        this.__targetRepetitions = new SynchedPropertySimpleOneWayPU(params.targetRepetitions, this, "targetRepetitions");
        this.__remindersEnabled = new SynchedPropertySimpleOneWayPU(params.remindersEnabled, this, "remindersEnabled");
        this.__reminderTimes = new SynchedPropertyObjectOneWayPU(params.reminderTimes, this, "reminderTimes");
        this.__maxReminderCount = new SynchedPropertySimpleOneWayPU(params.maxReminderCount, this, "maxReminderCount");
        this.__revealOpacity = new ObservedPropertySimplePU(0, this, "revealOpacity");
        this.__revealScale = new ObservedPropertySimplePU(0.96, this, "revealScale");
        this.onStart = () => { };
        this.onChangeTab = (_index: number) => { };
        this.onToggleReminders = () => { };
        this.onEditReminder = (_index: number) => { };
        this.onSetReminder = (_index: number, _value: string) => { };
        this.onAddReminder = () => { };
        this.onRemoveReminder = (_index: number) => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WearableHomeView_Params) {
        if (params.locale === undefined) {
            this.__locale.set('zh');
        }
        if (params.wearableTab === undefined) {
            this.__wearableTab.set(1);
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
        if (params.completedSets === undefined) {
            this.__completedSets.set(0);
        }
        if (params.targetSets === undefined) {
            this.__targetSets.set(3);
        }
        if (params.completedRepetitions === undefined) {
            this.__completedRepetitions.set(0);
        }
        if (params.targetRepetitions === undefined) {
            this.__targetRepetitions.set(10);
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
        if (params.revealOpacity !== undefined) {
            this.revealOpacity = params.revealOpacity;
        }
        if (params.revealScale !== undefined) {
            this.revealScale = params.revealScale;
        }
        if (params.onStart !== undefined) {
            this.onStart = params.onStart;
        }
        if (params.onChangeTab !== undefined) {
            this.onChangeTab = params.onChangeTab;
        }
        if (params.onToggleReminders !== undefined) {
            this.onToggleReminders = params.onToggleReminders;
        }
        if (params.onEditReminder !== undefined) {
            this.onEditReminder = params.onEditReminder;
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
    updateStateVars(params: WearableHomeView_Params) {
        this.__locale.reset(params.locale);
        this.__wearableTab.reset(params.wearableTab);
        this.__primaryColor.reset(params.primaryColor);
        this.__onPrimaryColor.reset(params.onPrimaryColor);
        this.__pageBackground.reset(params.pageBackground);
        this.__pageBorder.reset(params.pageBorder);
        this.__accentColor.reset(params.accentColor);
        this.__textColor.reset(params.textColor);
        this.__mutedColor.reset(params.mutedColor);
        this.__completedSets.reset(params.completedSets);
        this.__targetSets.reset(params.targetSets);
        this.__completedRepetitions.reset(params.completedRepetitions);
        this.__targetRepetitions.reset(params.targetRepetitions);
        this.__remindersEnabled.reset(params.remindersEnabled);
        this.__reminderTimes.reset(params.reminderTimes);
        this.__maxReminderCount.reset(params.maxReminderCount);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__locale.purgeDependencyOnElmtId(rmElmtId);
        this.__wearableTab.purgeDependencyOnElmtId(rmElmtId);
        this.__primaryColor.purgeDependencyOnElmtId(rmElmtId);
        this.__onPrimaryColor.purgeDependencyOnElmtId(rmElmtId);
        this.__pageBackground.purgeDependencyOnElmtId(rmElmtId);
        this.__pageBorder.purgeDependencyOnElmtId(rmElmtId);
        this.__accentColor.purgeDependencyOnElmtId(rmElmtId);
        this.__textColor.purgeDependencyOnElmtId(rmElmtId);
        this.__mutedColor.purgeDependencyOnElmtId(rmElmtId);
        this.__completedSets.purgeDependencyOnElmtId(rmElmtId);
        this.__targetSets.purgeDependencyOnElmtId(rmElmtId);
        this.__completedRepetitions.purgeDependencyOnElmtId(rmElmtId);
        this.__targetRepetitions.purgeDependencyOnElmtId(rmElmtId);
        this.__remindersEnabled.purgeDependencyOnElmtId(rmElmtId);
        this.__reminderTimes.purgeDependencyOnElmtId(rmElmtId);
        this.__maxReminderCount.purgeDependencyOnElmtId(rmElmtId);
        this.__revealOpacity.purgeDependencyOnElmtId(rmElmtId);
        this.__revealScale.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__locale.aboutToBeDeleted();
        this.__wearableTab.aboutToBeDeleted();
        this.__primaryColor.aboutToBeDeleted();
        this.__onPrimaryColor.aboutToBeDeleted();
        this.__pageBackground.aboutToBeDeleted();
        this.__pageBorder.aboutToBeDeleted();
        this.__accentColor.aboutToBeDeleted();
        this.__textColor.aboutToBeDeleted();
        this.__mutedColor.aboutToBeDeleted();
        this.__completedSets.aboutToBeDeleted();
        this.__targetSets.aboutToBeDeleted();
        this.__completedRepetitions.aboutToBeDeleted();
        this.__targetRepetitions.aboutToBeDeleted();
        this.__remindersEnabled.aboutToBeDeleted();
        this.__reminderTimes.aboutToBeDeleted();
        this.__maxReminderCount.aboutToBeDeleted();
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
    private __wearableTab: SynchedPropertySimpleOneWayPU<number>;
    get wearableTab() {
        return this.__wearableTab.get();
    }
    set wearableTab(newValue: number) {
        this.__wearableTab.set(newValue);
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
    private __completedSets: SynchedPropertySimpleOneWayPU<number>;
    get completedSets() {
        return this.__completedSets.get();
    }
    set completedSets(newValue: number) {
        this.__completedSets.set(newValue);
    }
    private __targetSets: SynchedPropertySimpleOneWayPU<number>;
    get targetSets() {
        return this.__targetSets.get();
    }
    set targetSets(newValue: number) {
        this.__targetSets.set(newValue);
    }
    private __completedRepetitions: SynchedPropertySimpleOneWayPU<number>;
    get completedRepetitions() {
        return this.__completedRepetitions.get();
    }
    set completedRepetitions(newValue: number) {
        this.__completedRepetitions.set(newValue);
    }
    private __targetRepetitions: SynchedPropertySimpleOneWayPU<number>;
    get targetRepetitions() {
        return this.__targetRepetitions.get();
    }
    set targetRepetitions(newValue: number) {
        this.__targetRepetitions.set(newValue);
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
    private __revealOpacity: ObservedPropertySimplePU<number>;
    get revealOpacity() {
        return this.__revealOpacity.get();
    }
    set revealOpacity(newValue: number) {
        this.__revealOpacity.set(newValue);
    }
    // The first frame starts slightly smaller, then continues with a gentle
    // breathing pulse while the start page is visible.
    private __revealScale: ObservedPropertySimplePU<number>;
    get revealScale() {
        return this.__revealScale.get();
    }
    set revealScale(newValue: number) {
        this.__revealScale.set(newValue);
    }
    private onStart: () => void;
    private onChangeTab: (index: number) => void;
    private onToggleReminders: () => void;
    private onEditReminder: (index: number) => void;
    private onSetReminder: (index: number, value: string) => void;
    private onAddReminder: () => void;
    private onRemoveReminder: (index: number) => void;
    aboutToAppear(): void {
        // Own the first-frame animation inside the wearable component. A parent
        // page can be created before the watch surface is attached, which made a
        // parent-driven opacity change appear to be skipped on the emulator.
        this.revealOpacity = 0;
        this.revealScale = 0.96;
        setTimeout(() => {
            this.revealOpacity = 1;
            this.revealScale = 1;
        }, 90);
    }
    private summaryPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 9 });
            Column.width('100%');
            Column.layoutWeight(1);
            Column.justifyContent(FlexAlign.Center);
            Column.padding({ left: 14, right: 14, top: 8, bottom: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.locale === 'en' ? 'Today' : '今日辅助');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.textColor);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.locale === 'en' ? 'Progress from the phone plan' : '来自手机端计划的训练进度');
            Text.fontSize(9);
            Text.fontColor(this.mutedColor);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 20 });
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 2 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.completedSets} / ${this.targetSets}`);
            Text.fontSize(26);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.primaryColor);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.locale === 'en' ? 'sets' : '组');
            Text.fontSize(10);
            Text.fontColor(this.mutedColor);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 2 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.completedRepetitions}`);
            Text.fontSize(26);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.primaryColor);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.locale === 'en' ? 'reps' : '次');
            Text.fontSize(10);
            Text.fontColor(this.mutedColor);
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 5 });
            Column.width('92%');
            Column.padding(10);
            Column.backgroundColor(this.accentColor);
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.locale === 'en' ? 'Keep the front and back passages moving together.' : '会阴前后方一起向内、向上提。');
            Text.fontSize(10);
            Text.fontColor(this.textColor);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.locale === 'en' ? 'Keep your belly, thighs and glutes relaxed.' : '腹部、大腿和臀部保持放松。');
            Text.fontSize(10);
            Text.fontColor(this.textColor);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.locale === 'en' ? 'Breathe normally · never hold your breath.' : '保持自然呼吸 · 不要憋气。');
            Text.fontSize(10);
            Text.fontColor(this.textColor);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.locale === 'en' ? 'Swipe right to start' : '右滑回到开始');
            Text.fontSize(9);
            Text.fontColor(this.mutedColor);
        }, Text);
        Text.pop();
        Column.pop();
    }
    private startPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Center });
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Keep the reveal fade separate from the repeating pulse. This avoids
            // fading the button out on every loop while still giving the start
            // affordance a visible, low-amplitude breathing animation.
            Stack.create({ alignContent: Alignment.Center });
            globalThis.Context.animation({ duration: 420, curve: Curve.EaseOut });
            // Keep the reveal fade separate from the repeating pulse. This avoids
            // fading the button out on every loop while still giving the start
            // affordance a visible, low-amplitude breathing animation.
            Stack.width('100%');
            // Keep the reveal fade separate from the repeating pulse. This avoids
            // fading the button out on every loop while still giving the start
            // affordance a visible, low-amplitude breathing animation.
            Stack.height('100%');
            // Keep the reveal fade separate from the repeating pulse. This avoids
            // fading the button out on every loop while still giving the start
            // affordance a visible, low-amplitude breathing animation.
            Stack.opacity(this.revealOpacity);
            globalThis.Context.animation(null);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.locale === 'en' ? 'Start' : '开始', { type: ButtonType.Circle });
            globalThis.Context.animation({ duration: 1400, curve: Curve.EaseInOut,
                iterations: -1, playMode: PlayMode.Alternate });
            Button.width('100%');
            Button.height('100%');
            Button.fontSize(28);
            Button.fontWeight(FontWeight.Bold);
            Button.fontColor(this.onPrimaryColor);
            Button.backgroundColor(this.primaryColor);
            Button.stateEffect(true);
            Button.scale({ x: this.revealScale, y: this.revealScale });
            globalThis.Context.animation(null);
            Button.onClick(() => this.onStart());
        }, Button);
        Button.pop();
        // Keep the reveal fade separate from the repeating pulse. This avoids
        // fading the button out on every loop while still giving the start
        // affordance a visible, low-amplitude breathing animation.
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Narrow edge hit targets keep the centre button fully tappable.
            Text.create('‹');
            // Narrow edge hit targets keep the centre button fully tappable.
            Text.width(44);
            // Narrow edge hit targets keep the centre button fully tappable.
            Text.height(56);
            // Narrow edge hit targets keep the centre button fully tappable.
            Text.fontSize(38);
            // Narrow edge hit targets keep the centre button fully tappable.
            Text.fontColor(this.primaryColor);
            // Narrow edge hit targets keep the centre button fully tappable.
            Text.textAlign(TextAlign.Center);
            // Narrow edge hit targets keep the centre button fully tappable.
            Text.position({ x: '2%', y: '42%' });
            // Narrow edge hit targets keep the centre button fully tappable.
            Text.onClick(() => this.onChangeTab(0));
        }, Text);
        // Narrow edge hit targets keep the centre button fully tappable.
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('›');
            Text.width(44);
            Text.height(56);
            Text.fontSize(38);
            Text.fontColor(this.primaryColor);
            Text.textAlign(TextAlign.Center);
            Text.position({ x: '86%', y: '42%' });
            Text.onClick(() => this.onChangeTab(2));
        }, Text);
        Text.pop();
        Stack.pop();
    }
    private reminderPage(parent = null) {
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new WearableReminderView(this, {
                        locale: this.locale,
                        primaryColor: this.primaryColor,
                        onPrimaryColor: this.onPrimaryColor,
                        pageBackground: this.pageBackground,
                        pageBorder: this.pageBorder,
                        accentColor: this.accentColor,
                        textColor: this.textColor,
                        mutedColor: this.mutedColor,
                        remindersEnabled: this.remindersEnabled,
                        reminderTimes: this.reminderTimes,
                        maxReminderCount: this.maxReminderCount,
                        onToggleReminders: () => this.onToggleReminders(),
                        onSetReminder: (index: number, value: string) => this.onSetReminder(index, value),
                        onAddReminder: () => this.onAddReminder(),
                        onRemoveReminder: (index: number) => this.onRemoveReminder(index)
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/wearable/WearableHomeView.ets", line: 122, col: 5 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            locale: this.locale,
                            primaryColor: this.primaryColor,
                            onPrimaryColor: this.onPrimaryColor,
                            pageBackground: this.pageBackground,
                            pageBorder: this.pageBorder,
                            accentColor: this.accentColor,
                            textColor: this.textColor,
                            mutedColor: this.mutedColor,
                            remindersEnabled: this.remindersEnabled,
                            reminderTimes: this.reminderTimes,
                            maxReminderCount: this.maxReminderCount,
                            onToggleReminders: () => this.onToggleReminders(),
                            onSetReminder: (index: number, value: string) => this.onSetReminder(index, value),
                            onAddReminder: () => this.onAddReminder(),
                            onRemoveReminder: (index: number) => this.onRemoveReminder(index)
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        locale: this.locale,
                        primaryColor: this.primaryColor,
                        onPrimaryColor: this.onPrimaryColor,
                        pageBackground: this.pageBackground,
                        pageBorder: this.pageBorder,
                        accentColor: this.accentColor,
                        textColor: this.textColor,
                        mutedColor: this.mutedColor,
                        remindersEnabled: this.remindersEnabled,
                        reminderTimes: this.reminderTimes,
                        maxReminderCount: this.maxReminderCount
                    });
                }
            }, { name: "WearableReminderView" });
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(this.pageBackground);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Swiper.create();
            Swiper.index(this.wearableTab);
            Swiper.loop(false);
            Swiper.indicator(false);
            Swiper.onChange((index: number) => this.onChangeTab(index));
            Swiper.layoutWeight(1);
            Swiper.width('100%');
        }, Swiper);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.summaryPage.bind(this)();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.startPage.bind(this)();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.reminderPage.bind(this)();
        Column.pop();
        Swiper.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
