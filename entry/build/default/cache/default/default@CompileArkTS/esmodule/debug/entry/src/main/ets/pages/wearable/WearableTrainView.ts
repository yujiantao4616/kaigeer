if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WearableTrainView_Params {
    phase?: TrainingPhase;
    remaining?: number;
    repetition?: number;
    repetitions?: number;
    finishedSets?: number;
    setsPerDay?: number;
    paused?: boolean;
    countdownScale?: number;
    breathingScale?: number;
    breathingOffsetX?: number;
    breathingOffsetY?: number;
    progressPercent?: number;
    phaseLabel?: string;
    primaryColor?: string;
    onPrimaryColor?: string;
    pageBackground?: string;
    accentColor?: string;
    textColor?: string;
    mutedColor?: string;
    ringTrackColor?: string;
    completeLabel?: string;
    secondsLabel?: string;
    confirmStopLabel?: string;
    homeLabel?: string;
    startLabel?: string;
    locale?: string;
    onTogglePause?: () => void;
    onEnd?: () => void;
    onCompleteAction?: () => void;
}
import type { TrainingPhase } from '../../model/AppModel';
export class WearableTrainView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__phase = new SynchedPropertySimpleOneWayPU(params.phase, this, "phase");
        this.__remaining = new SynchedPropertySimpleOneWayPU(params.remaining, this, "remaining");
        this.__repetition = new SynchedPropertySimpleOneWayPU(params.repetition, this, "repetition");
        this.__repetitions = new SynchedPropertySimpleOneWayPU(params.repetitions, this, "repetitions");
        this.__finishedSets = new SynchedPropertySimpleOneWayPU(params.finishedSets, this, "finishedSets");
        this.__setsPerDay = new SynchedPropertySimpleOneWayPU(params.setsPerDay, this, "setsPerDay");
        this.__paused = new SynchedPropertySimpleOneWayPU(params.paused, this, "paused");
        this.__countdownScale = new SynchedPropertySimpleOneWayPU(params.countdownScale, this, "countdownScale");
        this.__breathingScale = new SynchedPropertySimpleOneWayPU(params.breathingScale, this, "breathingScale");
        this.__breathingOffsetX = new SynchedPropertySimpleOneWayPU(params.breathingOffsetX, this, "breathingOffsetX");
        this.__breathingOffsetY = new SynchedPropertySimpleOneWayPU(params.breathingOffsetY, this, "breathingOffsetY");
        this.__progressPercent = new SynchedPropertySimpleOneWayPU(params.progressPercent, this, "progressPercent");
        this.__phaseLabel = new SynchedPropertySimpleOneWayPU(params.phaseLabel, this, "phaseLabel");
        this.__primaryColor = new SynchedPropertySimpleOneWayPU(params.primaryColor, this, "primaryColor");
        this.__onPrimaryColor = new SynchedPropertySimpleOneWayPU(params.onPrimaryColor, this, "onPrimaryColor");
        this.__pageBackground = new SynchedPropertySimpleOneWayPU(params.pageBackground, this, "pageBackground");
        this.__accentColor = new SynchedPropertySimpleOneWayPU(params.accentColor, this, "accentColor");
        this.__textColor = new SynchedPropertySimpleOneWayPU(params.textColor, this, "textColor");
        this.__mutedColor = new SynchedPropertySimpleOneWayPU(params.mutedColor, this, "mutedColor");
        this.__ringTrackColor = new SynchedPropertySimpleOneWayPU(params.ringTrackColor, this, "ringTrackColor");
        this.__completeLabel = new SynchedPropertySimpleOneWayPU(params.completeLabel, this, "completeLabel");
        this.__secondsLabel = new SynchedPropertySimpleOneWayPU(params.secondsLabel, this, "secondsLabel");
        this.__confirmStopLabel = new SynchedPropertySimpleOneWayPU(params.confirmStopLabel, this, "confirmStopLabel");
        this.__homeLabel = new SynchedPropertySimpleOneWayPU(params.homeLabel, this, "homeLabel");
        this.__startLabel = new SynchedPropertySimpleOneWayPU(params.startLabel, this, "startLabel");
        this.__locale = new SynchedPropertySimpleOneWayPU(params.locale, this, "locale");
        this.onTogglePause = () => { };
        this.onEnd = () => { };
        this.onCompleteAction = () => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WearableTrainView_Params) {
        if (params.phase === undefined) {
            this.__phase.set('ready');
        }
        if (params.remaining === undefined) {
            this.__remaining.set(0);
        }
        if (params.repetition === undefined) {
            this.__repetition.set(0);
        }
        if (params.repetitions === undefined) {
            this.__repetitions.set(10);
        }
        if (params.finishedSets === undefined) {
            this.__finishedSets.set(0);
        }
        if (params.setsPerDay === undefined) {
            this.__setsPerDay.set(3);
        }
        if (params.paused === undefined) {
            this.__paused.set(false);
        }
        if (params.countdownScale === undefined) {
            this.__countdownScale.set(1);
        }
        if (params.breathingScale === undefined) {
            this.__breathingScale.set(1);
        }
        if (params.breathingOffsetX === undefined) {
            this.__breathingOffsetX.set(0);
        }
        if (params.breathingOffsetY === undefined) {
            this.__breathingOffsetY.set(0);
        }
        if (params.progressPercent === undefined) {
            this.__progressPercent.set(0);
        }
        if (params.phaseLabel === undefined) {
            this.__phaseLabel.set('');
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
        if (params.accentColor === undefined) {
            this.__accentColor.set('#E8F6F2');
        }
        if (params.textColor === undefined) {
            this.__textColor.set('#17312D');
        }
        if (params.mutedColor === undefined) {
            this.__mutedColor.set('#617571');
        }
        if (params.ringTrackColor === undefined) {
            this.__ringTrackColor.set('#D7E3E0');
        }
        if (params.completeLabel === undefined) {
            this.__completeLabel.set('Set complete');
        }
        if (params.secondsLabel === undefined) {
            this.__secondsLabel.set('sec');
        }
        if (params.confirmStopLabel === undefined) {
            this.__confirmStopLabel.set('End session');
        }
        if (params.homeLabel === undefined) {
            this.__homeLabel.set("Today's practice");
        }
        if (params.startLabel === undefined) {
            this.__startLabel.set('Start training');
        }
        if (params.locale === undefined) {
            this.__locale.set('zh');
        }
        if (params.onTogglePause !== undefined) {
            this.onTogglePause = params.onTogglePause;
        }
        if (params.onEnd !== undefined) {
            this.onEnd = params.onEnd;
        }
        if (params.onCompleteAction !== undefined) {
            this.onCompleteAction = params.onCompleteAction;
        }
    }
    updateStateVars(params: WearableTrainView_Params) {
        this.__phase.reset(params.phase);
        this.__remaining.reset(params.remaining);
        this.__repetition.reset(params.repetition);
        this.__repetitions.reset(params.repetitions);
        this.__finishedSets.reset(params.finishedSets);
        this.__setsPerDay.reset(params.setsPerDay);
        this.__paused.reset(params.paused);
        this.__countdownScale.reset(params.countdownScale);
        this.__breathingScale.reset(params.breathingScale);
        this.__breathingOffsetX.reset(params.breathingOffsetX);
        this.__breathingOffsetY.reset(params.breathingOffsetY);
        this.__progressPercent.reset(params.progressPercent);
        this.__phaseLabel.reset(params.phaseLabel);
        this.__primaryColor.reset(params.primaryColor);
        this.__onPrimaryColor.reset(params.onPrimaryColor);
        this.__pageBackground.reset(params.pageBackground);
        this.__accentColor.reset(params.accentColor);
        this.__textColor.reset(params.textColor);
        this.__mutedColor.reset(params.mutedColor);
        this.__ringTrackColor.reset(params.ringTrackColor);
        this.__completeLabel.reset(params.completeLabel);
        this.__secondsLabel.reset(params.secondsLabel);
        this.__confirmStopLabel.reset(params.confirmStopLabel);
        this.__homeLabel.reset(params.homeLabel);
        this.__startLabel.reset(params.startLabel);
        this.__locale.reset(params.locale);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__phase.purgeDependencyOnElmtId(rmElmtId);
        this.__remaining.purgeDependencyOnElmtId(rmElmtId);
        this.__repetition.purgeDependencyOnElmtId(rmElmtId);
        this.__repetitions.purgeDependencyOnElmtId(rmElmtId);
        this.__finishedSets.purgeDependencyOnElmtId(rmElmtId);
        this.__setsPerDay.purgeDependencyOnElmtId(rmElmtId);
        this.__paused.purgeDependencyOnElmtId(rmElmtId);
        this.__countdownScale.purgeDependencyOnElmtId(rmElmtId);
        this.__breathingScale.purgeDependencyOnElmtId(rmElmtId);
        this.__breathingOffsetX.purgeDependencyOnElmtId(rmElmtId);
        this.__breathingOffsetY.purgeDependencyOnElmtId(rmElmtId);
        this.__progressPercent.purgeDependencyOnElmtId(rmElmtId);
        this.__phaseLabel.purgeDependencyOnElmtId(rmElmtId);
        this.__primaryColor.purgeDependencyOnElmtId(rmElmtId);
        this.__onPrimaryColor.purgeDependencyOnElmtId(rmElmtId);
        this.__pageBackground.purgeDependencyOnElmtId(rmElmtId);
        this.__accentColor.purgeDependencyOnElmtId(rmElmtId);
        this.__textColor.purgeDependencyOnElmtId(rmElmtId);
        this.__mutedColor.purgeDependencyOnElmtId(rmElmtId);
        this.__ringTrackColor.purgeDependencyOnElmtId(rmElmtId);
        this.__completeLabel.purgeDependencyOnElmtId(rmElmtId);
        this.__secondsLabel.purgeDependencyOnElmtId(rmElmtId);
        this.__confirmStopLabel.purgeDependencyOnElmtId(rmElmtId);
        this.__homeLabel.purgeDependencyOnElmtId(rmElmtId);
        this.__startLabel.purgeDependencyOnElmtId(rmElmtId);
        this.__locale.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__phase.aboutToBeDeleted();
        this.__remaining.aboutToBeDeleted();
        this.__repetition.aboutToBeDeleted();
        this.__repetitions.aboutToBeDeleted();
        this.__finishedSets.aboutToBeDeleted();
        this.__setsPerDay.aboutToBeDeleted();
        this.__paused.aboutToBeDeleted();
        this.__countdownScale.aboutToBeDeleted();
        this.__breathingScale.aboutToBeDeleted();
        this.__breathingOffsetX.aboutToBeDeleted();
        this.__breathingOffsetY.aboutToBeDeleted();
        this.__progressPercent.aboutToBeDeleted();
        this.__phaseLabel.aboutToBeDeleted();
        this.__primaryColor.aboutToBeDeleted();
        this.__onPrimaryColor.aboutToBeDeleted();
        this.__pageBackground.aboutToBeDeleted();
        this.__accentColor.aboutToBeDeleted();
        this.__textColor.aboutToBeDeleted();
        this.__mutedColor.aboutToBeDeleted();
        this.__ringTrackColor.aboutToBeDeleted();
        this.__completeLabel.aboutToBeDeleted();
        this.__secondsLabel.aboutToBeDeleted();
        this.__confirmStopLabel.aboutToBeDeleted();
        this.__homeLabel.aboutToBeDeleted();
        this.__startLabel.aboutToBeDeleted();
        this.__locale.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __phase: SynchedPropertySimpleOneWayPU<TrainingPhase>;
    get phase() {
        return this.__phase.get();
    }
    set phase(newValue: TrainingPhase) {
        this.__phase.set(newValue);
    }
    private __remaining: SynchedPropertySimpleOneWayPU<number>;
    get remaining() {
        return this.__remaining.get();
    }
    set remaining(newValue: number) {
        this.__remaining.set(newValue);
    }
    private __repetition: SynchedPropertySimpleOneWayPU<number>;
    get repetition() {
        return this.__repetition.get();
    }
    set repetition(newValue: number) {
        this.__repetition.set(newValue);
    }
    private __repetitions: SynchedPropertySimpleOneWayPU<number>;
    get repetitions() {
        return this.__repetitions.get();
    }
    set repetitions(newValue: number) {
        this.__repetitions.set(newValue);
    }
    private __finishedSets: SynchedPropertySimpleOneWayPU<number>;
    get finishedSets() {
        return this.__finishedSets.get();
    }
    set finishedSets(newValue: number) {
        this.__finishedSets.set(newValue);
    }
    private __setsPerDay: SynchedPropertySimpleOneWayPU<number>;
    get setsPerDay() {
        return this.__setsPerDay.get();
    }
    set setsPerDay(newValue: number) {
        this.__setsPerDay.set(newValue);
    }
    private __paused: SynchedPropertySimpleOneWayPU<boolean>;
    get paused() {
        return this.__paused.get();
    }
    set paused(newValue: boolean) {
        this.__paused.set(newValue);
    }
    private __countdownScale: SynchedPropertySimpleOneWayPU<number>;
    get countdownScale() {
        return this.__countdownScale.get();
    }
    set countdownScale(newValue: number) {
        this.__countdownScale.set(newValue);
    }
    private __breathingScale: SynchedPropertySimpleOneWayPU<number>;
    get breathingScale() {
        return this.__breathingScale.get();
    }
    set breathingScale(newValue: number) {
        this.__breathingScale.set(newValue);
    }
    private __breathingOffsetX: SynchedPropertySimpleOneWayPU<number>;
    get breathingOffsetX() {
        return this.__breathingOffsetX.get();
    }
    set breathingOffsetX(newValue: number) {
        this.__breathingOffsetX.set(newValue);
    }
    private __breathingOffsetY: SynchedPropertySimpleOneWayPU<number>;
    get breathingOffsetY() {
        return this.__breathingOffsetY.get();
    }
    set breathingOffsetY(newValue: number) {
        this.__breathingOffsetY.set(newValue);
    }
    private __progressPercent: SynchedPropertySimpleOneWayPU<number>;
    get progressPercent() {
        return this.__progressPercent.get();
    }
    set progressPercent(newValue: number) {
        this.__progressPercent.set(newValue);
    }
    private __phaseLabel: SynchedPropertySimpleOneWayPU<string>;
    get phaseLabel() {
        return this.__phaseLabel.get();
    }
    set phaseLabel(newValue: string) {
        this.__phaseLabel.set(newValue);
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
    private __ringTrackColor: SynchedPropertySimpleOneWayPU<string>;
    get ringTrackColor() {
        return this.__ringTrackColor.get();
    }
    set ringTrackColor(newValue: string) {
        this.__ringTrackColor.set(newValue);
    }
    private __completeLabel: SynchedPropertySimpleOneWayPU<string>;
    get completeLabel() {
        return this.__completeLabel.get();
    }
    set completeLabel(newValue: string) {
        this.__completeLabel.set(newValue);
    }
    private __secondsLabel: SynchedPropertySimpleOneWayPU<string>;
    get secondsLabel() {
        return this.__secondsLabel.get();
    }
    set secondsLabel(newValue: string) {
        this.__secondsLabel.set(newValue);
    }
    private __confirmStopLabel: SynchedPropertySimpleOneWayPU<string>;
    get confirmStopLabel() {
        return this.__confirmStopLabel.get();
    }
    set confirmStopLabel(newValue: string) {
        this.__confirmStopLabel.set(newValue);
    }
    private __homeLabel: SynchedPropertySimpleOneWayPU<string>;
    get homeLabel() {
        return this.__homeLabel.get();
    }
    set homeLabel(newValue: string) {
        this.__homeLabel.set(newValue);
    }
    private __startLabel: SynchedPropertySimpleOneWayPU<string>;
    get startLabel() {
        return this.__startLabel.get();
    }
    set startLabel(newValue: string) {
        this.__startLabel.set(newValue);
    }
    private __locale: SynchedPropertySimpleOneWayPU<string>;
    get locale() {
        return this.__locale.get();
    }
    set locale(newValue: string) {
        this.__locale.set(newValue);
    }
    private onTogglePause: () => void;
    private onEnd: () => void;
    private onCompleteAction: () => void;
    private primaryFilter(): ColorFilter {
        const hex: string = this.primaryColor.substring(1);
        const red: number = parseInt(hex.substring(0, 2), 16) / 255;
        const green: number = parseInt(hex.substring(2, 4), 16) / 255;
        const blue: number = parseInt(hex.substring(4, 6), 16) / 255;
        return new ColorFilter([
            0, 0, 0, 0, red,
            0, 0, 0, 0, green,
            0, 0, 0, 0, blue,
            0, 0, 0, 1, 0
        ]);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(this.pageBackground);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Center });
            Stack.layoutWeight(1);
            Stack.width('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Center });
            globalThis.Context.animation({ duration: 120, curve: Curve.EaseInOut });
            Stack.width('100%');
            Stack.height('100%');
            Stack.scale({ x: this.breathingScale, y: this.breathingScale });
            Stack.offset({ x: this.breathingOffsetX, y: this.breathingOffsetY });
            globalThis.Context.animation(null);
            globalThis.Gesture.create(GesturePriority.Low);
            TapGesture.create({ count: 1 });
            TapGesture.onAction(() => {
                if (this.phase !== 'complete') {
                    this.onTogglePause();
                }
            });
            TapGesture.pop();
            globalThis.Gesture.pop();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width('98%');
            Circle.height('98%');
            Circle.fillOpacity(0);
            Circle.strokeWidth(2);
            Circle.stroke(this.primaryColor);
            Circle.strokeOpacity(0.18);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Progress.create({ value: this.progressPercent, total: 100, type: ProgressType.Ring });
            globalThis.Context.animation({ duration: 220, curve: Curve.EaseInOut });
            Progress.width('94%');
            Progress.height('94%');
            Progress.color(this.primaryColor);
            Progress.backgroundColor(this.ringTrackColor);
            Progress.style({ strokeWidth: 14 });
            globalThis.Context.animation(null);
        }, Progress);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width('72%');
            Circle.height('72%');
            Circle.fill(this.accentColor);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 2 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // Keep the paused state structurally identical to the active state:
            // only the countdown value/label becomes a play affordance.
            if (this.paused && this.phase !== 'complete') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 0, "type": 30000, params: ['icons/play.svg'], "bundleName": "com.kaigeer.training", "moduleName": "entry" });
                        Image.width(56);
                        Image.height(56);
                        Image.objectFit(ImageFit.Contain);
                        Image.colorFilter(this.primaryFilter());
                        Image.onClick(() => this.onTogglePause());
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.phase === 'complete' ? '✓' : `${this.remaining}`);
                        Text.fontSize(48);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(this.textColor);
                        Text.scale({ x: this.countdownScale, y: this.countdownScale });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.phase === 'complete' ? this.completeLabel : this.secondsLabel);
                        Text.fontSize(11);
                        Text.fontColor(this.mutedColor);
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // The action cue remains visible while paused so the user knows
            // exactly what will resume next.
            Text.create(this.phaseLabel);
            // The action cue remains visible while paused so the user knows
            // exactly what will resume next.
            Text.fontSize(16);
            // The action cue remains visible while paused so the user knows
            // exactly what will resume next.
            Text.fontWeight(FontWeight.Medium);
            // The action cue remains visible while paused so the user knows
            // exactly what will resume next.
            Text.fontColor(this.primaryColor);
        }, Text);
        // The action cue remains visible while paused so the user knows
        // exactly what will resume next.
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.repetition} / ${this.repetitions}`);
            Text.fontSize(12);
            Text.fontColor(this.mutedColor);
        }, Text);
        Text.pop();
        Column.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.paused && this.phase !== 'complete') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // Keep the end action outside the animated content layer. This
                        // preserves the capsule/irregular shape while the ring breathes.
                        Button.createWithLabel(this.confirmStopLabel, { type: ButtonType.Capsule });
                        // Keep the end action outside the animated content layer. This
                        // preserves the capsule/irregular shape while the ring breathes.
                        Button.width('82%');
                        // Keep the end action outside the animated content layer. This
                        // preserves the capsule/irregular shape while the ring breathes.
                        Button.height(40);
                        // Keep the end action outside the animated content layer. This
                        // preserves the capsule/irregular shape while the ring breathes.
                        Button.fontSize(12);
                        // Keep the end action outside the animated content layer. This
                        // preserves the capsule/irregular shape while the ring breathes.
                        Button.fontColor(this.onPrimaryColor);
                        // Keep the end action outside the animated content layer. This
                        // preserves the capsule/irregular shape while the ring breathes.
                        Button.backgroundColor(this.primaryColor);
                        // Keep the end action outside the animated content layer. This
                        // preserves the capsule/irregular shape while the ring breathes.
                        Button.align(Alignment.Bottom);
                        // Keep the end action outside the animated content layer. This
                        // preserves the capsule/irregular shape while the ring breathes.
                        Button.zIndex(10);
                        // Keep the end action outside the animated content layer. This
                        // preserves the capsule/irregular shape while the ring breathes.
                        Button.onClick(() => this.onEnd());
                    }, Button);
                    // Keep the end action outside the animated content layer. This
                    // preserves the capsule/irregular shape while the ring breathes.
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.phase === 'complete') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.finishedSets >= this.setsPerDay ? this.homeLabel : this.startLabel, { type: ButtonType.Capsule });
                        Button.width('82%');
                        Button.height(40);
                        Button.fontSize(12);
                        Button.fontColor(this.onPrimaryColor);
                        Button.backgroundColor(this.primaryColor);
                        Button.onClick(() => this.onCompleteAction());
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
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
