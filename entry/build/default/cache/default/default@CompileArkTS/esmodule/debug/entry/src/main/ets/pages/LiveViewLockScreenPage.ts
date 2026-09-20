if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LiveViewLockScreenPage_Params {
    storage?: LocalStorage | undefined;
    phase?: string;
    progress?: string;
    remaining?: string;
    hint?: string;
}
class LiveViewLockScreenPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.storage = this.getUIContext().getSharedLocalStorage();
        this.__phase = new ObservedPropertySimplePU(this.storage?.get<string>('phase') ?? '训练进行中', this, "phase");
        this.__progress = new ObservedPropertySimplePU(this.storage?.get<string>('progress') ?? '训练进度', this, "progress");
        this.__remaining = new ObservedPropertySimplePU(this.storage?.get<string>('remaining') ?? '', this, "remaining");
        this.__hint = new ObservedPropertySimplePU(this.storage?.get<string>('hint') ?? '保持自然呼吸 · 腹部和臀部放松', this, "hint");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: LiveViewLockScreenPage_Params) {
        if (params.storage !== undefined) {
            this.storage = params.storage;
        }
        if (params.phase !== undefined) {
            this.phase = params.phase;
        }
        if (params.progress !== undefined) {
            this.progress = params.progress;
        }
        if (params.remaining !== undefined) {
            this.remaining = params.remaining;
        }
        if (params.hint !== undefined) {
            this.hint = params.hint;
        }
    }
    updateStateVars(params: LiveViewLockScreenPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__phase.purgeDependencyOnElmtId(rmElmtId);
        this.__progress.purgeDependencyOnElmtId(rmElmtId);
        this.__remaining.purgeDependencyOnElmtId(rmElmtId);
        this.__hint.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__phase.aboutToBeDeleted();
        this.__progress.aboutToBeDeleted();
        this.__remaining.aboutToBeDeleted();
        this.__hint.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private storage: LocalStorage | undefined;
    private __phase: ObservedPropertySimplePU<string>;
    get phase() {
        return this.__phase.get();
    }
    set phase(newValue: string) {
        this.__phase.set(newValue);
    }
    private __progress: ObservedPropertySimplePU<string>;
    get progress() {
        return this.__progress.get();
    }
    set progress(newValue: string) {
        this.__progress.set(newValue);
    }
    private __remaining: ObservedPropertySimplePU<string>;
    get remaining() {
        return this.__remaining.get();
    }
    set remaining(newValue: string) {
        this.__remaining.set(newValue);
    }
    private __hint: ObservedPropertySimplePU<string>;
    get hint() {
        return this.__hint.get();
    }
    set hint(newValue: string) {
        this.__hint.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Center });
            Stack.width('100%');
            Stack.height('100%');
            Stack.backgroundColor('#E6081715');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 18 });
            Column.alignItems(HorizontalAlign.Center);
            Column.padding({ left: 28, right: 28, top: 36, bottom: 36 });
            Column.backgroundColor('#E6087F73');
            Column.borderRadius(28);
            Column.width('86%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('凯格尔训练');
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FFFFFFFF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.phase);
            Text.fontSize(46);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FFFFFFFF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.progress);
            Text.fontSize(18);
            Text.fontColor('#D9FFFFFF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.remaining.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.remaining} 秒`);
                        Text.fontSize(16);
                        Text.fontColor('#D9FFFFFF');
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.hint);
            Text.fontSize(14);
            Text.fontColor('#B3FFFFFF');
        }, Text);
        Text.pop();
        Column.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "LiveViewLockScreenPage";
    }
}
registerNamedRoute(() => new LiveViewLockScreenPage(undefined, {}), "", { bundleName: "com.kaigeer.training", moduleName: "entry", pagePath: "pages/LiveViewLockScreenPage", pageFullPath: "entry/src/main/ets/pages/LiveViewLockScreenPage", integratedHsp: "false", moduleType: "followWithHap" });
